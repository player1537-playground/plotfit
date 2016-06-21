import expression from './expression.js';
import rebind from './rebind.js';

export default function(parameters) {
  var expr = expression(parameters),
      isLog = false;

  function my() {
    return expr.apply(null, arguments);
  }

  my.isLog = function(_) {
    if (!arguments.length) return isLog;
    isLog = _;
    return my;
  };

  my = rebind(my, expression, 'scope', 'expr');

  return my;
};
