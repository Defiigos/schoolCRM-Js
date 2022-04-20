<template>
    <table class="centered striped">
        <table-header
            :headers="headers"
        />
        <tbody>
            <tr v-for="row in data" :key="row.id" >
                <table-row 
                    :row="row" 
                    :headers="headers"
                    
                    :statuses="statuses"
                    :roles="roles"
                    :actives="actives"

                    :confirm="confirm"
                    :cancel="cancel"
                    :block="block"
                    :editRow="editRow"
                    :deleteRow="deleteRow"

                    @markConfirm="$emit('markConfirm', row)"
                    @markCanceled="$emit('markCanceled', row)"
                    @markBlocked="$emit('markBlocked', row)"
                    @editRow="$emit('editRow', row)"
                    @deleteRow="$emit('deleteRow', row)"
                />
            </tr>
        </tbody>
    </table>
</template>

<script>
import TableHeader from "./Ui/TableHeader.vue"
import TableRow from './Ui/TableRow.vue'

export default {
    components: { TableHeader, TableRow },
    name: "EntityTable",
    emits: [
        'markConfirm', 'markCanceled', 'markBlocked', 'editRow', 'deleteRow'
    ],
    props: {
        headers: {
            type: Array,
            required: true
        },
        data: {
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
    }
}
</script>