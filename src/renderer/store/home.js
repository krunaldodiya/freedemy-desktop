const state = {
  home: {
    data: null
  }
};

const mutations = {
  setPreloadData(state, payload) {
    state.home.data = payload;
  }
};

const actions = {
  set_preload_data({ commit }, payload) {
    commit("setPreloadData", payload);
  }
};

const getters = {
  //
};

export default {
  state,
  mutations,
  actions,
  getters
};
