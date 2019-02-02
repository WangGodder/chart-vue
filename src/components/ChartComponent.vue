

<template>
    <div v-bind:id="name" v-show="this.show" class="well well-lg ChartComponent center-block">
        <!--<h2>{{$t('message.person.name')}}</h2>-->
        <canvas v-bind:id="'canvas_' + name" ref="chartCanvas"></canvas>
        <div v-bind:id="'options_'+this.name">
            <div class="btn-group">
                <button v-on:click="random_data()" class="btn-default btn-sm">random data</button>
                <button v-on:click="show_value()" class="btn-default btn-sm">{{ $t('chart.' + value_show)}}</button>
                <button v-on:click="enlarge()" class="btn-default btn-sm">{{$t('chart.enlarge')}}</button>
                <button v-on:click="shrink()" class="btn-default btn-sm">{{$t('chart.shrink')}}</button>
            </div>
            <div>
                <label>{{$t('chart.change_legend_position')}}:</label>
                <select ref="legendSelect" v-on:change="change_legend_position()" v-model="current_legend_position">
                    <option v-for="(value, index) in legend_positions" v-bind:value="value" v-bind:key="index">{{ $t('chart.legend_position[' + (index) + ']' )}}</option>
                </select>
            </div>
            <!--<div class="btn-group">-->
                <!--<button class="btn btn-default dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">{{$t('chart.change_color')}}<span class="caret"></span></button>-->
                <!--<ul class="dropdown-menu">-->
                    <!--<li v-for="(label, index) of this.data.datasetLabels">-->

                            <!--{{label}}-->
                            <!--&lt;!&ndash;<colorPicker v-model="this.color[index]" />&ndash;&gt;-->

                    <!--</li>-->
                <!--</ul>-->
            <!--</div>-->
            <!--<span role="presentation" class="dropdown btn-sm">-->
                <!--<a class="dropdown-toggle btn-primary btn-sm" data-toggle="dropdown" href="#" role="button">-->
                    <!--{{$t('chart.legend_position[' + (index) + ']')}}<span class="caret"></span>-->
                <!--</a>-->
                <!--<ul ref="languageDropdown" class="dropdown-menu">-->
                    <!--<li v-for="(value, index) in legend_positions"><a v-on:click="choose_language(value)">{{$t('chart.legend_position[' + (index) + ']' )}}</a></li>-->
                <!--</ul>-->
            <!--</span>-->
        </div>
    </div>
</template>
<script>
    import Chart from 'chart.js';
    import $ from 'jquery'
    import {legendPositions, colors} from "../common/chartUtils";
    import {createRandomChart, randomData, showValue, changeLegendPosition, baseDataToChartConfig} from '../common/chartUtils';

    // const i18n = new VueI18n({
    //     locale: 'zh',
    //     messages: {
    //         zh: require('../common/i18n/chart/chart-zh'),
    //         en: require('../common/i18n/chart/chart-en')
    //     }
    // })

    export default {
        name: "ChartComponent",
        // components: [i18n],
        props: {
            name: {
                type: String,
                default: ""
            },
            data: {
                type: Object,
                default: null,
                required: false
            },
            type: {
                type: String,
                required: true
            },
            show: {
                type: Boolean,
                default: true,
                required: true
            }
        },
        data: function () {
            return{
                canvasChart: null,
                value_is_show: true,
                legend_positions: legendPositions,
                current_legend_position: 'top',
                // color: []
            }
        },
        // created: function() {
        //     // for ()
        // },
        mounted: function () {
            // for test to get fake chart config
            // let config = createRandomChart(this.type, this.name);
            let config = baseDataToChartConfig(this.data, this.type);
            // draw the chart
            let canvas = this.$refs.chartCanvas;
            this.canvasChart = new Chart(canvas, JSON.parse(config));
            // this.change_color = true;
            // console.log(this.canvasChart.data.datasets[0].label);
            // legend position select init
            // alert("mounted");
            // alert(this.config);
            // this.chart = new Chart($("#canvas_" + this.name), JSON.parse(this.config));
        },
        methods:{
            random_data: function () {
                randomData(this.canvasChart);
            },
            show_value: function () {
                showValue(this.canvasChart);
                this.value_is_show = !this.value_is_show;
            },
            change_legend_position: function () {
                changeLegendPosition(this.canvasChart, this.current_legend_position);
            },
            // change_legend_position: function (position) {
            //     changeLegendPosition(this.canvasChart, position);
            // },
             enlarge: function () {
                 $('#' + this.name).width($('#' + this.name).width() +  $('#' + this.name).width() / 0.4 * 0.05);
                 // $('#' + this.name).width(40 + 1 + '%')
                 this.canvasChart.resize();
             },
            shrink: function () {
                $('#' + this.name).width($('#' + this.name).width() -  $('#' + this.name).width() / 0.4 * 0.05);
                this.canvasChart.resize();
            }
        },
        computed: {
            value_show: function () {
                if (this.value_is_show) {
                    return 'hide_value';
                }
                return 'show_value';
            }
        }
    }
</script>

<style scoped>

     .ChartComponent {
         border: black 1px solid;
         width: 40%;
     }

</style>