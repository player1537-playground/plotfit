export const setXScaleExpr = function({ dispatch }, newExpr) {
  dispatch('XSCALE_SET_EXPR', newExpr);
};

export const setXScaleIsLog = function({ dispatch }, newValue) {
  dispatch('XSCALE_SET_IS_LOG', newValue);
};
