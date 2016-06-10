plotfit = (function(my, d3, math) {
  my.expression = function expression(dispatch) {
    dispatch = dispatch || d3.dispatch.apply(null, [
      'parameters', 'scope', 'expr', 'change',
    ]);

    var parameters = [],
        scope = {},
        expr = null,
        compiled = null;

    function my() {
      var fullScope = {};

      d3.entries(scope).forEach(function(d) {
        fullScope[d.key] = d.value;
      });

      d3.zip(parameters, arguments).forEach(function(d) {
        fullScope[d[0]] = d[1];
      });

      return compiled.eval(fullScope);
    }

    my.parameters = function(_) {
      if (!arguments.length) return parameters;
      parameters = _;
      dispatch.parameters.call(null, my);
      dispatch.change.call(null, my);
      return my;
    };

    my.scope = function(_) {
      if (!arguments.length) return scope;
      scope = _;
      dispatch.scope.call(null, my);
      dispatch.change.call(null, my);
      return my;
    };

    my.expr = function(_) {
      if (!arguments.length) return expr;
      expr = _;

      var parsed = math.parse(_);

      var variables = parsed.filter(function(node) {
        return node.isSymbolNode && !parameters.includes(node.name);
      }).map(function(node) {
        return node.name;
      });

      var newScope = {};
      variables.forEach(function(name) {
        if (scope.hasOwnProperty(name)) {
          newScope[name] = scope[name];
        } else {
          newScope[name] = 0;
        }
      });
      scope = newScope;

      console.log(_, variables, newScope);

      compiled = parsed.compile();

      dispatch.expr.call(null, my);
      dispatch.change.call(null, my);

      return my;
    };

    my = d3.rebind(my, dispatch, 'on');

    return my;
  };

  return my;

})(typeof plotfit==="undefined" ? {} : plotfit, Plotly.d3, math);

plotfit = (function(my, d3, math) {
  my.scale = function scale(dispatch) {
    dispatch = dispatch || d3.dispatch.apply(null, [
      'parameters', 'scope', 'expr', 'change', 'logOrLinear',
    ]);

    var expression = plotfit.expression(dispatch)
          .parameters(['Q', 'I']),
        logOrLinear = 'linear';

    function my() {
      return expression.apply(null, arguments);
    }

    my.logOrLinear = function(_) {
      if (!arguments.length) return logOrLinear;
      logOrLinear = _;
      dispatch.logOrLinear.call(null, my);
      dispatch.change.call(null, my);
      return my;
    };

    my = d3.rebind(my, dispatch, 'on');
    my = d3.rebind(my, expression, 'scope', 'expr');

    return my;
  };

  return my;

})(typeof plotfit==="undefined" ? {} : plotfit, Plotly.d3, math);

