<template>
    <div class="input-field">
        <i v-if="icon" class="material-icons prefix">{{icon}}</i>
        <input
            :id="this.id"
            :value="modelValue"
            @input="updateInput"
            :type="type"
            :class="{invalid: (validate && !valid), valid: (validate && valid)}"
        >
        <label :for="this.id" :class="{'active': modelValue}">{{this.title}}</label>
        <template v-if="validate">
            <span v-if="valid" class="helper-text green-text">{{validText}}</span>
            <span v-else class="helper-text red-text">{{invalidText}}</span>
        </template>
    </div>
</template>

<script>
export default {
    name: "orange-input",
    props: {
        id: {
            type: [String, Number],
            require: false
        },
        type: {
            type: String,
            default: "text"
        },
        title: {
            type: [String, Number],
            require: false,
            default: "Ввод"
        },
        validate: {
            type: Boolean,
            default: false
        },
        valid: {
            type: Boolean,
            default: false
        },
        validText: {
            type: String,
            default: ""
        },
        invalidText: {
            type: String,
            default: ""
        },
        icon: {
            type: String,
            default: ''
        },
        modelValue: [String, Number]
    },
    methods: {
        updateInput(event) {
            this.$emit('update:modelValue', event.target.value.trim())
        }
    }
}
</script>
<style>
</style>