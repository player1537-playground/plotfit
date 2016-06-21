export const xScaleSetExpr = function({ dispatch }, newExpr) {
  dispatch('XSCALE_SET_EXPR', newExpr);
};

export const xScaleSetLogOrLinear = function({ dispatch }, newValue) {
  dispatch('XSCALE_SET_LOG_OR_LINEAR', newValue);
};
