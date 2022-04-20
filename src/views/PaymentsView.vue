<template>
    <div class="container">
        <div class="section">
            <entity-header 
                title="Платежи"
                v-model:filter="displayFilter"
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
                    @editRow="actionEdit"
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
            :statuses="statuses"
            :inputs="filters"
            v-model="filter"
        />
        <entity-modal
            refs="create"
            :title="entityModalTitle"
            :actionFindTitle="actionFindTitle"
            :inputs="entityFields"
            :statuses="statuses"
            :amounts="amounts"
            v-model="entity"
        />
    </div>
</template>

<script>
import EntityHeader from '@/components/EntityHeader.vue'
import EntityTable from '@/components/EntityTable.vue'
import EntityModal from '@/components/EntityModal.vue'
import PreLoader from '@/components/PreLoader.vue'

import {EntityAPI} from "@/api/Entity"
import {paymentsStatuses} from '@/assets/statuses'
import {paymentsUserHeaders} from '@/assets/headers'
import {paymentsAdminHeaders} from '@/assets/headers'
import {paymentsUserFilters} from '@/assets/filters'
import {paymentsAdminFilters} from '@/assets/filters'
import {paymentsUpdateFields} from '@/assets/entityFields'

export default {
    components: { EntityHeader, EntityTable, EntityModal, PreLoader },
    name: "PaymentsView",
    data: () => ({
        isLoad: false,

        filter: '',
        displayFilter: '',

        entityModalTitle: '',
        actionFindTitle: '',
        entityFields: [],
        entity: '',
        amounts: [],
        
        selectedEntity: {},
        confirmAction: {},

        statuses: paymentsStatuses,
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
                    res.data[index]['teacher'] = row['lessonDto']['teacher']['name']
                    res.data[index]['lessonDto'] = `От: ${row['lessonDto']['date']} ${row['lessonDto']['time']} В: ${row['lessonDto']['location']['name']}`
                    res.data[index]['studentDto'] = row['studentDto']['name']
                    res.data[index]['amountDto'] = row['amountDto']['name']
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

        actionEdit(entity) {
            this.selectedEntity = entity
            this.entity = this.entityToString(entity)
            this.entityModalTitle = 'Изменение Платежа' 
            this.actionFindTitle = 'Изменить'
            this.entityFields = paymentsUpdateFields
        }
    },
    mounted() {
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
            this.amounts = amounts
            }).catch((e) => {
                M.toast({html: 'Ошибка загрузки данных! ' + e, classes: 'red-text white'})
                })

        EntityAPI.entity = 'payments'
        this.fetchData()

        if (localStorage.hasOwnProperty('userRoles'))
          if (localStorage.getItem('userRoles') === 'ROLE_USER') {
            this.headers = paymentsUserHeaders
            this.filters = paymentsUserFilters
          }
          else {
            this.headers = paymentsAdminHeaders
            this.filters = paymentsAdminFilters
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
                const entity = {}
                this.entity.slice(1).split('&').forEach((field) => {
                    const fieldItems = field.split('=')
                    entity[fieldItems[0]] = fieldItems[1]
                })
                const id = entity['id']

                
                if (JSON.stringify(this.selectedEntity) !== JSON.stringify(entity)) {
                    const sendEntity = structuredClone(entity)
                    delete sendEntity['id']
                    delete sendEntity['lessonDto']
                    delete sendEntity['studentDto']
                    delete sendEntity['payDate']
                    delete sendEntity['payTime']
                    delete sendEntity['amountDto']
                    
                    EntityAPI.put(id, sendEntity).then(() => {
                        this.updateData(id, entity)
                        M.toast({html: "Платеж изменен!", classes: 'green-text white'})
                        }).catch((e) => {
                            M.toast({html: 'Ошибка! ' + e.response.data.message, classes: 'red-text white'})
                            })
                }
            }
        }
    }
}
</script>