plotfit = (function(my, d3) {
  my.scaleVC = function scaleVC() {
    var scale = plotfit.scale();

    function my(selection) {
      selection.each(function(data) {
        var self = d3.select(this);

        function redraw() {
          var inputGroup = self.selectAll(".input-group").data(d => [d]);
          inputGroup.enter().append('div')
            .attr('class', 'input-group');

          var btnGroup = inputGroup.selectAll(".input-group-btn").data(d => [d]);
          btnGroup.enter().append('div')
            .attr('class', 'input-group-btn');

          var btn = btnGroup.selectAll('.dropdown-toggle').data(d => [d]);
          btn.enter().append('button')
            .attr('class', 'btn btn-default dropdown-toggle')
            .attr('data-toggle', 'dropdown');
          btn
            .html(d => d.dropdownText + '<span class="caret" />');

          var ul = btnGroup.selectAll('ul').data(d => [d]);
          ul.enter().append('ul')
            .attr('class', 'dropdown-menu');

          var li = ul.selectAll('li').data(d => d.options);
          li.enter().append('li');

          var logBtn = btnGroup.selectAll('.log-btn').data(d => [d]);
          logBtn.enter().append('button')
            .attr('class', 'btn btn-default log-btn')
            .text('log');
          logBtn
            .classed('active', scale.logOrLinear() === 'log')
            .on('click', function() {
              scale.logOrLinear(scale.logOrLinear() === 'log' ? 'linear' : 'log');
            });

          var a = li.selectAll('a').data(d => [d]);
          a.enter().append('a')
            .attr('href', '#');
          a
            .attr('value', d => d)
            .text(d => d)
            .on('click', function(d) {
              scale.expr(d);
            });

          var input = inputGroup.selectAll('input').data(d => [d]);
          input.enter().append('input')
            .attr('type', 'text')
            .attr('class', 'form-control pull-left');
          input
            .property('value', scale.expr())
            .on('input', function(d) {
              scale.expr(d3.select(this).property('value'));
            });

          var scopeEntries = d3.entries(scale.scope());

          var vars = self.selectAll('.variables').data([scopeEntries]);
          vars.enter().append('div')
            .attr('class', 'variables form-horizontal');

          var groups = vars.selectAll('.form-group').data(d => { console.log(d); return d; });
          groups.enter().append('div')
            .attr('class', 'form-group')
            .style('margin-bottom', '0px');
          groups.exit().remove();

          var labels = groups.selectAll('label').data(d => [d]);
          labels.enter().append('label')
            .attr("class", "col-sm-6 col-xs-6 control-label text-right");
          labels.exit().remove();
          labels
            .text(d => d.key);

          var wrappers = groups.selectAll('div').data(d => [d]);
          wrappers.enter().append('div')
            .attr('class', 'col-sm-6 col-xs-6');
          wrappers.exit().remove();

          var inputs = wrappers.selectAll('input').data(d => [d]);
          inputs.enter().append('input')
            .attr('class', 'form-control')
            .attr('type', 'text')
            .attr('placeholder', '0')
            .attr('name', d => d.key);
          inputs.exit().remove();
          inputs
            .attr('value', d => d.value === 0 ? '' : d.value)
            .on('input', function(d) {
              var scope = scale.scope();
              scope[d.key] = this.value;
              scale.scope(scope);
            });
        }

        redraw();

        scale.on('change.scaleVC', function() {
          redraw();
        });

      });
    }

    my.scale = function(_) {
      if (!arguments.length) return scale;
      scale.on('change.scaleVC', null);
      scale = _;
      return my;
    };

    return my;
  };

  return my;

})(typeof plotfit==="undefined" ? {} : plotfit, Plotly.d3);

