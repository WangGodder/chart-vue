<template>
    <canvas v-bind:id="'canvas_' + name"></canvas>
</template>

<script>
    export default {
        name: "ChartCanvasComponent",
        props: {
            name: {
                type: String,
                default: ""
            },
            config: {
                type: String,
                default: ""
            }
        },
        created: function () {
            this.chartName = "canvas_" + this.chartName;
        }
    }
</script>

<style scoped>

</style>