import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

import { SET_XSCALE, SET_YSCALE, SET_FITTING } from './mutation-types';

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
    expr: '',
    scope: [],
    isFitting: false,
    domain: [0, Infinity],
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

  [SET_FITTING] ({ fitting }, { expr, scope, isFitting, domain }) {
    fitting.expr = expr;
    fitting.scope = scope;
    fitting.isFitting = isFitting;
    fitting.domain = domain;
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
