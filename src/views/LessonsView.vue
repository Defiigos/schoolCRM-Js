<template>
    <div class="container">
        <div class="section">
            <entity-header 
                title="Уроки"
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
                    :statuses="statuses"
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
            :statuses="statuses"
            v-model="filter"
        />
        <entity-modal
            refs="create"
            :title="entityModalTitle"
            :actionFindTitle="entityModalAction"
            :inputs="entityModalFields" 
            :statuses="statuses"
            :lessonDurations="lessonDurations"
            :locations="locations"
            :lessonGroups="lessonGroups"
            :paymentAmounts="paymentAmounts"
            :teachers="teachers" 
            v-model="entity"
        />
        <modal-confirm 
            @accept="actionAccepted" 
            v-model:instance="confirmModalInstance"
        >
            <h5>Удалить Урок?</h5>
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
import {lessonsStatuses} from '@/assets/statuses'
import {lessonsUserHeaders} from '@/assets/headers'
import {lessonsAdminHeaders} from '@/assets/headers'
import {lessonsUserFilters} from '@/assets/filters'
import {lessonsAdminFilters} from '@/assets/filters'
import {lessonsUserCreateFields} from '@/assets/entityFields'
import {lessonsAdminCreateFields} from '@/assets/entityFields'
import {lessonsUserUpdateFields} from '@/assets/entityFields'
import {lessonsAdminUpdateFields} from '@/assets/entityFields'

