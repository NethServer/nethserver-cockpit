import Vue from "vue";
import VueResource from "vue-resource";
import VueI18n from "vue-i18n";
import VueGoodTable from "vue-good-table";
import VueClipboard from 'vue-clipboard2';
import VueToggleButton from 'vue-js-toggle-button';
import BootstrapVue from 'bootstrap-vue';

import DocInfo from "./directives/DocInfo.vue";


import App from "./App.vue";
import router from "./router/index";
import languages from "./i18n/lang";
import "./filters/filters";


window.c3 = require('c3');
window.d3 = require('d3');

Vue.config.productionTip = false;
Vue.use(VueResource);
Vue.use(VueI18n);
Vue.use(VueGoodTable);
Vue.use(VueClipboard)
Vue.use(VueToggleButton)
Vue.use(BootstrapVue);
Vue.component('doc-info', DocInfo)
Vue.directive('focus', {
  inserted: function (el) {
    el.focus()
  }
})

import NethServer from "./services/nethserver"
import UtilService from "./services/util"
Vue.mixin(NethServer)
Vue.mixin(UtilService)

// configure i18n
var langConf = languages.initLang();
const i18n = new VueI18n({
  locale: langConf.locale,
  messages: langConf.messages
});
var moment = require("moment");
moment.locale(langConf.locale);

// init Vue app
var ns = new Vue({
  el: "#app",
  router,
  i18n,
  render: h => h(App),
  currentLocale: langConf.locale
});
global.ns = ns;
