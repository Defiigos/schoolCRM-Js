<template>
    <a 
        class="btn-large waves-effect waves-light amber darken-3"
    >
        <slot></slot>
        <i v-if="icon" class="material-icons right">{{ icon }}</i>
    </a>
</template>

<script>
export default {
    name: "flat-orange-btn",
    props: {
        icon: {
            type: String,
            default: ''
        }
    }
}
</script>