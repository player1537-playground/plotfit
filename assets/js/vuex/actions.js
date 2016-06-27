import { getXScaleAsScale } from './getters';

export const setXScale = function({ dispatch, store }, e) {
  var expr = e.target.value.expr,
      scopeToAdd = e.target.value.scope,
      isLog = e.target.value.isLog,
      scale = getXScaleAsScale(store),
      variables = scale.variables(expr),
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

  dispatch('SET_XSCALE', { expr, isLog, scope: newScope });
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


export const setFittingExpr = function({ dispatch }, _) {
  dispatch('FITTING_SET_EXPR', _);
};

export const setFittingIsFitting = function({ dispatch }, _) {
  dispatch('FITTING_SET_IS_FITTING', _);
};

export const setFittingScope = function({ dispatch }, _) {
  dispatch('FITTING_SET_SCOPE', _);
};

export const fitFittingFunction = function({ dispatch, state }, _) {
  getFittingFunction(state).recalculate(function(fitter) {
    dispatch('FITTING_SET_SCOPE', fitter.scope());
  });
};



export const setSidebarLeft = function({ dispatch }, _) {
  dispatch('SIDEBAR_SET_LEFT', _);
};

export const setSidebarRight = function({ dispatch }, _) {
  dispatch('SIDEBAR_SET_RIGHT', _);
};
