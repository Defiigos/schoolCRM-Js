<template>
    <a 
        class="btn-large btn-floating waves-effect waves-light amber darken-3"
    >
        <i v-if="icon" class="material-icons">{{ icon }}</i>
    </a>
</template>

<script>
export default {
    name: "orange-btn",
    props: {
        icon: {
            type: String,
            default: ''
        }
    }
}
</script>