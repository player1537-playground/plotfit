import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

const state = {
  xScale: {
    expr: 'Q',
    isLog: false,
  },
};

const mutations = {
  XSCALE_SET_EXPR({ xScale }, newExpr) {
    xScale.expr = newExpr;
  },
  XSCALE_SET_IS_LOG({ xScale }, newValue) {
    xScale.isLog = newValue;
  },
};

export default new Vuex.Store({
  state,
  mutations,
});
