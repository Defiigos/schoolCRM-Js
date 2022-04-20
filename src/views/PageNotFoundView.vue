<template>
    <div class="container">
        <div class="section center-align">
            <h1 class="  amber-text text-darken-3">404</h1>
        </div>
        <div class="divider"></div>
        <div class="section center-align">
            <h4>Такой страницы нет...</h4>
            <h6><router-link to="/">На главную</router-link></h6>
        </div>
    </div>
</template>

<script>
export default {
    name: "PageNotFound"
}
</script>