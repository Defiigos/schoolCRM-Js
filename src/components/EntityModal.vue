<template>
    <div :id="refs" :ref="refs" class="modal modal-fixed-footer">
        <div class="modal-content">
            <modal-content
                :title="title"
                :refs="refs"
                :inputs="inputs" 
                :isOpen="isOpen" 
                :statuses="statuses"
                :roles="roles"
                :students="students"
                :actives="actives"
                :amounts="amounts"
                :lessonDurations="lessonDurations"
                :locations="locations"
                :lessonGroups="lessonGroups"
                :paymentAmounts="paymentAmounts"
                :teachers="teachers"
                v-model="inputsValue"
            />
        </div>
        <div class="modal-footer">
            <action-find @click="find" class="modal-close"> {{actionFindTitle}}</action-find>
            <action-delete @click="close" class="modal-close"/>
        </div>
    </div>
</template>

<script>
import ActionDelete from './Ui/actions/actionDelete.vue'
import actionFind from './Ui/actions/actionFind.vue'
import ModalContent from './Ui/ModalContent.vue'

export default {
  components: { actionFind, ModalContent, ActionDelete },
    name: "entity-modal",
    props: {
        refs: {
            type: String,
            required: true
        },
        title: {
            type: String,
            required: false
        },
        actionFindTitle: {
            type: String,
            default: 'Найти'
        },
        inputs: {
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
        students: {
            type: Array,
            required: false
        },
        amounts: {
            type: Array,
            required: false
        },
        lessonDurations: {
            type: Array,
            required: false
        },
        locations: {
            type: Array,
            required: false
        },
        lessonGroups: {
            type: Array,
            required: false
        },
        paymentAmounts: {
            type: Array,
            required: false
        },
        teachers: {
            type: Array,
            required: false
        },
        modelValue: [String]
    },
    methods: {
        find() {
            this.$emit('update:modelValue', this.inputsValue)
        },
        changeIsOpen() {
            this.isOpen = !this.isOpen
        },
        close() {
            this.inputsValue = this.modelValue
        }
    },
    data: () => ({
        inputsValue: '',
        isOpen: false
    }),
    watch: {
        modelValue() {
            this.inputsValue = this.modelValue
        }
    },
    mounted() {
        const self = this
        M.Modal.init(this.$refs[this.refs], {
            onOpenEnd() {
                self.changeIsOpen()
            },
            onCloseEnd() {
                self.changeIsOpen()
                self.close()
            }
        })
    }
}
</script>