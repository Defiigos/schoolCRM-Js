<template>
  <component :is="layout">
    <router-view />
  </component>
</template>

<script>
import AppLayout from './layouts/AppLayout.vue'
import AuthLayout from './layouts/AuthLayout.vue'

export default {
  components: {AuthLayout, AppLayout },
  computed: {
    layout() {
      return this.$route.meta.layout + "-layout"
    }
  }
}
</script>

<style>
  @import '~materialize-css/dist/css/materialize.min.css';
  @import 'assets/index.css';
</style>
