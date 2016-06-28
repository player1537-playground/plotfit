import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

import { getXScale, getXScaleScope,
         getYScale, getYScaleScope,
         getFittingFunction, getFittingScope } from './getters';

import { SET_XSCALE, SET_YSCALE } from './mutation-types';

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
  fitting: {
    expr: 'm*X+b',
    scope: [],
    isFitting: false,
  },
  sidebar: {
    left: false,
    right: true,
  },
};

const mutations = {
  [SET_XSCALE] ({ xScale }, { expr, scope, isLog }) {
    xScale.expr = expr;
    xScale.scope = scope;
    xScale.isLog = isLog;
  },

  [SET_YSCALE] ({ yScale }, { expr, scope, isLog }) {
    yScale.expr = expr;
    yScale.scope = scope;
    yScale.isLog = isLog;
  },

  FITTING_SET_EXPR(state, _) {
    state.fitting.expr = _;
    state.fitting.scope = getNewScope.apply(null, [
      _,
      getFittingFunction(state),
      getFittingScope(state),
    ]);
  },
  FITTING_SET_IS_FITTING({ fitting }, _) {
    fitting.isLog = _;
  },
  FITTING_SET_SCOPE({ fitting }, _) {
    fitting.scope = _;
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
