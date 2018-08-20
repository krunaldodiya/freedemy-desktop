import Vue from "vue";

import Vuex from "vuex";
Vue.use(Vuex);

// reducers
import homeStore from "./home";

export default new Vuex.Store({
  strict: process.env.NODE_ENV !== "production",
  modules: {
    homeStore
  }
});
