<template>
    <div class="container">
        <div class="section">
            <entity-header 
                title="Заявки"
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
                    confirm
                    cancel
                    block
                    @markConfirm="markAcepted"
                    @markCanceled="markCanceled"
                    @markBlocked="markBlocked"
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
        
        <modal-confirm
            @accept="actionRedirected" 
            v-model:instance="confirmRedirect"
        >
            <h5>Создать нового Ученика?</h5>
        </modal-confirm>
        <modal-confirm 
            @accept="actionAccepted" 
            v-model:instance="confirmAction"
        >
            <h5>{{confirmTitle}}</h5>
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
import {requestStatuses} from '@/assets/statuses'
import {requestHeaders} from '@/assets/headers'
import {requestFilters} from '@/assets/filters'

export default {
    components: { EntityHeader, EntityTable, EntityModal, ModalConfirm, PreLoader },
    name: "RequestView",
    data: () => ({
        isLoad: false,

        filter: '',
        displayFilter: '',
        
        selectedEntity: {},
        confirmRedirect: {},
        confirmAction: {},
        confirmTitle: '',
        confirmStatus: '',
        
        statuses: requestStatuses,
        headers: requestHeaders,
        filters: requestFilters,
        data: []
    }),
    methods: {
        async fetchData(queryFilter) {
            this.isLoad = true
            setTimeout(async() => {
                if(!queryFilter) {
                    queryFilter = ''
                }

                EntityAPI.get(queryFilter).then((res) => {
                    res.data.forEach((item) => {
                    if (item['location']) {
                        item['locationName'] = item['location'].name
                        delete['location']
                    }
                    this.data = res.data
                    })
                }).catch((e) => {
                    M.toast({html: 'Ошибка загрузки данных! ' + e, classes: 'red-text white'})
                }).finally(() => {
                    this.isLoad = false
                })
            }, 100)
        },
        async modifyEntity(toast, id, newStatus) {
            EntityAPI.put(id, newStatus).then(() => {
                this.updateData(id, [{field: 'status', value: newStatus.status}])
                M.toast({html: toast, classes: 'green-text white'})
            }).catch((e) => {
                M.toast({html: 'Ошибка загрузки данных! ' + e, classes: 'red-text white'})
            })
        },

        updateData(id, modData) {
            this.data.forEach((item) => {
                if (item['id'] == id) {
                    modData.forEach((field) => {
                        item[field.field] = field.value
                    })
                }
            })
        },

        markAcepted(entity) {
            this.selectedEntity = entity
            this.confirmTitle = 'Заявка принята?'
            this.confirmStatus = 'REQUEST_FINISHED'
            this.confirmAction.open()
        },
        markCanceled(entity) {
            this.selectedEntity = entity
            this.confirmTitle = 'Заявка отменена?'
            this.confirmStatus = 'REQUEST_CANCELED'
            this.confirmAction.open()
        },
        markBlocked(entity) {
            this.selectedEntity = entity
            this.confirmTitle = 'Заблокировать заявку?'
            this.confirmStatus = 'REQUEST_BLOCKED'
            this.confirmAction.open()
        },

        actionRedirected(){
            this.$router.push("create/user")
        },
        actionAccepted() {
            if (this.confirmStatus === 'REQUEST_FINISHED'){
                this.confirmRedirect.open()
                this.modifyEntity('Заявка обработана!', this.selectedEntity.id, {status: 'REQUEST_FINISHED'})
                return
            }
            if (this.confirmStatus === 'REQUEST_CANCELED'){
                this.modifyEntity('Заявка отменена!',this.selectedEntity.id, {status: 'REQUEST_CANCELED'})
                return
            }
            if (this.confirmStatus === 'REQUEST_BLOCKED'){
                this.modifyEntity('Заявка заблокированна!', this.selectedEntity.id, {status: 'REQUEST_BLOCKED'})
            }
        }
    },
    mounted() {
        EntityAPI.entity = 'requestStudents'
        this.filter = '?status=REQUEST_NEW'
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

                requestHeaders.forEach((header) => {
                    if (header.type === filterItem[0]) {
                         if (header.type == 'status'){
                            this.statuses.forEach((status) => {
                                if (status.type == filterItem[1]){
                                    this.displayFilter = this.displayFilter.replace(item, header.title + ": " + status.title)
                                }
                            })
                        }
                        this.displayFilter = this.displayFilter.replace(item, header.title + ": " + filterItem[1])
                    }
                })
            })
            this.displayFilter = this.displayFilter.slice(1).replaceAll('&', ', ')
            this.fetchData(this.filter)
        }
    }
}
</script>
