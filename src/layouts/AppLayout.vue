<template>
    <navbar />
    <main>
        <router-view />
    </main>
</template>

<script>
import Navbar from '@/components/Navbar.vue'

export default {
    name: "app-layout",
    components: { Navbar }
}
</script>