plotfit = (function(my, d3) {
  my.xScale = function xScale() {
    var scaleName = 'Q',
        c = 0.0,
        xScales = d3.map(),
        scale;

    xScales.set('Q'      , Q => Q);
    xScales.set('log(Q)' , Q => Math.log10(Q));
    xScales.set('ln(Q)'  , Q => Math.log(Q));
    xScales.set('Q^2'    , Q => Math.pow(Q, 2.0));
    xScales.set('Q^c'    , Q => Math.pow(Q, c));

    function my() {
      return scale.apply(scale, arguments);
    }

    my.scaleName = function(_) {
      if (!arguments.length) return scaleName;
      scaleName = _;
      scale = xScales.get(scaleName);
      return my;
    };

    my.c = function(_) {
      if (!arguments.length) return c;
      c = _;
      return my;
    };

    my.scaleName(scaleName);

    return my;
  };

  return my;

})(typeof plotfit==="undefined" ? {} : plotfit, Plotly.d3);

plotfit = (function(my, d3, math) {
  my.yScale = function yScale() {
    var scope = d3.map(),
        yScales = d3.map(),
        scaleExpression = 'I',
        variables = [],
        scaleCompiled;

    function my(I, Q) {
      scope.set('I', I);
      scope.set('Q', Q);

      var newScope = {};
      scope.entries().forEach(function(d) {
        newScope[d.key] = d.value;
      });
      var val = scaleCompiled.eval(newScope);
      return val;
    }

    my.scaleExpression = function(_) {
      if (!arguments.length) return scaleExpression;
      scaleExpression = _;

      variables = math.parse(_).filter(function(node) {
        return node.isSymbolNode && node.name !== 'I' && node.name !== 'Q';
      }).map(function(node) {
        return node.name;
      });
      variables.forEach(function(d) {
        if (!scope.has(d)) {
          scope.set(d, 0.0);
        }
      });
      scaleCompiled = math.compile(_);
      console.log(variables, scope);

      return my;
    };

    my.variables = function(_) {
      if (!arguments.length) return variables;
      variables = _;
      return my;
    };

    my.scope = function(_) {
      if (!arguments.length) {
        var newScope = d3.map();
        variables.forEach(function(d) {
          newScope.set(d, scope.get(d));
        });
        return newScope;
      }
      scope = _;
      return my;
    };

    my.updateVariable = function(key, value) {
      scope.set(key, value);
      return my;
    };

    my.scaleExpression(my.scaleExpression());

    return my;
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
        fitting,
        x = function(d) { return d.x; },
        y = function(d) { return d.y; };

    function my(fullData, start, end) {
      var dataInRange = fullData.filter((d, i) => start <= i && i < end),
          xData = dataInRange.map(x),
          yData = dataInRange.map(y),
          tangledData = d3.zip(xData, yData),
          fitResults;

      fitResults = cobyla.nlFit(
        tangledData, // data to fit against
        fitting.evaluate, // function to fit with
        fitting.start, // starting values for this function
        fitting.min, // minimum values each parameter can take
        fitting.max, // maximum values each parameter can take
        fitting.constraints // inequality constraints on parameters
      );

      var fn = fitting.evaluate,
          params = fitResults.params;

      function fitted(Q) {
        return fn(Q, params);
      }

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
        x = function(d) { return d.x; },
        y = function(d) { return d.y; },
        dev = function(d) { return d.dev; },
        xScale = function(d) { return d; },
        yScale = function(d) { return d; },
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
            plottedX = fullX.map(xScale),
            plottedY = fullY.map(yScale),
            fullDev = fullData.map(dev),
            fittedY = null,
            trace = null,
            data;

        data = {
          name: name,
          x: plottedX,
          y: plottedY,
          mode: 'lines+markers',
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
          fittedY = fullX.map(fittedFunction).map(yScale);

          trace = {
            x: plottedX,
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

          Plotly.plot(node, [data], layout);

          if (fittedY !== null && !hasPlottedTrace) {
            Plotly.addTraces(node, trace);
            hasPlottedTrace = true;
          }

          hasInitialized = true;

        } else /* hasInitialized */ {
          node.data[0].x = data.x;
          node.data[0].y = data.y;
          node.data[0].error_y.array = data.dev;
          node.data[0].name = data.name;

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
          Plotly.redraw(node);

          layoutUpdates = {};
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
          xScale = plotfit.xScale(),
          yScale = plotfit.yScale(),
          fitting = plotfit.fitting()
            .x(d => d.Q)
            .y(d => d.I),
          fittedFunction = fitting(fullData, 0, fullData.length),
          chart = plotfit.chart()
            .x(d => d.Q)
            .y(d => d.I)
            .dev(d => d.dev)
            .heightPercent(80)
            .xScale(xScale)
            .yScale(yScale);

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

        console.log(val);
        yScale.scaleExpression($(this).val());
        redraw();
      });

      $("#dropdown-xaxis-preprocess li a").on("click", function() {
        var btn = $(this).parents(".dropdown").find(".btn"),
            val = $(this).attr('value');

        btn.html($(this).text() + ' <span class="caret"></span>');
        btn.val(val);

        xScale.scaleName(val);
        redraw();
      });

      $("#input-variable-a").on('input', function() {
        yScale.a(+$(this).val());
        redraw();
       });

      $("#input-variable-b").on('input', function() {
        yScale.b(+$(this).val());
        redraw();
      });

      $("#input-variable-c").on('input', function() {
        xScale.c(+$(this).val());
        redraw();
      });

      window.addEventListener('resize', function() {
        Plotly.Plots.resize(plotContainer.node());
      });

      $("#plot_range_slider").slider({
        range: true,
        min: 0,
        max: fullData.length,
        values: [0, fullData.length],
        slide: function(event, ui) {
          console.log(ui.values[0], ui.values[1]);
          selectData(ui.values[0], ui.values[1]);
        },
      });

      $("#fitting-guinier").on('click', function() {
        $("#dropdown-yaxis-preprocess li a[value='I']").trigger('click');
        $("#dropdown-xaxis-preprocess li a[value='Q']").trigger('click');
        $("#btn-yaxis-log").trigger('click');
        $("#btn-xaxis-log").trigger('click');
        fitting.fittingName('Guinier');
        selectData(0, fullData.length);
      });

      $("#fitting-kratky").on('click', function() {
        fitting.fittingName('Kratky');
        selectData(0, fullData.length);
      });

      $("#fitting-zimm").on('click', function() {
        fitting.fittingName('Zimm');
        selectData(0, fullData.length);
      });

      $("#fitting-porod").on('click', function() {
        $("#dropdown-yaxis-preprocess li a[value='I*Q^a']").trigger('click');
        $("#dropdown-xaxis-preprocess li a[value='Q']").trigger('click');
        $("#btn-yaxis-log").trigger('click');
        $("#btn-xaxis-log").trigger('click');
        $("#input-variable-a").val(1);
        $("#input-variable-a").trigger('input');
        fitting.fittingName('Porod');
        selectData(0, fullData.length);
      });

      function redraw() {
        chart
          .fittedFunction(fittedFunction)
          .fittedLegendName(fitting.fittingName());

        var scope = yScale.scope().entries();

        var yVars = d3.select("#yaxis-variables");

        var groups = yVars.selectAll('.form-group').data(scope);
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
          .attr('value', d => d.value);

        inputs.exit().remove();
        inputs
          .on('input', function(d) {
            yScale.updateVariable(d.key, this.value);
            redraw();
          });

        plotContainer.data([fullData])
          .call(chart);
      }

      function selectData(start, end) {
        fittedFunction = fitting(fullData, start, end);
        chart.fittedFunction(fittedFunction);

        fittedFunction.params.map(function(d) {
          console.log(d.prettyName, "=", d.value);
        });

        redraw();
      }

    });
})();
