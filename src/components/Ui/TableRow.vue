<template>
    <td 
        v-for="header in headers"
        :key="header.id"
        
    >
    <!-- style="max-width: 100px" -->
        <template v-if="header.type === 'status'">
            <template
                v-for="status in statuses" 
                :key="status.id"
            >
                <template v-if="status.type === row['status']">
                    <div :class="status.style" class="truncate">
                        {{status.title}}
                    </div>
                </template>
            </template>
        </template>
        <template v-else-if="header.type === 'roles'">
            <template
                v-for="role in roles" 
                :key="role.id"
            >
                <template v-if="role.type === row['roles']">
                    <div :class="role.style" class="truncate">
                        {{role.title}}
                    </div>
                </template>
            </template>
        </template>
        <template v-else-if="header.type === 'active'">
            <template
                v-for="active in actives" 
                :key="active.id"
            >
                <template v-if="active.type === row['active'].toString()">
                    <div :class="active.style" class="truncate">
                        {{active.title}}
                    </div>
                </template>
            </template>
        </template>
        <template v-else>
            <h6 v-if="(header.type === 'time' || header.type === 'payTime')">{{pareseTime(row[header.type])}}</h6>
            <h6 v-else>{{row[header.type]}}</h6>
        </template>

        <template v-if="header.type === 'actions'">
            <template v-if="confirm"><action-confirm @click="$emit('markConfirm', row)"/></template>
            <template v-if="cancel"><action-cancel @click="$emit('markCanceled', row)"/></template>
            <template v-if="block"><action-block @click="$emit('markBlocked', row)"/></template>
            <template v-if="editRow"><action-edit class="modal-trigger" data-target="create" @click="$emit('editRow', row)"/></template>
            <template v-if="deleteRow"><action-delete @click="$emit('deleteRow', row)"/></template>
        </template>
    </td>
</template>

<script>
import ActionBlock from './actions/actionBlock.vue'
import ActionCancel from './actions/actionCancel.vue'
import actionConfirm from './actions/actionConfirm.vue'
import ActionDelete from './actions/actionDelete.vue'
import ActionEdit from './actions/actionEdit.vue'

export default {
  components: { actionConfirm, ActionCancel, ActionBlock, ActionEdit, ActionDelete },
    name: "table-row",
    emits: [
        'markConfirm', 'markCanceled', 'markBlocked', 'editRow', 'deleteRow'
    ],
    props: {
        row: {
            type: Object,
            required: true
        },
        headers: {
            type: Array,
            required: true
        },   
        statuses: {
            type: Array,
            required: false
        },   
        roles: {
            type: Array,
            required: false
        },   
        actives: {
            type: Array,
            required: false
        },
        confirm: {
            type:Boolean,
            default:false
        },
        cancel: {
            type:Boolean,
            default:false
        },
        block: {
            type:Boolean,
            default:false
        },
        editRow: {
            type:Boolean,
            default:false
        },
        deleteRow: {
            type:Boolean,
            default:false
        }
    },
    methods: {
        pareseTime(time) {
            const parseTime = time.split(":")
            parseTime.pop(2)
            return parseTime.join(":")
        }
    }
}
</script>