plotfit = (function(my, d3) {
  var fittings = d3.map();

  fittings.set('Guinier', {
    start: [1.0, 1.0],
    min: [-1000.0, -1000.0],
    max: [1000.0, 1000.0],

    evaluate: function(Q, params) {
      var I0 = params[0],
          RG = params[1],
          inside = -1.0 / 3.0 * Math.pow(Q, 2.0) * Math.pow(RG, 2.0);
      return I0 * Math.exp(inside);
    },

    constraints: function(tangled, fn, params) {
      var I0 = params[0],
          RG = params[1];
      return [
        I0, // >= 0 because ln(I0) can be taken
        RG, // >= 0 because radius/distance is positive
      ];
    },

    params: function(params) {
      return [
        { codename: 'I0', prettyName: 'I0', value: params[0] },
        { codename: 'RG', prettyName: 'RG', value: params[1] },
      ];
    }
  });

  fittings.set('Porod', {
    start: [1.0, 1.0, 1.0],
    min: [-1000.0, -1000.0, -10.0],
    max: [1000.0, 1000.0, 10.0],

    evaluate: function(Q, params) {
      var A = params[0],
          B = params[1],
          n = params[2];
      return A / Math.pow(Q, n) + B;
    },

    constraints: function(tangled, fn, params) {
      var A = params[0],
          B = params[1],
          n = params[2];
      return [
      ];
    },

    params: function(params) {
      return [
        { codename: 'A', prettyName: 'A', value: params[0] },
        { codename: 'B', prettyName: 'B', value: params[1] },
        { codename: 'n', prettyName: 'n', value: params[2] },
      ];
    },
  });

  my.fitting = function fitting() {
    var fittingName = "Guinier",
        x = function(d) { return d.x; },
        y = function(d) { return d.y; },
        startValues,
        firstFitting,
        fitting;

    function my(fullData, start, end) {
      var dataInRange = fullData.filter((d, i) => start <= i && i < end),
          xData = dataInRange.map(x),
          yData = dataInRange.map(y),
          tangledData = d3.zip(xData, yData),
          fitResults;

      for (var i=0; i == 0 || fitting.firstRun && i<1; ++i) {
        fitResults = cobyla.nlFit(
          tangledData, // data to fit against
          fitting.evaluate, // function to fit with
          startValues, // starting values for this function
          fitting.min, // minimum values each parameter can take
          fitting.max, // maximum values each parameter can take
          fitting.constraints, // inequality constraints on parameters
          { maxFun: firstFitting ? 200000 : 3500, rhoEnd: 1.0e-20 }
        );
      }

      firstFitting = false;

      var fn = fitting.evaluate,
          params = fitResults.params;

      function fitted(Q) {
        return fn(Q, params);
      }

      fitted.domain = function(_) {
        if (!arguments.length) return [start, end];
        console.error("fitted.domain() not a setter");
        return fitted;
      };

      fitted.params = fitting.params(params);

      return fitted;
    };

    my.x = function(_) {
      if (!arguments.length) return x;
      x = _;
      return my;
    };

    my.y = function(_) {
      if (!arguments.length) return y;
      y = _;
      return my;
    };

    my.fittingName = function(_) {
      if (!arguments.length) return fittingName;
      fittingName = _;
      fitting = fittings.get(fittingName);
      startValues = fitting.start.slice();
      firstFitting = true;
      return my;
    };

    my.fittingName(my.fittingName());

    return my;
  };

  return my;

})(typeof plotfit==="undefined" ? {} : plotfit, Plotly.d3);

