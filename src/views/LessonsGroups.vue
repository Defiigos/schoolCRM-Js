<template>
    <div class="container">
        <div class="section">
            <entity-header 
                title="Группы учеников"
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
            :students="students"
            v-model="entity"
        />
        <modal-confirm 
            @accept="actionAccepted" 
            v-model:instance="confirmModalInstance"
        >
            <h5>Удалить группу?</h5>
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
import {lessonsGroupsStatuses} from '@/assets/statuses'
import {lessonsGroupsHeaders} from '@/assets/headers'
import {lessonsGroupsFilters} from '@/assets/filters'
import {lessonsGroupsCreateFields} from '@/assets/entityFields'
import {lessonsGroupsUpdateFields} from '@/assets/entityFields'

export default {
    components: { EntityHeader, EntityTable, EntityModal, ModalConfirm, PreLoader },
    name: "LessonsGroupsView",
    data: () => ({
        isLoad: false,

        filter: '',
        displayFilter: '',

        entityModalTitle: '',
        entityModalAction: '',
        entityModalFields: [],
        entity: '',
        students: [],
        
        selectedEntity: {},
        confirmModalInstance: {},

        statuses: lessonsGroupsStatuses,
        headers: lessonsGroupsHeaders,
        filters: lessonsGroupsFilters,
        data: []
    }),
    methods: {
        async fetchData(queryFilter) {
            this.isLoad = true
            if(!queryFilter) {
                queryFilter = ''
            }

            // ДОБАВИТЬ ФИЛЬТР ПО ID ЕСЛИ ПОЛЬЗОВАТЕЛЬ УЧИТЕЛЬ (СДЕЛАТЬ ДВА ХЕДЕРА, ДЛЯ УЧИТЕЛЬЯ И АДМИНА)
            EntityAPI.get(queryFilter).then((res) => {
                res.data.forEach((row, index) => {
                    res.data[index]['id'] = row['id'].toString()
                    if (row['students'].length > 0) {
                        let students = ''
                        row['students'].forEach((student, index) => {
                            if (index === 0)
                                students = student['name']
                            else
                                students = students + ", " + student['name']
                        })
                        res.data[index]['students'] = students
                    }
                    else
                        res.data[index]['students'] = ''
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
            this.entityModalTitle = 'Создание Группы учеников' 
            this.entityModalAction = 'Создать'
            this.entityModalFields = lessonsGroupsCreateFields
        },
        actionEdit(entity) {
            this.selectedEntity = entity
            this.entity = this.entityToString(entity)
            this.entityModalTitle = 'Изменение Группы' 
            this.entityModalAction = 'Изменить'
            this.entityModalFields = lessonsGroupsUpdateFields
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
                M.toast({html: "Группа удалена", classes: 'green-text white'})
                }).catch((e) => {
                    M.toast({html: 'Ошибка! ' + e.response.data.message, classes: 'red-text white'})
                    })
        }
    },
    mounted() {
        EntityAPI.entity = 'students'
        EntityAPI.get("?status=STUDENT_ACTIVE").then((res) => {
            const students = []
            res.data.forEach((row) => {
                const student = {
                    title: row['name'],
                    type: row['id'].toString()
                }
                students.push(student)
            })
            this.students = students
            }).catch((e) => {
                M.toast({html: 'Ошибка загрузки данных! ' + e, classes: 'red-text white'})
                })

        EntityAPI.entity = 'lessons/groups'
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
                    if (Object.keys(this.selectedEntity).length === 0 && fieldItems[0] == 'students') {
                        const studentsId = []
                        fieldItems[1].split(', ').forEach((id) => {
                            studentsId.push({
                                id: id
                            })
                        })
                        entity[fieldItems[0]] = studentsId
                    } else 
                        entity[fieldItems[0]] = fieldItems[1]
                })
                const id = entity['id']

                if (id) {
                    if (JSON.stringify(this.selectedEntity) !== JSON.stringify(entity)) {
                        delete entity['id']
                        EntityAPI.put(id, entity).then(() => {
                            this.updateData(id, entity)
                            M.toast({html: "Группа изменен!", classes: 'green-text white'})
                            }).catch((e) => {
                                M.toast({html: 'Ошибка! ' + e.response.data.message, classes: 'red-text white'})
                                })
                    }
                }
                else {
                    EntityAPI.post(entity).then(() => {
                    this.fetchData()
                    M.toast({html: "Группа создана!", classes: 'green-text white'})
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
