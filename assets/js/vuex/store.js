import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

import { getXScale, getXScaleScope, getYScale, getYScaleScope } from './getters';

function getNewScope(expr, scale, scope) {
  var variables = scale.variables(expr),
      newScopeMap = {},
      newScope = [];

  for (var i=0; i<variables.length; ++i) {
    newScopeMap[variables[i]] = 0.0;
  }

  for (i=0; i<scope.length; ++i) {
    if (variables.includes(scope[i].key)) {
      newScopeMap[scope[i].key] = scope[i].value;
    }
  }

  for (var key in newScopeMap) {
    newScope.push({ key, value: newScopeMap[key] });
  }

  return newScope;
}

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
  XSCALE_SET_EXPR(state, _) {
    state.xScale.expr = _;
    state.xScale.scope = getNewScope(_, getXScale(state), getXScaleScope(state));
  },
  XSCALE_SET_IS_LOG({ xScale }, _) {
    xScale.isLog = _;
  },
  XSCALE_SET_SCOPE({ xScale }, _) {
    xScale.scope = _;
  },

  YSCALE_SET_EXPR(state, _) {
    state.yScale.expr = _;
    state.yScale.scope = getNewScope(_, getYScale(state), getYScaleScope(state));
  },
  YSCALE_SET_IS_LOG({ yScale }, _) {
    yScale.isLog = _;
  },
  YSCALE_SET_SCOPE({ yScale }, _) {
    yScale.scope = _;
  },

  FITTING_SET_EXPR(state, _) {
    state.fitting.expr = _;
    state.fitting.scope = getNewScope(_, getFittingScale(state), getFittingScaleScope(state));
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
