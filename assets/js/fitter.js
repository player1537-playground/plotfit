import cobyla from './Cobyla';
import rebind from './rebind';
import expression from './expression';

export function fit(data, expr) {
  var startingScope = expr.scope(),
      paramNames = startingScope.map(d => d.key),
      startingValues = startingScope.map(d => d.value);

  data = data.filter(d => {
    return Number.isFinite(d[0]) &&
      Number.isFinite(d[1]) &&
      Number.isFinite(d[2]);
  });

  console.log("in fitter");

  function evaluate(numParams, numConstraints, params, constraints) {
    var scope = [];
    for (var i=0; i<params.length; ++i) {
      scope.push({ key: paramNames[i], value: params[i] });
    }
    expr.scope(scope);

    var sumSqr = 0;
    for (i=0; i<data.length; ++i) {
      var yData = data[i][1],
          xData = data[i][0];

      if (!Number.isFinite(xData)) {
        console.log('xData', xData);
        continue;
      }

      if (!Number.isFinite(yData)) {
        console.log('yData', yData);
        continue;
      }

      var yFit = expr.call(null, xData);

      if (!Number.isFinite(yFit)) {
        console.log('yFit', yFit);
        continue;
      }

      sumSqr += (yData - yFit) * (yData - yFit);
    }

    return sumSqr;
  };

  var calcfc = evaluate,
      numParams = paramNames.length,
      numConstraints = 0,
      x = startingValues,
      rhobeg = 10.0,
      rhoend = 0.001,
      iprint = 0,
      maxfun = 2000;

  var status = cobyla.findMinimum.apply(null, [
    calcfc,
    numParams,
    numConstraints,
    x,
    rhobeg,
    rhoend,
    iprint,
    maxfun,
  ]);

  return startingValues;
}

export default function fitter(parameters) {
  var expr = expression(parameters),
      isFitting = false,
      data = null;

  function my() {
    return expr.apply(null, arguments);
  }

  my.isFitting = function(_) {
    if (!arguments.length) return isFitting;
    isFitting = _;
    return my;
  };

  my.data = function(_) {
    if (!arguments.length) return data;
    data = _;
    return my;
  };

  my.recalculate = function(callback) {
    fit(data, expr);
    callback(my);

    return my;
  };

  my = rebind(my, expr, 'scope', 'expr', 'variables');

  return my;
};
