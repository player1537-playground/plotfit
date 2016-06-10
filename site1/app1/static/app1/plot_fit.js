plotfit = (function(my, d3, math) {
  my.expression = function expression() {
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
      return my;
    };

    my.scope = function(_) {
      if (!arguments.length) return scope;
      scope = _;
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
          scope[name] = 0;
        }
      });
      scope = newScope;

      compiled = parsed.compile();

      return my;
    };

    return my;
  };

  return my;

})(typeof plotfit==="undefined" ? {} : plotfit, Plotly.d3, math);

plotfit = (function(my, d3, math) {
  my.scale = function yScale() {
    var expression = plotfit.expression()
          .parameters(['Q', 'I']),
        logOrLinear = 'linear';

    function my() {
      return expression.apply(null, arguments);
    }

    my.logOrLinear = function(_) {
      if (!arguments.length) return logOrLinear;
      logOrLinear = _;
      return my;
    };

    return d3.rebind(my, expression, 'scope', 'expr');
  };

  return my;

})(typeof plotfit==="undefined" ? {} : plotfit, Plotly.d3, math);

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
        colors = function(d) { return "blue"; };
        name = "PlotFit Data",
        title = "PlotFit Chart",
        heightPercent = 80,
        fittedFunction = null,
        fittedLegendName = "Fit",
        xAxislogOrLinear = 'linear',
        yAxislogOrLinear = 'linear';

    function my(selection) {
      selection.each(function(fullData) {
        var fullX = fullData.map(x),
            fullY = fullData.map(y),
            fullDev = fullData.map(dev),
            tangled = d3.zip(fullX, fullY),
            plottedX = tangled.map(d => xScale.apply(xScale, d)),
            plottedY = tangled.map(d => yScale.apply(yScale, d)),
            plottedMinY = d3.min(plottedY.filter(d => yAxislogOrLinear === 'linear' || d > 0)),
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
              type: xAxislogOrLinear,
            },
            yaxis: {
              autorange: true,
              type: yAxislogOrLinear,
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

          Plotly.relayout(node, layoutUpdates);
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

    my.xAxislogOrLinear = function(_) {
      if (!arguments.length) return xAxislogOrLinear;
      xAxislogOrLinear = _;
      layoutUpdates['xaxis.type'] = _;
      return my;
    };

    my.yAxislogOrLinear = function(_) {
      if (!arguments.length) return yAxislogOrLinear;
      yAxislogOrLinear = _;
      layoutUpdates['yaxis.type'] = _;
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
          yScale = plotfit.scale().expr('I'),
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

      redraw();

      $("#btn-xaxis-linear").on("click", function(eventData) {
        chart.xAxislogOrLinear('linear');
        $(".btn-xaxis").removeClass("active");
        $(this).addClass("active");
        redraw();
      });

      $("#btn-xaxis-log").on("click", function(eventData) {
        chart.xAxislogOrLinear('log');
        $(".btn-xaxis").removeClass("active");
        $(this).addClass("active");
        redraw();
      });

      $("#btn-yaxis-linear").on("click", function(eventData) {
        chart.yAxislogOrLinear('linear');
        $(".btn-yaxis").removeClass("active");
        $(this).addClass("active");
        redraw();
      });

      $("#btn-yaxis-log").on("click", function(eventData) {
        chart.yAxislogOrLinear('log');
        $(".btn-yaxis").removeClass("active");
        $(this).addClass("active");
        redraw();
      });

      $("#yaxis-preprocess ul li a").on("click", function() {
        var val = $(this).attr('value');

        $("#yaxis-preprocess input").val(val);
        $("#yaxis-preprocess input").trigger('input');
      });

      $("#yaxis-preprocess input").on('input', function() {
        var val = $(this).val();

        yScale.expr($(this).val());
        redraw();
      });

      $("#xaxis-preprocess ul li a").on("click", function() {
        var val = $(this).attr('value');

        $("#xaxis-preprocess input").val(val);
        $("#xaxis-preprocess input").trigger('input');
      });

      $("#xaxis-preprocess input").on('input', function() {
        var val = $(this).val();

        xScale.expr($(this).val());
        redraw();
      });

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
        $("#yaxis-preprocess ul li a[value='I']").trigger('click');
        $("#xaxis-preprocess ul li a[value='Q']").trigger('click');
        $("#btn-yaxis-log").trigger('click');
        $("#btn-xaxis-log").trigger('click');
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
        $("#yaxis-preprocess input").val('I*Q').trigger('input');
        $("#xaxis-preprocess input").val('Q').trigger('click');
        $("#btn-yaxis-log").trigger('click');
        $("#btn-xaxis-log").trigger('click');
        fitting.fittingName('Porod');
        selectData();
      });

      function redraw() {
        chart
          .fittedFunction(fittedFunction)
          .fittedLegendName(fitting.fittingName());

        var yScope = d3.entries(yScale.scope());

        var yVars = d3.select("#yaxis-variables");

        var yGroups = yVars.selectAll('.form-group').data(yScope);
        yGroups.enter().append('div')
          .attr('class', 'form-group')
          .style('margin-bottom', '0px');
        yGroups.exit().remove();

        var yLabels = yGroups.selectAll('label').data(d => [d]);
        yLabels.enter().append('label')
          .attr("class", "col-sm-6 col-xs-6 control-label text-right");
        yLabels.exit().remove();
        yLabels
          .text(d => d.key);

        var yWrappers = yGroups.selectAll('div').data(d => [d]);
        yWrappers.enter().append('div')
          .attr('class', 'col-sm-6 col-xs-6');
        yWrappers.exit().remove();

        var yInputs = yWrappers.selectAll('input').data(d => [d]);
        yInputs.enter().append('input')
          .attr('class', 'form-control')
          .attr('type', 'text')
          .attr('placeholder', '0')
          .attr('name', d => d.key);
        yInputs.exit().remove();
        yInputs
          .on('input', function(d) {
            var scope = yScale.scope();
            scope[d.key] = this.value;
            yScale.scope(scope);

            redraw();
          });

        var xScope = d3.entries(xScale.scope());

        var xVars = d3.select("#xaxis-variables");

        var xGroups = xVars.selectAll('.form-group').data(xScope);
        xGroups.enter().append('div')
          .attr('class', 'form-group')
          .style('margin-bottom', '0px');
        xGroups.exit().remove();

        var xLabels = xGroups.selectAll('label').data(d => [d]);
        xLabels.enter().append('label')
          .attr("class", "col-sm-6 col-xs-6 control-label text-right");
        xLabels.exit().remove();
        xLabels
          .text(d => d.key);

        var xWrappers = xGroups.selectAll('div').data(d => [d]);
        xWrappers.enter().append('div')
          .attr('class', 'col-sm-6 col-xs-6');
        xWrappers.exit().remove();

        var xInputs = xWrappers.selectAll('input').data(d => [d]);
        xInputs.enter().append('input')
          .attr('class', 'form-control')
          .attr('type', 'text')
          .attr('placeholder', '0');
        xInputs.exit().remove();
        xInputs
          .on('input', function(d) {
            var scope = xScale.scope();
            scope[d.key] = this.value;
            xScale.scope(scope);
            redraw();
          });

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
