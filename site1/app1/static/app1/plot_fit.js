plotfit = (function(my, d3, math) {
  my.expression = function expression(dispatch) {
    dispatch = dispatch || d3.dispatch.apply(null, [
      'parameters', 'scope', 'expr', 'change',
    ]);

    var parameters = [],
        scope = {},
        defaultValue = 0,
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
          newScope[name] = defaultValue;
        }
      });
      scope = newScope;

      compiled = parsed.compile();

      dispatch.expr.call(null, my);
      dispatch.scope.call(null, my);
      dispatch.change.call(null, my);

      return my;
    };

    my.defaultValue = function(_) {
      if (!arguments.length) return defaultValue;
      defaultValue = _;
      return my;
    };

    my.copy = function(_) {
      var scopeCopy = {};
      d3.entries(my.scope()).forEach(function(d) {
        scopeCopy[d.key] = d.value;
      });

      return expression()
        .defaultValue(defaultValue)
        .parameters(parameters)
        .expr(expr)
        .scope(scopeCopy);
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
  my.sidebarInput = function sidebarInput(dispatch) {
    dispatch = dispatch || d3.dispatch.apply(null, [
      'dropdownSelected', 'buttonPressed', 'textChanged', 'inputChanged',
    ]);

    var dropdownLabel = 'Sel ',
        dropdownOptions = [],
        buttonText = 'But',
        inputPlaceholder = 'placeholder',
        inputValue = '';

    function my(selection) {
      selection.each(function(data) {
        var self = d3.select(this);

        function redraw() {
          var inputGroup = self.selectAll(".input-group").data(d => [d]);
          inputGroup.enter().append('div')
            .attr('class', 'input-group');

          var dropdown = inputGroup.selectAll(".input-group-btn").data(d => [d]);
          dropdown.enter().append('div')
            .attr('class', 'input-group-btn');

          var dropBtn = dropdown.selectAll('.dropdown-toggle').data(d => [d]);
          dropBtn.enter().append('button')
            .attr('class', 'btn btn-default dropdown-toggle')
            .attr('data-toggle', 'dropdown');
          dropBtn
            .html(d => d.dropdownLabel + '<span class="caret" />');

          var ul = dropdown.selectAll('ul').data(d => [d]);
          ul.enter().append('ul')
            .attr('class', 'dropdown-menu');

          var li = ul.selectAll('li').data(d => d.options);
          li.enter().append('li');

          var a = li.selectAll('a').data(d => [d]);
          a.enter().append('a')
            .attr('href', '#');
          a
            .attr('value', d => d)
            .text(d => d)
            .on('click', function(d) {
              dispatch.dropdownSelected.apply(this, arguments);
            });

          var btn = dropdown.selectAll('.log-btn').data(d => [d]);
          btn.enter().append('button')
            .attr('class', 'btn btn-default log-btn')
            .text('log');
          btn
            .text(d => d.buttonLabel)
            .classed('active', d => d.buttonActive)
            .on('click', function() {
              dispatch.buttonPressed.apply(this, arguments);
            });

          var input = inputGroup.selectAll('input').data(d => [d]);
          input.enter().append('input')
            .attr('type', 'text')
            .attr('class', 'form-control pull-left');
          input
            .on('input', function(d) {
              dispatch.textChanged.apply(this, arguments);
            });
          input.filter(function(d) {
            return d3.select(this).property('value') !== d.textValue;
          }).property('value', d => d.textValue);

          var vars = self.selectAll('.variables').data(d => [d.inputs]);
          vars.enter().append('div')
            .attr('class', 'variables form-horizontal');

          var groups = vars.selectAll('.form-group').data(d => d);
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
            .attr('placeholder', d => d.placeholder)
            .attr('name', d => d.name);
          inputs.exit().remove();
          inputs
            .property('value', d => d.value)
            .on('input', function(d) {
              dispatch.inputChanged.apply(this, arguments);
            });
        };

        redraw();
      });
    }

    my = d3.rebind(my, dispatch, 'on');

    return my;
  };

  return my;

})(typeof plotfit==="undefined" ? {} : plotfit, Plotly.d3);

