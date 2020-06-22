import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";

import {BootstrapVue, BootstrapVueIcons} from "bootstrap-vue";
Vue.use(BootstrapVue);
Vue.use(BootstrapVueIcons);

import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-vue/dist/bootstrap-vue.css";
import 'bootstrap-vue/dist/bootstrap-vue-icons.min.css'

import axios from "axios";
import VueAxios from "vue-axios";

Vue.use(VueAxios, axios);
axios.defaults.baseURL = "http://localhost:8000/api/"


Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");
