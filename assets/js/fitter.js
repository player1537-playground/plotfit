import expression from './expression.js';
import rebind from './rebind.js';

export default function(parameters) {
  var expr = expression(parameters),
      isFitting = false;

  function my() {
    return expr.apply(null, arguments);
  }

  my.isFitting = function(_) {
    if (!arguments.length) return isFitting;
    isFitting = _;
    return my;
  };

  my = rebind(my, expr, 'scope', 'expr', 'variables');

  return my;
};
