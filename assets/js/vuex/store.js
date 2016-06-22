import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

const state = {
  xScale: {
    expr: 'Q',
    scope: [],
    isLog: false,
  },
  yScale: {
    expr: 'I',
    scope: [],
    isLog: false,
  },
  sidebar: {
    left: false,
    right: false,
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

  YSCALE_SET_EXPR({ yScale }, _) {
    yScale.expr = _;
  },
  YSCALE_SET_IS_LOG({ yScale }, _) {
    yScale.isLog = _;
  },
  YSCALE_SET_SCOPE({ yScale }, _) {
    yScale.scope = _;
  },

  SIDEBAR_SET_LEFT({ sidebar }, _) {
    sidebar.left = _;
  },
  SIDEBAR_SET_RIGHT({ sidebar }, _) {
    sidebar.right = _;
  },
};

export default new Vuex.Store({
  state,
  mutations,
});
