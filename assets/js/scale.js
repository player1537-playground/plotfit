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

  my.toString = function() {
    var x = "scale(" + this.isLog() + ", " + JSON.stringify(this.scope()) + ", " + this.expr() + ")";
    console.log("result", x);
    return x;
  };

  my = rebind(my, expr, 'scope', 'expr', 'variables');

  return my;
};