plotfit = (function(my, d3) {
  my.scaleVC = function scaleVC() {
    var scale = plotfit.scale(),
        sidebarInput = plotfit.sidebarInput();

    function my(selection) {
      selection.each(function(data) {
        var self = d3.select(this);

        function redraw() {

          var newData = {
            dropdownLabel: data.dropdownLabel,
            options: data.options,
            buttonActive: scale.logOrLinear() === 'log',
            buttonLabel: 'log',
            textValue: scale.expr(),
            inputs: d3.entries(scale.scope()).map(d => {
              return {
                name: d.key,
                prettyName: d.key,
                value: d.value === 0 ? '' : d.value,
                placeholder: '0',
              };
            }),
          };

          var wrapper = self.selectAll(".wrapper").data([newData]);
          wrapper.enter().append('div')
            .attr('class', 'wrapper');
          wrapper
            .call(sidebarInput);

          sidebarInput
            .on('dropdownSelected', function(d) {
              scale.expr(d);

            }).on('buttonPressed', function(d) {
              var old = scale.logOrLinear();
              scale.logOrLinear(old === 'log' ? 'linear' : 'log');

            }).on('inputChanged', function(d) {
              var scope = scale.scope();
              scope[d.name] = +this.value;
              scale.scope(scope);

            }).on('textChanged', function(d) {
              scale.expr(d3.select(this).property('value'));

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
  my.fitting = function fitting(dispatch) {
    dispatch = dispatch || d3.dispatch.apply(null, [
      'parameters', 'scope', 'expr', 'change', 'active', 'data', 'domain',
    ]);

    var expression = plotfit.expression(dispatch)
          .defaultValue(1)
          .parameters(['X']),
        active = false,
        data = null,
        domain = [0, Infinity];

    function refit() {
      if (data === null || !active) {
        return;
      }

      var start = domain[0],
          end = domain[1],
          currentData = data.filter((d, i) => start <= i && i < end),
          expressionCopy = expression.copy(),
          startingScope = expressionCopy.scope(),
          paramNames = d3.keys(startingScope),
          startingValues = paramNames.map(d => startingScope[d]),
          results = null,
          newScope = null;

      currentData = currentData.filter(d => isFinite(d[0]) && isFinite(d[1]));

      function evaluate(x, params) {
        var scope = {};
        for (var i=0; i<params.length; ++i) {
          scope[paramNames[i]] = params[i];
        }
        expressionCopy.scope(scope);

        return expressionCopy.call(null, x);
      };


      results = cobyla.nlFit(currentData, evaluate, startingValues, undefined, undefined, undefined, { maxFun: 100 });

      newScope = {};
      d3.zip(paramNames, results.params).forEach(function(d) {
        newScope[d[0]] = d[1];
      });
      expression.scope(newScope);
    };

    function my(x) {
      return expression.call(null, x);
    }

    my.active = function(_) {
      if (!arguments.length) return active;
      active = _;
      dispatch.active.call(null, my);
      dispatch.change.call(null, my);
      return my;
    };

    my.data = function(_) {
      if (!arguments.length) return data;
      data = _;
      dispatch.data.call(null, my);
      dispatch.change.call(null, my);
      return my;
    };

    my.domain = function(_) {
      if (!arguments.length) return domain;
      domain = _;
      dispatch.domain.call(null, my);
      dispatch.change.call(null, my);
      return my;
    };

    my.recalculate = function() {
      refit();
      return my;
    };

    my = d3.rebind(my, dispatch, 'on');
    my = d3.rebind(my, expression, 'scope', 'expr');

    return my;
  };

  return my;

})(typeof plotfit==="undefined" ? {} : plotfit, Plotly.d3);

plotfit = (function(my, d3) {
  my.fittingVC = function fittingVC() {
    var fitting = plotfit.fitting(),
        sidebarInput = plotfit.sidebarInput();

    function my(selection) {
      selection.each(function(data) {
        var self = d3.select(this);

        function redraw() {
          var newData = {
            dropdownLabel: 'Y \u2248 ',
            options: data.options,
            buttonActive: fitting.active(),
            buttonLabel: 'fit',
            textValue: fitting.expr(),
            inputs: d3.entries(fitting.scope()).map(d => {
              return {
                name: d.key,
                prettyName: d.key,
                value: d.value === 0 ? '' : d.value,
                placeholder: '0',
              };
            }),
          };

          var wrapper = self.selectAll(".wrapper").data([newData]);
          wrapper.enter().append('div')
            .attr('class', 'wrapper');
          wrapper
            .call(sidebarInput);

          sidebarInput
            .on('dropdownSelected.fittingVC', function(d) {
              fitting.expr(d);

            }).on('buttonPressed.fittingVC', function(d) {
              fitting.active(!fitting.active());

            }).on('inputChanged.fittingVC', function(d) {
              var scope = fitting.scope();
              scope[d.name] = +this.value;
              fitting.scope(scope);

            }).on('textChanged.fittingVC', function(d) {
              fitting.expr(d3.select(this).property('value'));

            });
        }

        redraw();

        fitting.on('change.fittingVC', function() {
          redraw();
        });

      });
    }

    my.fitting = function(_) {
      if (!arguments.length) return fitting;
      fitting.on('change.fittingVC', null);
      fitting = _;
      return my;
    };

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
        fittedLegendName = "Fit",
        fitting = null,
        fitDomain = [0, Infinity];

    function my(selection) {
      selection.each(function(fullData) {
        var fullX = fullData.map(x),
            fullY = fullData.map(y),
            fullDev = fullData.map(dev),
            tangled = d3.zip(fullX, fullY),
            plottedX = tangled.map(d => xScale.apply(xScale, d)),
            plottedY = tangled.map(d => yScale.apply(yScale, d)),
            plottedTangled = d3.zip(plottedX, plottedY),
            fittedY = null,
            fittedX = null,
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

        if (fitting !== null && fitting.active()) {
          var fittedDomain = fitting.domain(),
              start = fittedDomain[0],
              end = fittedDomain[1],
              tangledFit = plottedTangled.filter((d, i) => start <= i && i < end);
          fittedY = tangledFit.map(function(d) {
            return fitting(d[0]);
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
            } else if (fitting.active()) {
              node.data[1].x = trace.x;
              node.data[1].y = trace.y;
              node.data[1].name = trace.name;
            } else {
              console.warn("What?");
            }
          } else if (hasPlottedTrace) {
            fittedY = null;
            hasPlottedTrace = false;
            Plotly.deleteTraces(node, [1]);
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

    my.fitting = function(_) {
      if (!arguments.length) return fitting;
      fitting = _;
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

    my.fitDomain = function(_) {
      if (!arguments.length) return fitDomain;
      fitDomain = _;
      return my;
    };

    return my;
  };

  return my;

})(typeof plotfit==="undefined" ? {} : plotfit, Plotly, Plotly.d3);

plotfit = (function(my, d3) {
  var configurations = d3.map(),
      keys = [];

  function addConfiguration(key, value) {
    configurations.set(key, value);
    keys.push(key);
  }

  addConfiguration('Reset', {
    yScale: { expr: 'I' },
    xScale: { expr: 'Q' },
    fitting: { expr: '' },
  });

  addConfiguration('Guinier', {
    yScale: { expr: 'log(I)' },
    xScale: { expr: 'log(Q)' },
    fitting: { expr: '-Rg^2/3*X+b' },
  });

  addConfiguration('Porod', {
    yScale: { expr: 'log(I)' },
    xScale: { expr: 'log(Q)' },
    fitting: { expr: 'A-n*X' },
  });

  addConfiguration('Zimm', {
    yScale: { expr: '1/I' },
    xScale: { expr: 'Q^2' },
    fitting: { expr: '1/I0+Cl^2/I0*X' },
  });

  addConfiguration('Kratky', {
    yScale: { expr: 'log(Q^2*I)' },
    xScale: { expr: 'log(Q)' },
    fitting: { expr: 'm*X+b' },
  });

  addConfiguration('Debye Beuche', {
    yScale: { expr: 'sqrt(I)' },
    xScale: { expr: 'Q^2' },
    fitting: { expr: '' },
  });

  my.configuration = function configuration() {
    var xScale = null,
        yScale = null,
        fitting = null;

    function my(name) {
      var config = configurations.get(name);

      yScale.expr(config.yScale.expr);
      xScale.expr(config.xScale.expr);
      fitting
        .active(true)
        .expr(config.fitting.expr)
        .recalculate();
    }

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

    my.fitting = function(_) {
      if (!arguments.length) return fitting;
      fitting = _;
      return my;
    };

    my.names = function(_) {
      if (!arguments.length) return keys;
      console.error('configuration.names is not a setter');
      return my;
    };

    return my;
  };

  return my;

})(typeof plotfit==="undefined" ? {} : plotfit, Plotly.d3);

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
          fitting = plotfit.fitting().expr('m*X+b')
            .data(fullData.map(d => [xScale(d.Q, d.I), yScale(d.Q, d.I)])),
          fittingVC = plotfit.fittingVC().fitting(fitting),
          chart = plotfit.chart()
            .x(d => d.Q)
            .y(d => d.I)
            .dev(d => d.dev)
            .heightPercent(80)
            .colors((d, i) => {
              var domain = fitting.domain();
              return domain[0] <= i && i < domain[1] ? 'blue' : 'steelblue';
            }).xScale(xScale)
            .yScale(yScale)
            .fitting(fitting),
          configuration = plotfit.configuration()
            .xScale(xScale)
            .yScale(yScale)
            .fitting(fitting);

      window.__fullData = fullData;

      d3.select("#x-axis-settings").datum({
        options: ['Q', 'log10(Q)', 'log(Q)', 'Q^2', 'Q^a'],
        dropdownLabel: 'X = ',
      }).call(xScaleVC);

      d3.select("#y-axis-settings").datum({
        options: ['I', 'log10(I)', 'log(I)', '1/I', 'I^a', 'I*Q^a', 'I^a*Q^b',
                  '1/sqrt(I)', 'log(I*Q)', 'log(I*Q^2)', 'log(I*Q+B)', ],
        dropdownLabel: 'Y = ',
      }).call(yScaleVC);

      d3.select("#fitting-settings").datum({
        options: ['m*X+b', 'a*X^2+b*X+c'],
      }).call(fittingVC);

      xScale.on('change.main', function() {
        redraw();
        fitting.data(fullData.map(d => [xScale(d.Q, d.I), yScale(d.Q, d.I)]));
      });

      yScale.on('change.main', function() {
        redraw();
        fitting.data(fullData.map(d => [xScale(d.Q, d.I), yScale(d.Q, d.I)]));
      });

      fitting.on('change.main', function() {
        redraw();
      });

      d3.select("#foo").selectAll(".configuration")
        .data(configuration.names())
        .enter().append('div')
        .attr('class', 'configuration btn-group-vertical')
        .append('div')
        .attr('class', 'btn-group')
        .append('div')
        .attr('class', 'btn-group btn-group-justified')
        .append('div')
        .attr('class', 'btn-group')
        .append('button')
        .attr('type', 'button')
        .attr('class', 'btn btn-default')
        .text(d => d)
        .on('click', d => configuration(d));

      redraw();

      window.addEventListener('resize', function() {
        Plotly.Plots.resize(plotContainer.node());
      });

      d3.selectAll(".menu-toggle").on('click', function() {
        var wrapper = d3.select("#wrapper"),
            className = d3.select(this).attr('data-toggle-class');
        wrapper.classed(className, !wrapper.classed(className));
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
        fitting
          .domain([ev.value[0], ev.value[1]]);
      }).on("slideStop", function(ev) {
        fitting
          .domain([ev.value[0], ev.value[1]])
          .recalculate();
      });

      function redraw() {
        plotContainer.data([fullData])
          .call(chart);
      }
    });
})();