export default {
    components: { EntityHeader, EntityTable, EntityModal, ModalConfirm, PreLoader },
    name: "LessonsView",
    data: () => ({
        isLoad: false,

        filter: '',
        displayFilter: '',

        entityModalTitle: '',
        entityModalAction: '',
        entityModalFields: [],
        entity: '',
        lessonDurations: [],
        locations: [],
        lessonGroups: [],
        paymentAmounts: [],
        teachers: [],

        selectedEntity: {},
        confirmModalInstance: {},

        statuses: lessonsStatuses,
        headers: [],
        filters: [],
        data: []
    }),
    methods: {
        async fetchData(queryFilter) {
            this.isLoad = true
            if(!queryFilter) {
                queryFilter = ''
            }
            if (localStorage.hasOwnProperty('userRoles'))
                if (localStorage.getItem('userRoles') === 'ROLE_USER')
                    queryFilter = `?teacherId=${localStorage.getItem('userId')} ${queryFilter}`
            
            EntityAPI.get(queryFilter).then((res) => {
                res.data.forEach((row, index) => {
                    res.data[index]['id'] = row['id'].toString()
                    res.data[index]['teacher'] = row['teacher']['name']
                    res.data[index]['duration'] = row['duration']['name']
                    res.data[index]['location'] = row['location']['name']
                    res.data[index]['lessonGroup'] = row['lessonGroup']['name']
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
            this.entityModalTitle = 'Создание Урока' 
            this.entityModalAction = 'Создать'

             if (localStorage.hasOwnProperty('userRoles'))
                if (localStorage.getItem('userRoles') === 'ROLE_USER') {
                    this.entityModalFields = lessonsUserCreateFields
                }
                else {
                    this.entityModalFields = lessonsAdminCreateFields
                }
        },
        actionEdit(entity) {
            this.selectedEntity = entity
            this.entity = this.entityToString(entity)
            this.entityModalTitle = 'Изменение Урока' 
            this.entityModalAction = 'Изменить'
            if (localStorage.hasOwnProperty('userRoles'))
                if (localStorage.getItem('userRoles') === 'ROLE_USER') {
                    this.entityModalFields = lessonsUserUpdateFields
                }
                else {
                    this.entityModalFields = lessonsAdminUpdateFields
                }
        },
        actionDelete(entity) {
            this.selectedEntity = entity
            this.confirmModalInstance.open()
        },

        actionAccepted() {
            EntityAPI.delete(this.selectedEntity.id).then(() => {
                this.data.forEach((item, iter) => {
                    if (item['id'] === this.selectedEntity.id) {
                        this.data.splice(iter,1)
                    }
                })
                M.toast({html: "Урок удален", classes: 'green-text white'})
                }).catch((e) => {
                    M.toast({html: 'Ошибка! ' + e.response.data.message, classes: 'red-text white'})
                    })
        }
    },
    mounted() {
        EntityAPI.entity = 'lessons/durations'
        EntityAPI.get().then((res) => {
            const durations = []
            res.data.forEach((row) => {
                const duration = {
                    title: row['name'],
                    type: row['id'].toString()
                }
                durations.push(duration)
            })
            this.lessonDurations = durations
            }).catch((e) => {
                M.toast({html: 'Ошибка загрузки данных! ' + e, classes: 'red-text white'})
                })

        EntityAPI.entity = 'locations'
        EntityAPI.get('?status=LOCATION_ACTIVE').then((res) => {
            const locations = []
            res.data.forEach((row) => {
                const location = {
                    title: row['name'],
                    type: row['id'].toString()
                }
                locations.push(location)
            })
            this.locations = locations
            }).catch((e) => {
                M.toast({html: 'Ошибка загрузки данных! ' + e, classes: 'red-text white'})
                })
        
        EntityAPI.entity = 'lessons/groups'
        EntityAPI.get('?status=LESSON_GROUP_ACTIVE').then((res) => {
            const groups = []
            res.data.forEach((row) => {
                const group = {
                    title: row['name'],
                    type: row['id'].toString()
                }
                groups.push(group)
            })
            this.lessonGroups = groups
            }).catch((e) => {
                M.toast({html: 'Ошибка загрузки данных! ' + e, classes: 'red-text white'})
                })

        EntityAPI.entity = 'payments/amounts'
        EntityAPI.get().then((res) => {
            const amounts = []
            res.data.forEach((row) => {
                const amount = {
                    title: row['name'],
                    type: row['id'].toString()
                }
                amounts.push(amount)
            })
            this.paymentAmounts = amounts
            }).catch((e) => {
                M.toast({html: 'Ошибка загрузки данных! ' + e, classes: 'red-text white'})
                })

        if (localStorage.hasOwnProperty('userRoles'))
            if (localStorage.getItem('userRoles') === 'ROLE_ADMIN' || localStorage.getItem('userRoles') === 'ROLE_SUPERADMIN') {
                EntityAPI.entity = 'users'
                EntityAPI.get('?active=true').then((res) => {
                    const teachers = []
                    res.data.forEach((row) => {
                        const teacher = {
                            title: row['username'],
                            type: row['id'].toString()
                        }
                        teachers.push(teacher)
                    })
                    this.teachers = teachers
                    }).catch((e) => {
                        M.toast({html: 'Ошибка загрузки данных! ' + e, classes: 'red-text white'})
                        })
            }

        EntityAPI.entity = 'lessons'
        this.fetchData()

        if (localStorage.hasOwnProperty('userRoles'))
          if (localStorage.getItem('userRoles') === 'ROLE_USER') {
            this.headers = lessonsUserHeaders
            this.filters = lessonsUserFilters
          }
          else {
            this.headers = lessonsAdminHeaders
            this.filters = lessonsAdminFilters
          }
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
                        this.displayFilter = this.displayFilter.replace(item, filter.title + ": " + filterItem[1])
                    }
                })
            })
            this.displayFilter = this.displayFilter.slice(1).replaceAll('&', ', ')
            this.fetchData(this.filter)
        },
        entity() {
            if (this.entity !== '') {
                const sendEntity = {}
                const rowEntity = {}
                this.entity.slice(1).split('&').forEach((field) => {
                    const fieldItems = field.split('=')
                    if (fieldItems[0] != 'date' && fieldItems[0] != 'time' && fieldItems[0] != 'status' && fieldItems[0] != 'id')
                        sendEntity[fieldItems[0]] = {'id': fieldItems[1]}
                    else if (fieldItems[0] != 'id')
                        sendEntity[fieldItems[0]] = fieldItems[1]
                    rowEntity[fieldItems[0]] = fieldItems[1]
                })
                const id = rowEntity['id']

                if (id) {
                    if (JSON.stringify(this.selectedEntity) !== JSON.stringify(rowEntity)) {
                        Object.keys(sendEntity).forEach((key) => {
                            if(sendEntity[key]['id']) {
                                if (sendEntity[key]['id'] === this.selectedEntity[key]) {
                                    delete sendEntity[key]
                                }
                            }
                        })
                        EntityAPI.put(id, sendEntity).then(() => {
                            this.fetchData()
                            M.toast({html: "Урок изменен!", classes: 'green-text white'})
                            }).catch((e) => {
                                M.toast({html: 'Ошибка! ' + e.response.data.message, classes: 'red-text white'})
                                })
                    }
                }
                else {
                    if(!sendEntity['teacher'])
                        sendEntity['teacher'] = {'id': localStorage.getItem('userId')}
                        
                    EntityAPI.post(sendEntity).then(() => {
                    this.fetchData()
                    M.toast({html: "Урок создан!", classes: 'green-text white'})
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
