<template>
    <div class="container">
        <div class="section">
            <entity-header 
                title="Длительности"
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
            v-model="filter"
        />
        <entity-modal
            refs="create"
            :title="entityModalTitle"
            :actionFindTitle="actionFindTitle"
            :inputs="entityFields"
            v-model="entity"
        />
        <modal-confirm 
            @accept="actionAccepted" 
            v-model:instance="confirmAction"
        >
            <h5>Удалить длительность?</h5>
        </modal-confirm>
    </div>
</template>

<script>
import EntityHeader from '@/components/EntityHeader.vue'
import EntityTable from '@/components/EntityTable.vue'
import EntityModal from '@/components/EntityModal.vue'
import ModalConfirm from '@/components/ModalConfirm.vue'
import PreLoader from '@/components/PreLoader.vue'

import {EntityAPI} from "@/api/Entity"
import {lessonDurationsHeaders} from '@/assets/headers'
import {lessonDurationsFilters} from '@/assets/filters'
import {lessonDurationsCreateFields} from '@/assets/entityFields'
import {lessonDurationsUpdateFields} from '@/assets/entityFields'

export default {
    components: { EntityHeader, EntityTable, EntityModal, ModalConfirm, PreLoader },
    name: "LessonsDurationsView",
    data: () => ({
        isLoad: false,

        filter: '',
        displayFilter: '',

        entityModalTitle: '',
        actionFindTitle: '',
        entityFields: [],
        entity: '',
        
        selectedEntity: {},
        confirmAction: {},

        headers: lessonDurationsHeaders,
        filters: lessonDurationsFilters,
        data: []
    }),
    methods: {
        async fetchData(queryFilter) {
            this.isLoad = true
            if(!queryFilter) {
                queryFilter = ''
            }

            EntityAPI.get(queryFilter).then((res) => {
                res.data.forEach((row, index) => {
                    res.data[index]['id'] = row['id'].toString()
                })
                this.data = res.data
                }).catch((e) => {
                    M.toast({html: 'Ошибка загрузки данных! ' + e.response.data.message, classes: 'red-text white'})
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
            this.entityModalTitle = 'Создание Длительности' 
            this.actionFindTitle = 'Создать'
            this.entityFields = lessonDurationsCreateFields
        },
        actionEdit(entity) {
            this.selectedEntity = entity
            this.entity = this.entityToString(entity)
            this.entityModalTitle = 'Изменение Длительности' 
            this.actionFindTitle = 'Изменить'
            this.entityFields = lessonDurationsUpdateFields
        },
        actionDelete(entity) {
            this.selectedEntity = entity
            this.confirmAction.open()
        },

        actionAccepted() {
            EntityAPI.delete(this.selectedEntity.id).then(() => {
                this.data.forEach((item, iter) => {
                    if (item['id'] === this.selectedEntity.id) {
                        this.data.splice(iter,1)
                    }
                })
                M.toast({html: "Длительность удалена", classes: 'green-text white'})
                }).catch((e) => {
                    M.toast({html: 'Ошибка! ' + e.response.data.message, classes: 'red-text white'})
                    })
        }
    },
    mounted() {
        EntityAPI.entity = 'lessons/durations'
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
                        EntityAPI.put(id, entity).then(() => {
                            this.updateData(id, entity)
                            M.toast({html: "Длительность изменена!", classes: 'green-text white'})
                            }).catch((e) => {
                                M.toast({html: 'Ошибка! ' + e.response.data.message, classes: 'red-text white'})
                                })
                    }
                }
                else {
                    EntityAPI.post(entity).then(() => {
                        this.fetchData()
                        M.toast({html: "Длительность создана!", classes: 'green-text white'})
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