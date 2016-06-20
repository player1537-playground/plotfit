import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

const state = {
  xScale: {
    expr: 'Q',
  },
};

const mutations = {
  XSCALE_SET_EXPR({ xScale }, newExpr) {
    xScale.expr = newExpr;
  }
};

export default new Vuex.Store({
  state,
  mutations,
});
