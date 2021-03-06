<template>
    <div class="container">
        <div class="section">
            <div class="row">
                <div class="col l6">
                    <h2>{{displayDate}}</h2>
                    <h4>
                        Расписание на сегодня
                        <orange-button
                            class="hide-on-small-only" 
                            icon="add"
                            @click="createBtnClick"
                        />
                    </h4>
                    <div class="center">
                        <orange-button 
                            class="hide-on-med-and-up" 
                            icon="add"
                            @click="createBtnClick"
                        />
                    </div>
                </div>
                <!-- <div class="col l6">
                    <h2 class="center">&lt;Календарь&gt;</h2>
                </div> -->
            </div>
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
                <h4>Уроков на сегодня нет</h4>
            </div>
        </div>
        <div v-else class="section">
            <pre-loader class="center-align"></pre-loader>
        </div>

        <entity-modal
            refs="create"
            title="Изменение Урока"
            actionFindTitle="Изменить"
            :inputs="entityModalFields" 
            :statuses="statuses"
            :lessonDurations="lessonDurations"
            :locations="locations"
            :lessonGroups="lessonGroups"
            :paymentAmounts="paymentAmounts"
            v-model="entity"
        />
        <modal-confirm
            @accept="actionRedirected" 
            v-model:instance="modalRedirectInstance"
        >
            <h5>Создать новый Урок?</h5>
        </modal-confirm>
        <modal-confirm 
            @accept="actionAccepted" 
            v-model:instance="confirmModalInstance"
        >
            <h5>Удалить Урок?</h5>
        </modal-confirm>
  </div>
</template>

<script>
import OrangeButton from '@/components/Ui/OrangeButton.vue'
import EntityTable from '@/components/EntityTable.vue'
import EntityModal from '@/components/EntityModal.vue'
import ModalConfirm from '@/components/ModalConfirm.vue'
import PreLoader from '@/components/PreLoader.vue'

import {EntityAPI} from "@/api/Entity"
import {lessonsStatuses} from '@/assets/statuses'
import {lessonsHomeHeaders} from '@/assets/headers'
import {lessonsHomeUpdateFields} from '@/assets/entityFields'

export default {
  components: { OrangeButton, EntityTable, EntityModal, ModalConfirm, PreLoader },
    name: "HomeView",
    data: () => ({
        isLoad: false,
        selectedEntity: {},
        modalRedirectInstance: {},
        confirmModalInstance: {},

        entityModalFields: lessonsHomeUpdateFields,
        entity: '',
        lessonDurations: [],
        locations: [],
        lessonGroups: [],
        paymentAmounts: [],

        displayDate: '',
        curentDate: '',
        
        statuses: lessonsStatuses,
        headers: lessonsHomeHeaders,
        data: []
    }),
    methods: {
        async fetchData(queryFilter) {
            this.isLoad = true
            if(!queryFilter) {
                queryFilter = ''
            }
            if (localStorage.hasOwnProperty('userRoles'))
                queryFilter = `?teacherId=${localStorage.getItem('userId')} ${queryFilter}&date=${this.curentDate}`
            
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

        createBtnClick() {
             this.modalRedirectInstance.open()
        },
        actionEdit(entity) {
            this.selectedEntity = entity
            this.entity = this.entityToString(entity)
        },
        actionDelete(entity) {
            this.selectedEntity = entity
            this.confirmModalInstance.open()
        },

        
        actionRedirected() {
            this.$router.push("create/lessons")
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
        const today = new Date()
        var options = { year: 'numeric', month: 'short', day: '2-digit' }
        this.displayDate = today.toLocaleDateString('ru-RU', options)
        this.curentDate = `${today.getFullYear()}-${Intl.DateTimeFormat('en', {month: '2-digit'}).format(today)}-${today.getDate()}`

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

        EntityAPI.entity = 'lessons'
        this.fetchData()
    },
    watch: {
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
            }
        }
    }
}
</script>

