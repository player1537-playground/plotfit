import math from 'mathjs';

export default function(parameters) {
  var scope = [],
      expr = null,
      compiled = null;

  function my() {
    var fullScope = {};

    for (var i=0; i<scope.length; ++i) {
      fullScope[scope[i].key] = scope[i].value;
    }

    for (i=0; i<parameters.length; ++i) {
      fullScope[parameters[i]] = arguments[i];
    }

    return compiled.eval(fullScope);
  }

  my.scope = function(_) {
    if (!arguments.length) return scope;
    scope = _;
    return my;
  };

  my.expr = function(_) {
    if (!arguments.length) return expr;
    expr = _;
    compiled = math.compile(expr);
    return my;
  };

  my.textExpr = function(skipConstantTransform) {
    var parsed = math.parse(expr);

    if (!skipConstantTransform) {
      var scopeLookup = {};

      for (var i=0; i<scope.length; ++i) {
        scopeLookup[scope[i].key] = scope[i].value;
      }

      parsed = parsed.transform(function(node, path, parent) {
        if (node.isSymbolNode && !parameters.includes(node.name)) {
          return new math.expression.node.ConstantNode(scope[node.name]);
        } else {
          return node;
        }
      });
    }

    return parsed.toString({ parenthesis: 'auto' });
  };

  my.variables = function(expr) {
    var variables = math.parse(expr).filter(function(node) {
      return node.isSymbolNode && !parameters.includes(node.name);
    }).map(function(node) {
      return node.name;
    });

    return variables;
  };

  return my;
}
