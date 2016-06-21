export const xScaleSetExpr = function({ dispatch }, newExpr) {
  dispatch('XSCALE_SET_EXPR', newExpr);
};

export const xScaleSetIsLog = function({ dispatch }, newValue) {
  dispatch('XSCALE_SET_IS_LOG', newValue);
};
