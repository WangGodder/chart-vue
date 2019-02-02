<template>
  <div id="app">
    <!--<img alt="Vue logo" src="./assets/logo.png">-->
    <!--<HelloWorld msg="This is Test" msg1="test" name="teset2"></HelloWorld>-->
    <nav id="nav" class="navbar navbar-inverse navbar-fixed-top">
      <div class="container">
        <div class="navbar-header">
          <h3 class="navbar-text">{{title}}</h3>
        </div>
        <div id="navbar" class="collapse navbar-collapse">
          <ul class="nav navbar-nav">
            <li role="presentation" class="dropdown">
              <a class="dropdown-toggle" data-toggle="dropdown" href="#" role="button">
                {{$t('choose_chart_type')}}<span class="caret"></span>
              </a>
              <ul ref="chartTypeDropdown" class="dropdown-menu">
                <li v-for="(item, key) in this.chart_types"><a v-on:click="choose_chart_type($event, item)" v-bind:key="key">{{$t('chart_types[' + (key) + ']')}}</a></li>
              </ul>
            </li>
            <li><a v-on:click="choose_all_chart_type">{{$t('choose_all_chart_type')}}</a></li>
            <li><a v-on:click="clear_all_chart">{{$t('clear_all_chart')}}</a></li>
            <li><a v-on:click="enlarge_all_chart">{{$t('enlarge_all_chart')}}</a></li>
            <li><a v-on:click="shrink_all_chart">{{$t('shrink_all_chart')}}</a></li>
          </ul>
          <ul class="nav navbar-nav navbar-right">
            <li role="presentation" class="dropdown ">
              <a class="dropdown-toggle" data-toggle="dropdown" href="#" role="button">
                {{$t('choose_language')}}<span class="caret"></span>
              </a>
              <ul ref="languageDropdown" class="dropdown-menu">
                <li v-for="(item, key) in this.languages"><a v-on:click="choose_language(key)">{{item}}</a></li>
              </ul>
            </li>
          </ul>

        </div>

      </div>
    </nav>
    <div id="chartContainer" class="container-fluid">
      <chart-component v-if="this.chart_type.line" ref="lineChart" name="lineChart" v-bind:show="true" type="line" v-bind:data="base_data"></chart-component>
      <chart-component v-if="this.chart_type.bar" ref="barChart" name="barChart" v-bind:show="true" type="bar" v-bind:data="base_data"></chart-component>
      <chart-component v-if="this.chart_type.radar" ref="radarChart" name="radarChart" v-bind:show="true" type="radar" v-bind:data="base_data"></chart-component>
      <chart-component v-if="this.chart_type.pie" ref="pieChart" name="pieChart" v-bind:show="true" type="pie" v-bind:data="base_data"></chart-component>
      <chart-component v-if="this.chart_type.doughnut" ref="doughnutChart" name="doughnutChart" v-bind:show="true" type="doughnut" v-bind:data="base_data"></chart-component>
    </div>
    <!--<HelloWorld msg="Welcome to Your Vue.js App" msg1="" name="123"/>-->
  </div>
</template>

<script>
// import HelloWorld from './components/HelloWorld.vue'
import ChartComponent from './components/ChartComponent.vue'
import HelloI18n from "./components/HelloI18n";
import vi18n from './i18n';
import $ from 'jquery'
import {chartTypes} from "./common/chartUtils";
import {getBaseData, getRandomBaseData} from "./common/chartUtils";

const locales = require.context('./locales', true, /[A-Za-z0-9-_,\s]+\.json$/i);
const languages = {};
locales.keys().forEach(key => {
  const matched = key.match(/([A-Za-z0-9-_]+)\./i)
  if (matched && matched.length > 1) {
    const locale = matched[1]
    languages[locale] = locales(key).language;
  }
});

// console.log(languages);

export default {
  name: 'app',
  components: {
    HelloI18n,
    // HelloWorld,
    ChartComponent
  },
  data: function() {
    return {
      title: 'title',
      languages: languages,
      language: '',
      chart_types: chartTypes,
      chart_type: {
        line: false,
        bar: false,
        radar: false,
        pie: false,
        doughnut: false
      },
      chart_ref: {
        line: 'lineChart',
        bar: 'barChart',
        radar: 'radarChart',
        pie: 'pieChart',
        doughnut: 'doughnutChart'
      },
      base_data: null
    }
  },
  created: function () {
    // this.$i18n.locale = 'zh';
    this.language = vi18n.locale;
    // this.base_data = getBaseData('http://localhost:9666/random_data');
    this.base_data = getRandomBaseData(3, 10);
  },
  mounted() {

  },
  methods: {
    choose_language: function (language) {
      this.language = language;
      vi18n.locale = this.language;
    },
    choose_chart_type: function (event, type) {
      this.chart_type[type] = !this.chart_type[type];
      let li = $(event.srcElement.parentElement);
      if (this.chart_type[type])
        li.addClass('active');
      else
        li.removeClass('active');

      // event.style('active');
    },
    choose_all_chart_type: function () {
      for (let type in this.chart_type) {
        this.chart_type[type] = true;
      }
      // console.log(this.$refs.chartTypeDropdown.children.length[0])
      for (let i = 0; i < this.$refs.chartTypeDropdown.children.length; i++) {
        this.$refs.chartTypeDropdown.children[i].classList.add('active');
      }
    },
    clear_all_chart: function () {
      for (let type in this.chart_type) {
        this.chart_type[type] = false;
      }
      // console.log(this.$refs.chartTypeDropdown.children.length[0])
      for (let i = 0; i < this.$refs.chartTypeDropdown.children.length; i++) {
        this.$refs.chartTypeDropdown.children[i].classList.remove('active');
      }
    },
    enlarge_all_chart: function () {
      for (let type in this.chart_type) {
        if (this.chart_type[type]) {
          this.$refs[this.chart_ref[type]].enlarge();
        }
      }
    },
    shrink_all_chart: function () {
      for (let type in this.chart_type) {
        if (this.chart_type[type]) {
          this.$refs[this.chart_ref[type]].shrink();
        }
      }
    }
  }
}

</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
