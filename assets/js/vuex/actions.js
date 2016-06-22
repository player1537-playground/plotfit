import { getXScale, getXScaleScope, getYScale, getYScaleScope } from './getters';

export const setXScaleExpr = function({ dispatch }, _) {
  dispatch('XSCALE_SET_EXPR', _);
};

export const setXScaleIsLog = function({ dispatch }, _) {
  dispatch('XSCALE_SET_IS_LOG', _);
};

export const setXScaleScope = function({ dispatch }, _) {
  dispatch('XSCALE_SET_SCOPE', _);
};

export const setYScaleExpr = function({ dispatch }, _) {
  dispatch('YSCALE_SET_EXPR', _);
};

export const setYScaleIsLog = function({ dispatch }, _) {
  dispatch('YSCALE_SET_IS_LOG', _);
};

export const setYScaleScope = function({ dispatch }, _) {
  dispatch('YSCALE_SET_SCOPE', _);
};

export const setSidebarLeft = function({ dispatch }, _) {
  dispatch('SIDEBAR_SET_LEFT', _);
};

export const setSidebarRight = function({ dispatch }, _) {
  dispatch('SIDEBAR_SET_RIGHT', _);
};