plotfit = (function(my, Plotly, d3) {
  my.chart = function chart() {
    var hasInitialized = false,
        hasPlottedTrace = false,
        layoutUpdates = {},
        styleUpdates = {},
        x = function(d) { return d.x; },
        y = function(d) { return d.y; },
        dev = function(d) { return d.dev; },
        xScale = function(X, Y) { return X; },
        yScale = function(X, Y) { return Y; },
        colors = function(d) { return "blue"; },
        name = "PlotFit Data",
        title = "PlotFit Chart",
        heightPercent = 80,
        fittedFunction = null,
        fittedLegendName = "Fit";

    function my(selection) {
      selection.each(function(fullData) {
        var fullX = fullData.map(x),
            fullY = fullData.map(y),
            fullDev = fullData.map(dev),
            tangled = d3.zip(fullX, fullY),
            plottedX = tangled.map(d => xScale.apply(xScale, d)),
            plottedY = tangled.map(d => yScale.apply(yScale, d)),
            fittedY = null,
            trace = null,
            data;

        data = {
          name: name,
          x: plottedX,
          y: plottedY,
          mode: 'lines+markers',
          marker: {
            color: tangled.map(colors),
          },
          error_y: {
            type: 'data',
            visible: true,
            array: fullDev,
            thickness: 1.5,
            width: 3,
            opacity: 0.5,
          },
        };

        if (fittedFunction !== null) {
          var fittedDomain = fittedFunction.domain(),
              start = fittedDomain[0],
              end = fittedDomain[1],
              tangledFit = tangled.filter((d, i) => start <= i && i < end);
          fittedY = tangledFit.map(function(d) {
            return yScale(d[0], fittedFunction(d[0]));
          });
          fittedX = tangledFit.map(d => d[0]);

          trace = {
            x: fittedX,
            y: fittedY,
            name: fittedLegendName,
            type: 'scatter',
          };
        }


        var node = this;

        if (!hasInitialized) {
          d3.select(node)
            .style('height', heightPercent + 'vh');

          var layout = {
            xaxis: {
              autorange: true,
              type: xScale.logOrLinear(),
            },
            yaxis: {
              autorange: true,
              type: yScale.logOrLinear(),
            },
            title: title,
            showlegend: true,
            legend: {
              orientation: 'h',
            },
          };

          Plotly.newPlot(node, [data], layout, {showLink:true});

          if (fittedY !== null && !hasPlottedTrace) {
            Plotly.addTraces(node, trace);
            hasPlottedTrace = true;
          }

          hasInitialized = true;

        } else /* hasInitialized */ {
          node.data[0].x = data.x;
          node.data[0].y = data.y;
          node.data[0].error_y.array = data.error_y.array;
          node.data[0].name = data.name;
          node.data[0].marker.color = data.marker.color;

          if (fittedY !== null) {
            if (!hasPlottedTrace) {
              Plotly.addTraces(node, trace);
              hasPlottedTrace = true;
            } else {
              node.data[1].x = trace.x;
              node.data[1].y = trace.y;
              node.data[1].name = trace.name;
            }
          }

          Plotly.relayout(node, {
            'xaxis.type': xScale.logOrLinear(),
            'yaxis.type': yScale.logOrLinear(),
          });
          Plotly.restyle(node, styleUpdates, [0]);
          Plotly.redraw(node);

          layoutUpdates = {};
          styleUpdates = {};
        }

      });
    };

    my.x = function(_) {
      if (!arguments.length) return x;
      x = _;
      return my;
    };

    my.y = function(_) {
      if (!arguments.length) return y;
      y = _;
      return my;
    };

    my.dev = function(_) {
      if (!arguments.length) return dev;
      dev = _;
      return my;
    };

    my.xScale = function(_) {
      if (!arguments.length) return xScale;
      xScale = _;
      return my;
    };

    my.yScale = function(_) {
      if (!arguments.length) return yScale;
      yScale = _;
      return my;
    };

    my.name = function(_) {
      if (!arguments.length) return name;
      layoutUpdates.name = name;
      return my;
    };

    my.title = function(_) {
      if (!arguments.length) return title;
      title = _;
      layoutUpdates.title = _;
      return my;
    };

    my.heightPercent = function(_) {
      if (!arguments.length) return heightPercent;
      heightPercent = _;
      return my;
    };

    my.fittedFunction = function(_) {
      if (!arguments.length) return fittedFunction;
      fittedFunction = _;
      return my;
    };

    my.fittedLegendName = function(_) {
      if (!arguments.length) return fittedLegendName;
      fittedLegendName = _;
      return my;
    };

    my.colors = function(_) {
      if (!arguments.length) return colors;
      colors = _;
      return my;
    };

    return my;
  };

  return my;

})(typeof plotfit==="undefined" ? {} : plotfit, Plotly, Plotly.d3);

