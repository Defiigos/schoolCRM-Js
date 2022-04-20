<template>
    <div>
        <div class="center-align">
            <h3>{{title}}</h3>
        </div>
        <div class="row">
            <div v-if="!showAddButton" class="col l1 offset-l11 m2 offset-m5 s2 offset-s5">
                <div class="center">
                    <orange-button
                        class="modal-trigger"
                        icon="search"
                        data-target="filter"
                    />
                </div>
            </div>
            <div v-else>
                <div class="col l1 offset-l10 m1 offset-m5 s1 offset-s5">
                    <div class="right">
                        <orange-button
                            class="modal-trigger"
                            icon="search"
                            data-target="filter"
                        />
                    </div>
                </div>
                <div class="col l1 m1 s1">
                    <div class="left">
                        <orange-button
                            class="modal-trigger"
                            icon="add"
                            data-target="create"
                            @click="this.$emit('addClick')"
                    />
                    </div>
                </div>
            </div>
        </div>
        <div class="row">
            <div class="col l12 m12 s12 center">
                <div v-if="filter" class="chip">
                    {{filter}}
                    <i @click="this.$emit('update:filter', '')" class="close material-icons">close</i>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import OrangeButton from "./Ui/OrangeButton.vue"

export default {
    components: { OrangeButton },
    name: "EntityHeader",
    props: {
        title: {
            type:String,
            required: true
        },
        showAddButton: {
            type:Boolean,
            default: false
        },
        filter: {
            type: String,
            default: ""
        }
    }
}
</script>
<style>
</style>