plotfit = (function(my, d3) {
  my.xScale = function xScale() {
    var scaleName = 'Q',
        c = 0.0,
        xScales = d3.map(),
        scale;

    xScales.set('Q'      , Q => Q);
    xScales.set('Log(Q)' , Q => Math.log10(Q));
    xScales.set('Ln(Q)'  , Q => Math.log(Q));
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

plotfit = (function(my, d3) {
  my.yScale = function yScale() {
    var scaleName = 'I',
        a = 0.0,
        b = 0.0,
        yScales = d3.map(),
        scale;

    yScales.set('I'         , I => I);
    yScales.set('Log(I)'    , I => Math.log10(I));
    yScales.set('Ln(I)'     , I => Math.log(I));
    yScales.set('1/I'       , I => 1.0 / I);
    yScales.set('I^a'       , I => Math.pow(I, a));
    yScales.set('I*Q^a'     , (I, Q) => I * Math.pow(Q, a));
    yScales.set('I^a*Q^b'   , (I, Q) => Math.pow(I, a) * Math.pow(Q, b));
    yScales.set('1/Sqrt(I)' , I => 1.0 / Math.sqrt(I));
    yScales.set('Ln(I*Q)'   , (I, Q) => Math.log(I * Q));
    yScales.set('Ln(I*Q^2)' , (I, Q) => Math.log(I * Math.pow(Q, 2.0)));
    yScales.set('Ln(I*Q+B)' , (I, Q) => Math.log(I * Q + b));

    function my() {
      return scale.apply(scale, arguments);
    }

    my.scaleName = function(_) {
      if (!arguments.length) return scaleName;
      scaleName = _;
      scale = yScales.get(scaleName);
      return my;
    };

    my.a = function(_) {
      if (!arguments.length) return a;
      a = _;
      return my;
    };

    my.b = function(_) {
      if (!arguments.length) return b;
      b = _;
      return my;
    };

    my.scaleName(my.scaleName());

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
        I0, // >= 0 because Ln(I0) can be taken
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
    // d3.select(foo).data([fullData]).call(plotfit.chart().x().y())
    // d3.select(foo).data([newData]).call(

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
        xAxisLogOrLinear = 'linear',
        yAxisLogOrLinear = 'linear';

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
              type: xAxisLogOrLinear,
            },
            yaxis: {
              autorange: true,
              type: yAxisLogOrLinear,
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

    my.xAxisLogOrLinear = function(_) {
      if (!arguments.length) return xAxisLogOrLinear;
      xAxisLogOrLinear = _;
      layoutUpdates['xaxis.type'] = _;
      return my;
    };

    my.yAxisLogOrLinear = function(_) {
      if (!arguments.length) return yAxisLogOrLinear;
      yAxisLogOrLinear = _;
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
        chart.xAxisLogOrLinear('linear');
        $(".btn-xaxis").removeClass("active");
        $(this).addClass("active");
        redraw();
      });

      $("#btn-xaxis-log").on("click", function(eventData) {
        chart.xAxisLogOrLinear('log');
        $(".btn-xaxis").removeClass("active");
        $(this).addClass("active");
        redraw();
      });

      $("#btn-yaxis-linear").on("click", function(eventData) {
        chart.yAxisLogOrLinear('linear');
        $(".btn-yaxis").removeClass("active");
        $(this).addClass("active");
        redraw();
      });

      $("#btn-yaxis-log").on("click", function(eventData) {
        chart.yAxisLogOrLinear('log');
        $(".btn-yaxis").removeClass("active");
        $(this).addClass("active");
        redraw();
      });

      $("#dropdown-yaxis-preprocess li a").on("click", function() {
        var btn = $(this).parents(".dropdown").find(".btn"),
            val = $(this).attr('value');

        btn.html($(this).text() + ' <span class="caret"></span>');
        btn.val(val);

        yScale.scaleName(val);
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