(function() {
  var d3 = Plotly.d3;

  Plotly.d3.csv(filename)
    .row(function(d) { return { Q: +d.Q, I: +d.I, dev: +d.dev }; })
    .get(function(error, fullData) {
      var plotContainer = d3.select("#plot_container"),
          xScale = plotfit.scale().expr('Q'),
          xScaleVC = plotfit.scaleVC().scale(xScale),
          yScale = plotfit.scale().expr('I'),
          yScaleVC = plotfit.scaleVC().scale(yScale),
          fitting = plotfit.fitting()
            .x(d => d.Q)
            .y(d => d.I),
          chart = plotfit.chart()
            .x(d => d.Q)
            .y(d => d.I)
            .dev(d => d.dev)
            .heightPercent(80)
            .colors(d => "blue")
            .xScale(xScale)
            .yScale(yScale),
          fittedFunction = null;

      d3.select("#x-axis-settings").datum({
        options: ['Q', 'log10(Q)', 'log(Q)', 'Q^2', 'Q^a'],
        dropdownText: 'X = ',
      }).call(xScaleVC);

      d3.select("#y-axis-settings").datum({
        options: ['I', 'log10(I)', 'log(I)', '1/I', 'I^a', 'I*Q^a', 'I^a*Q^b',
                  '1/sqrt(I)', 'log(I*Q)', 'log(I*Q^2)', 'log(I*Q+B)', ],
        dropdownText: 'Y = ',
      }).call(yScaleVC);

      xScale.on('change.main', function() {
        redraw();
      });

      yScale.on('change.main', function() {
        redraw();
      });

      redraw();

      window.addEventListener('resize', function() {
        Plotly.Plots.resize(plotContainer.node());
      });

      $("#plot_range").bootstrapSlider({
        max: fullData.length,
        value: [0, fullData.length],
        tooltip: 'always',
        formatter: function(value) {
          if (!value.length) { return ''; }
          var first = fullData[value[0]].Q,
              last = fullData[Math.min(fullData.length - 1, value[1])].Q;
          return first.toString().substring(0,4) + ' : ' + last.toString().substring(0,4);
        },
      }).on("slide", function(ev) {
        selectData(ev.value[0], ev.value[1]);
      });

      $("#fitting-guinier").on('click', function() {
        yScale
          .expr('I')
          .logOrLinear('log');

        xScale
          .expr('Q')
          .logOrLinear('log');

        fitting.fittingName('Guinier');
        selectData();
      });

      $("#fitting-kratky").on('click', function() {
        fitting.fittingName('Kratky');
        selectData();
      });

      $("#fitting-zimm").on('click', function() {
        fitting.fittingName('Zimm');
        selectData();
      });

      $("#fitting-porod").on('click', function() {
        yScale
          .expr('I*Q')
          .logOrLinear('log');

        xScale
          .expr('Q')
          .logOrLinear('log');

        fitting.fittingName('Porod');
        selectData();
      });

      function redraw() {
        chart
          .fittedFunction(fittedFunction)
          .fittedLegendName(fitting.fittingName());

        plotContainer.data([fullData])
          .call(chart);
      }

      var selectDataOldStart = 0,
          selectDataOldEnd = fullData.length;
      function selectData(start, end) {
        if (typeof start === 'undefined') {
          start = selectDataOldStart;
        }

        if (typeof end === 'undefined') {
          end = selectDataOldEnd;
        }

        selectDataOldStart = start;
        selectDataOldEnd = end;

        fittedFunction = fitting(fullData, start, end);
        chart.fittedFunction(fittedFunction);

        var params = fittedFunction.params;

        console.log(params);

        var parent = d3.select("#fitting-parameters");

        var groups = parent.selectAll('.form-group').data(params);
        groups.enter().append('div')
          .attr('class', 'form-group')
          .style('margin-bottom', '0px');
        groups.exit().remove();

        var labels = groups.selectAll('label').data(d => [d]);
        labels.enter().append('label')
          .attr("class", "col-sm-6 col-xs-6 control-label text-right");
        labels.exit().remove();
        labels
          .text(d => d.prettyName);

        var wrappers = groups.selectAll('div').data(d => [d]);
        wrappers.enter().append('div')
          .attr('class', 'col-sm-6 col-xs-6');
        wrappers.exit().remove();

        var inputs = wrappers.selectAll('input').data(d => [d]);
        inputs.enter().append('input')
          .attr('class', 'form-control')
          .attr('type', 'text')
          .attr('placeholder', '0')
          .attr('name', d => d.name);
        inputs.exit().remove();
        inputs
          .attr('value', d => d.value.toString().substring(0, 5))
          .on('input', function(d) {
            yScale.updateVariable(d.key, this.value);
            redraw();
          });

        chart.colors(function(d, i) {
          return (start <= i && i < end) ? "blue" : "steelblue";
        });

        fittedFunction.params.map(function(d) {
          console.log(d.prettyName, "=", d.value);
        });

        redraw();
      }

    });
})();
