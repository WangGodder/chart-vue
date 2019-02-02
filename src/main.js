import Vue from 'vue'
import App from './App.vue'
import VueI18n from 'vue-i18n'
import i18n from './i18n'
import 'jquery'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.min'
import 'bootstrap-select/dist/css/bootstrap-select.min.css';
import 'bootstrap-select/dist/js/bootstrap-select.min'
import vcolorpicker from 'vcolorpicker'

Vue.config.productionTip = false;
Vue.use(VueI18n);
Vue.use(vcolorpicker);
// alert(i18n.locale);
// i18n.locale = "zh";
new Vue({
  i18n,
  render: h => h(App)
}).$mount('#app')
