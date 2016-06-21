import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

const state = {
  xScale: {
    expr: 'Q',
    logOrLinear: 'linear',
  },
};

const mutations = {
  XSCALE_SET_EXPR({ xScale }, newExpr) {
    xScale.expr = newExpr;
  },
  XSCALE_SET_LOG_OR_LINEAR({ xScale }, newValue) {
    xScale.logOrLinear = newValue;
  },
};

export default new Vuex.Store({
  state,
  mutations,
});
