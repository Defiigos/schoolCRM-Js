<template>
    <div id="modalConfirm" ref="modalConfirm" class="modal">
        <div class="container">
            <div class="center-align">
                <slot></slot>
            </div>
            <div class="center-align section">
                <action-confirm @click="this.$emit('accept')" class="modal-close"/>
                <action-delete class="modal-close"/>
            </div>
        </div>
    </div>
</template>

<script>
import actionConfirm from './Ui/actions/actionConfirm.vue'
import ActionDelete from './Ui/actions/actionDelete.vue'

export default {
  components: { actionConfirm, ActionDelete },
    name: "modal-confirm",
    props: {
        instance: {
            type: Object,
            required: true
        }
    },
    methods: {
    },
    mounted() {
        const instance = M.Modal.init(this.$refs.modalConfirm, {})
        this.$emit('update:instance', instance)
    }
}
</script>
<style>
</style>