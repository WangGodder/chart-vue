<template>
    <div v-bind:id="'options_'+ name">
        <button></button>
    </div>
</template>

<script>
    export default {
        name: "ChartOptionComponent",
        props: {
            name: {
                type: String,
                default: ""
            },
            config: {
                type: String,
                default: "",
                required: false
            }
        },
        created: function () {
        }
    }
</script>

<style scoped>

</style>