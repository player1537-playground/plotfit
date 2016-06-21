import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

const state = {
  xScale: {
    expr: 'Q',
    scope: [],
    isLog: false,
  },
};

const mutations = {
  XSCALE_SET_EXPR({ xScale }, _) {
    xScale.expr = _;
  },
  XSCALE_SET_IS_LOG({ xScale }, _) {
    xScale.isLog = _;
  },
  XSCALE_SET_SCOPE({ xScale }, _) {
    xScale.scope = _;
  },
};

export default new Vuex.Store({
  state,
  mutations,
});
