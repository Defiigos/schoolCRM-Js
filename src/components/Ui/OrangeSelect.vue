<template>
    <div class="input-field">
        <select ref="orangeSelect" :value="modelValue" @change="updateSelect" >
            <option value="" disabled selected>{{optionLabel}}</option>
            <option
                v-for="option in options"
                :key="option.id"
                :value="option.type"
            >
                {{option.title}}
            </option>
        </select>
        <label>{{label}}</label>
    </div>
</template>

<script>
export default {
    name: "orange-select",
    props: {
        label: {
            type: String,
            required: true
        },
        options: {
            type: Array,
            required: true
        },
        optionLabel: {
            type: String,
            default: ''
        },
        modelValue: {
            type: String
        }
    },
    data:() => ({
        instance: {}
    }),
    methods: {
        updateSelect(event) {
            this.$emit('update:modelValue', event.target.value)
        }
    },
    mounted() {
        this.instance = M.FormSelect.init(this.$refs.orangeSelect, {})
    }
}
</script>
<style>
</style>