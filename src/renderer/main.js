import "bulma/css/bulma.css";

import Vue from "vue";
import axios from "axios";

// font-awesome
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
Vue.component("font-awesome-icon", FontAwesomeIcon);

// library
import { library } from "@fortawesome/fontawesome-svg-core";
import { faCog } from "@fortawesome/free-solid-svg-icons";
library.add(faCog);

import App from "./App";

import router from "./router";
import store from "./store";

import { sync } from "vuex-router-sync";
sync(store, router);

// vue electron
if (!process.env.IS_WEB) Vue.use(require("vue-electron"));
Vue.http = Vue.prototype.$http = axios;
Vue.config.productionTip = false;

/* eslint-disable no-new */
new Vue({
  components: { App },
  router,
  store,
  template: "<App/>"
}).$mount("#app");
