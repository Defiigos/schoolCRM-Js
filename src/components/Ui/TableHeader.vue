<template>
    <thead>
        <tr>
            <th v-for="header in headers" :key="header.id"> {{header.title}} </th>
            <!-- <template v-for="header in headers" :key="header.id">
                <th v-if="header.display">{{header.title}}</th>
            </template> -->
        </tr>
    </thead>
</template>

<script>
export default {
    name: "table-header",
    props: {
        headers: {
            type: Array,
            required: true
        }
    }
}
</script>