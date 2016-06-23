import cobyla from './Cobyla';
import rebind from './rebind';
import expression from './expression';

export function fit(data, expr) {
  var startingScope = expr.scope(),
      paramNames = startingScope.map(d => d.key),
      startingValues = startingScope.map(d => d.value);

  function evaluate(n, params) {
    var scope = [];
    for (var i=0; i<params.length; ++i) {
      scope.push({ key: paramNames[i], value: params[i] });
    }
    expr.scope(scope);

    var sumSqr = 0;
    for (i=0; i<currentData.length; ++i) {
      var yData = currentData[i][1],
          yFit = expr.call(null, currentData[i][0]);

      sumSqr += (yData - yFit) * (yData - yFit);
    }

    return sumSqr;
  };

  var status = cobyla.findMinimum.apply(null, [
    evaluate,
    paramNames.length,
    0, /* num constraints */,
    startingValues,
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
    if (!isFitting) {
      return my;
    }

    fit(data, expr);
    callback(my);

    return my;
  };

  my = rebind(my, expr, 'scope', 'expr', 'variables');

  return my;
};
