<template>
    <div class="container">
        <div class="section">
            <entity-header 
                title="Пользователи"
                showAddButton
                v-model:filter="displayFilter"
                @addClick="actionCreate"
            />
        </div>
        <div class="divider"></div>
        <div v-if="!isLoad" class="section">
            <div v-if="data.length > 0">
                <entity-table
                    :headers="headers"
                    :data="data"
                    :roles="roles"
                    :actives="actives"
                    editRow
                    deleteRow
                    @editRow="actionEdit"
                    @deleteRow="actionDelete"
                />
            </div>
            <div v-else class="center-align">
                <h4>Данных нет</h4>
            </div>
        </div>
        <div v-else class="section">
            <pre-loader class="center-align"></pre-loader>
        </div>

        <entity-modal
            refs="filter"
            title="Поиск"
            actionFindTitle="Найти"
            :inputs="filters" 
            :roles="roles"
            :actives="actives"
            v-model="filter"
        />
        <entity-modal
            refs="create"
            :title="entityModalTitle"
            :actionFindTitle="entityModalAction"
            :inputs="entityModalFields" 
            :roles="roles"
            :actives="actives"
            v-model="entity"
        />
        <modal-confirm 
            @accept="actionAccepted" 
            v-model:instance="confirmModalInstance"
        >
            <h5>Удалить пользователя?</h5>
        </modal-confirm>
    </div>
</template>

<script>
import EntityHeader from '@/components/EntityHeader.vue'
import EntityTable from '@/components/EntityTable.vue'
import EntityModal from '@/components/EntityModal.vue'
import ModalConfirm from '@/components/ModalConfirm.vue'
import PreLoader from '@/components/PreLoader.vue'

import {UserAPI} from "@/api/Entity"
import {usersRoles} from '@/assets/statuses'
import {usersActive} from '@/assets/statuses'
import {usersHeaders} from '@/assets/headers'
import {usersFilters} from '@/assets/filters'
import {usersCreateFields} from '@/assets/entityFields'
import {usersUpdateFields} from '@/assets/entityFields'

export default {
    components: { EntityHeader, EntityTable, EntityModal, ModalConfirm, PreLoader },
    name: "UsersView",
    data: () => ({
        isLoad: false,

        filter: '',
        displayFilter: '',

        entityModalTitle: '',
        entityModalAction: '',
        entityModalFields: [],
        entity: '',
        
        selectedEntity: {},
        confirmModalInstance: {},

        roles: usersRoles,
        actives: usersActive,
        headers: usersHeaders,
        filters: usersFilters,
        data: []
    }),
    methods: {
        async fetchData(queryFilter) {
            this.isLoad = true
            if(!queryFilter) {
                queryFilter = ''
            }

            UserAPI.get(queryFilter).then((res) => {
                res.data.forEach((row, index) => {
                    res.data[index]['roles'] = row['roles'].join(', ')
                    res.data[index]['active'] = row['active'].toString()
                    res.data[index]['id'] = row['id'].toString()
                })
                this.data = res.data
                }).catch((e) => {
                    M.toast({html: 'Ошибка загрузки данных! ' + e, classes: 'red-text white'})
                    }).finally(() => {
                         this.isLoad = false
                         })
        },

        updateData(id, modData) {
            this.data.forEach((row, index) => {
                if (row['id'] === id) {
                    Object.keys(modData).forEach((key) => {
                        this.data[index][key] = modData[key]
                    })
                }
            })
        },
        entityToString(entity) {
            let entityString = '?'
            Object.keys(entity).forEach((key, iter) => {
                if (iter === 0)
                    entityString = entityString + `${key}=${entity[key]}`
                else
                    entityString = entityString + `&${key}=${entity[key]}`
            })
            return entityString
        },

        actionCreate() {
            this.entityModalTitle = 'Создание пользователя' 
            this.entityModalAction = 'Создать'
            this.entityModalFields = usersCreateFields
        },
        actionEdit(entity) {
            this.selectedEntity = entity
            this.entity = this.entityToString(entity)
            this.entityModalTitle = 'Изменение пользователя' 
            this.entityModalAction = 'Изменить'
            this.entityModalFields = usersUpdateFields
        },
        actionDelete(entity) {
            if (entity.id == localStorage.getItem('userId')) {
                M.toast({html: "Не возможно удалить самого себя!", classes: 'red-text white'})
            } else {
                this.selectedEntity = entity
                this.confirmModalInstance.open()
            }
        },

        actionAccepted() {
            UserAPI.delete(this.selectedEntity.id).then(() => {
                this.data.forEach((item, iter) => {
                    if (item['id'] === this.selectedEntity.id) {
                        this.data.splice(iter,1)
                    }
                })
                M.toast({html: "Пользователь удален", classes: 'green-text white'})
                }).catch((e) => {
                    M.toast({html: 'Ошибка! ' + e, classes: 'red-text white'})
                    })
        }
    },
    mounted() {
        this.fetchData()
    },
    watch: {
        displayFilter() {
            if (this.displayFilter === '')
                this.filter = ''
        },
        filter() {
            this.displayFilter = this.filter
            this.displayFilter.slice(1).split('&').forEach((item) => {
                const filterItem = item.split('=')

                this.filters.forEach((filter) => {
                    if (filter.target === filterItem[0]) {
                         if (filter.target == 'status'){
                            this.statuses.forEach((status) => {
                                if (status.type == filterItem[1]){
                                    this.displayFilter = this.displayFilter.replace(item, filter.title + ": " + status.title)
                                }
                            })
                        }

                        if (filter.target == 'roles'){
                            this.roles.forEach((status) => {
                                if (status.type == filterItem[1]){
                                    this.displayFilter = this.displayFilter.replace(item, filter.title + ": " + status.title)
                                }
                            })
                        }

                        if (filter.target == 'active'){
                            this.actives.forEach((status) => {
                                if (status.type == filterItem[1]){
                                    this.displayFilter = this.displayFilter.replace(item, filter.title + ": " + status.title)
                                }
                            })
                        }

                        this.displayFilter = this.displayFilter.replace(item, filter.title + ": " + filterItem[1])
                    }
                })
            })
            this.displayFilter = this.displayFilter.slice(1).replaceAll('&', ', ')
            this.fetchData(this.filter)
        },
        entity() {
            if (this.entity !== '') {
                const entity = {}
                this.entity.slice(1).split('&').forEach((field) => {
                    const fieldItems = field.split('=')
                    entity[fieldItems[0]] = fieldItems[1]
                })
                const id = entity['id']
                if (id) {
                    if (JSON.stringify(this.selectedEntity) !== JSON.stringify(entity)) {
                        delete entity['id']
                        UserAPI.updateFull(id, entity).then(() => {
                            this.updateData(id, entity)
                            M.toast({html: "Пользователь изменен!", classes: 'green-text white'})
                            }).catch((e) => {
                                M.toast({html: 'Ошибка! ' + e, classes: 'red-text white'})
                                })
                    }
                }
                else {
                    UserAPI.create(entity).then(() => {
                        this.fetchData()
                        M.toast({html: "Пользователь создан!", classes: 'green-text white'})
                        }).catch((e) => {
                            M.toast({html: 'Ошибка! ' + e.response.data.message, classes: 'red-text white'})
                            })
                    this.entity = ''
                }
            }
        }
    }
}
</script>
