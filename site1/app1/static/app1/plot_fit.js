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

    my.textExpr = function() {
      if (arguments.length) {
        console.error('expr.textExpr is not a setter');
        return my;
      }

      var parsed = math.parse(expr).transform(function(node, path, parent) {
        if (node.isSymbolNode && !parameters.includes(node.name)) {
          return new math.expression.node.ConstantNode(scope[node.name]);
        } else {
          return node;
        }
      });

      return parsed.toString({ parenthesis: 'auto' });
    };

    my.serialize = function(_) {
      if (!arguments.length) {
        return {
          parameters: my.parameters(),
          scope: my.scope(),
          defaultValue: my.defaultValue(),
          expr: my.expr(),
        };
      }

      my
        .defaultValue(_.defaultValue)
        .parameters(_.parameters)
        .expr(_.expr)
        .scope(_.scope);

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

    my.serialize = function(_) {
      if (!arguments.length) {
        return {
          expression: expression.serialize(),
          logOrLinear: logOrLinear,
        };
      }

      expression.serialize(_.expression);
      my.logOrLinear(_.logOrLinear);

      return my;
    };

    my = d3.rebind(my, dispatch, 'on');
    my = d3.rebind(my, expression, 'scope', 'expr', 'textExpr');

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
          a.enter().append('a');
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
            return this !== document.activeElement;
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
            .on('input', function(d) {
              dispatch.inputChanged.apply(this, arguments);
            });
          inputs.filter(function(d) {
            return this !== document.activeElement;
          }).property('value', d => d.value);
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
              if (!isFinite(this.value)) {
                return;
              }

              var scope = scale.scope(),
                  value = +this.value;

              if (value === scope[d.name]) {
                return;
              }

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
      'recalculate',
    ]);

    var expression = plotfit.expression(dispatch)
          .defaultValue(1)
          .parameters(['X']),
        active = false,
        data = null,
        domain = [0, Infinity],
        worker = null;

    function refit() {
      if (data === null || !active) {
        return -1;
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

      results = cobyla.nlFit(currentData, evaluate, startingValues, undefined, undefined, undefined, { maxFun: 10000, rhoStart: 1000 });

      console.log(results);

      newScope = {};
      d3.zip(paramNames, results.params).forEach(function(d) {
        newScope[d[0]] = d[1];
      });
      expression.scope(newScope);

      return results.status;
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
      if (data.length < domain[1]) {
        domain = [domain[0], data.length];
        dispatch.domain.call(null, my);
      }
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
      if (worker !== null) {
        if (active) {
          var serialized = my.serialize();
          serialized.data = data;
          console.log("Sending to worker", serialized);
          my.active(false);
          worker.postMessage(serialized);
        }
      } else {
        var i = 0;
        do {
          var status = refit();
          refit();
          dispatch.recalculate.call(null, my);
          dispatch.change.call(null, my);
          i++;
        } while (i < 10 && status === cobyla.maxIterationsReached);
      }
      return my;
    };

    my.registerWebWorker = function() {
      function workerMain() {
        importScripts(
          'https://d3js.org/d3.v3.min.js',
          'http://cdnjs.cloudflare.com/ajax/libs/mathjs/3.2.1/math.min.js',
          'http://localhost:8000/static/app1/Cobyla.js',
          'http://localhost:8000/static/app1/CobylaLSFit.js'
        );

        var fitting = plotfit.fitting();

        self.addEventListener('message', function(e) {
          fitting.serialize(e.data).data(e.data.data).recalculate();
        });

        fitting.on('recalculate', function() {
          self.postMessage(fitting.serialize());
        });
      };

      var blob = new Blob([
        'plotfit = { expression: ',
        plotfit.expression.toString(),
        ', fitting: ',
        plotfit.fitting.toString(),
        '};',
        workerMain.toString(),
        'workerMain()',
      ]);

      var blobUrl = window.URL.createObjectURL(blob);

      worker = new Worker(blobUrl);

      console.log(blobUrl);

      worker.addEventListener('message', function(e) {
        console.log("Got response from worker", e.data);
        my.serialize(e.data);
        dispatch.recalculate.call(null, my);
      }, false);

      console.log(worker);

      return my;
    };

    my.serialize = function(_) {
      if (!arguments.length) {
        return {
          expression: expression.serialize(),
          active: active,
          domain: domain,
        };
      }

      expression.serialize(_.expression);
      my
        .domain(_.domain)
        .active(_.active);

      return my;
    };

    my = d3.rebind(my, dispatch, 'on');
    my = d3.rebind(my, expression, 'scope', 'expr', 'textExpr');

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
              fitting
                .expr(d)
                .recalculate();

            }).on('buttonPressed.fittingVC', function(d) {
              fitting
                .active(!fitting.active())
                .recalculate();

            }).on('inputChanged.fittingVC', function(d) {
              if (!isFinite(this.value)) {
                return;
              }

              var scope = fitting.scope(),
                  value = +this.value;

              if (value === scope[d.name]) {
                return;
              }

              scope[d.name] = value;
              fitting.scope(scope);

            }).on('textChanged.fittingVC', function(d) {
              fitting
                .expr(d3.select(this).property('value'))
                .recalculate();

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
    var node = null,
        data = null,
        qData = null,
        iData = null,
        devData = null,
        xScaled = null,
        yScaled = null,
        devScaled = null,
        xFit = null,
        yFit = null,
        q = (d => d.Q),
        i = (d => d.I),
        dev = (d => d.dev),
        xScale = plotfit.scale().expr('Q'),
        yScale = plotfit.scale().expr('I'),
        fitting = plotfit.fitting().expr('').active(false),
        title = "Graph",
        xLabel = "X Label",
        yLabel = "Y Label",
        dataName = "Data",
        traceName = "Fit";

    function bindTo() {
      var plotlyData = {
        name: dataName,
        x: xScaled,
        y: yScaled,
        mode: 'lines+markers',
        marker: {
          color: 'steelblue',
        },
        error_y: {
          type: 'data',
          array: devScaled,
          thickness: 1.5,
          width: 3,
          opacity: 0.5,
        },
      };

      var plotlyTrace = {
        name: traceName,
        x: xFit,
        y: yFit,
        mode: 'lines',
        visible: false,
      };

      var plotlyLayout = {
        xaxis: {
          autorange: true,
          type: 'linear',
          title: xLabel,
        },
        yaxis: {
          autorange: true,
          type: 'linear',
          title: yLabel,
        },
        title: title,
        showlegend: true,
        legend: {
          orientation: 'h',
        },
      };

      var plotlyOptions = {
        showLink: true,
      };

      Plotly.newPlot(node, [plotlyData, plotlyTrace], plotlyLayout, plotlyOptions);
      node.on('plotly_selected', function(eventData) {
        if (typeof eventData === 'undefined') {
          return;
        }

        fitting.domain(d3.extent(eventData.points, d => d.pointNumber));
      });
    }

    function my() {

    };

    my.data = function(_) {
      if (!arguments.length) return data;
      data = _;
      qData = data.map(q);
      iData = data.map(i);
      devData = data.map(dev);
      xScaled = d3.zip(qData, iData).map(d => xScale.apply(null, d));
      yScaled = d3.zip(qData, iData).map(d => yScale.apply(null, d));
      devScaled = d3.zip(qData, devData).map(d => yScale.apply(null, d));
      return my;
    };

    my.bindTo = function(_) {
      if (!arguments.length) return node;
      node = _;
      bindTo();
      return my;
    };

    my.xScale = function(_) {
      if (!arguments.length) return xScale;
      xScale.on('.chart', null);
      xScale = _;
      xScaled = d3.zip(qData, iData).map(d => xScale.apply(null, d));
      xScale.on('change.chart', function() {
        console.log('xScale.on change.chart', xScale.serialize());
        var domain = fitting.domain();
        xScaled = d3.zip(qData, iData).map(d => xScale.apply(null, d));
        xFit = xScaled.filter((d, i) => domain[0] <= i && i < domain[1]);
        yFit = xFit.map(fitting);
        node.data[0].x = xScaled;
        node.data[1].x = xFit;
        node.data[1].y = yFit;
        Plotly.redraw(node);
      });
      return my;
    };

    my.yScale = function(_) {
      if (!arguments.length) return yScale;
      yScale.on('.chart', null);
      yScale = _;
      yScaled = d3.zip(qData, iData).map(d => yScale.apply(null, d));
      devScaled = d3.zip(qData, devData).map(d => yScale.apply(null, d));
      yScale.on('change.chart', function() {
        console.log('yScale.on change.chart', yScale.serialize());
        yScaled = d3.zip(qData, iData).map(d => yScale.apply(null, d));
        devScaled = d3.zip(qData, iData, devData).map(d => {
          var yScaled = yScale.call(null, d[0], d[1]),
              above = Math.abs(yScaled - yScale.call(null, d[0], d[1] + d[2])),
              below = Math.abs(yScaled - yScale.call(null, d[0], d[1] - d[2]));

          return Math.min(above, below);
        });
        node.data[0].y = yScaled;
        node.data[0].error_y.array = devScaled;
        Plotly.redraw(node);
      });
      return my;
    };

    my.fitting = function(_) {
      if (!arguments.length) return fitting;
      fitting.on('.chart', null);
      fitting = _;
      var domain = fitting.domain();
      xFit = xScaled.filter((d, i) => domain[0] <= i && i < domain[1]);
      yFit = xFit.map(fitting);
      function redraw() {
        console.log('fitting.on recalculate.chart active.chart', fitting.serialize());
        var domain = fitting.domain();
        xFit = xScaled.filter((d, i) => domain[0] <= i && i < domain[1]);
        yFit = xFit.map(fitting);
        node.data[1].x = xFit;
        node.data[1].y = yFit;
        node.data[1].visible = fitting.active();
        Plotly.redraw(node);
      }
      fitting
        .on('recalculate.chart', redraw)
        .on('active.chart', redraw)
        .on('scope.chart', redraw)
        .on('domain.chart', function() {
          console.log('fitting.on domain.chart', fitting.serialize());
          var domain = fitting.domain();
          var colors = xScaled.map((d, i) => (domain[0] <= i && i < domain[1]) ? 'blue' : 'steelblue');
          Plotly.restyle(node, {
            'marker.color': [colors],
          }, [0]);
        });

      return my;
    };

    my.title = function(_) {
      if (!arguments.length) return title;
      title = _;
      if (node !== null) {
        Plotly.relayout(node, { title: title });
      }
      return my;
    };

    my.xLabel = function(_) {
      if (!arguments.length) return xLabel;
      xLabel = _;
      if (node !== null) {
        Plotly.relayout(node, { 'xaxis.title': xLabel });
      }
      return my;
    };

    my.yLabel = function(_) {
      if (!arguments.length) return yLabel;
      yLabel = _;
      if (node !== null) {
        Plotly.relayout(node, { 'yaxis.title': yLabel });
      }
      return my;
    };

    my.dataName = function(_) {
      if (!arguments.length) return dataName;
      dataName = _;
      if (node !== null) {
        Plotly.restyle(node, { name: dataName }, [0]);
      }
      return my;
    };

    my.traceName = function(_) {
      if (!arguments.length) return traceName;
      traceName = _;
      if (node !== null) {
        Plotly.restyle(node, { name: traceName }, [1]);
      }
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
    fitting: { expr: '', active: false },
  });

  addConfiguration('Guinier', {
    yScale: { expr: 'log(I)' },
    xScale: { expr: 'log(Q)' },
    fitting: { expr: '-Rg^2/3*X+b', active: true },
  });

  addConfiguration('Porod', {
    yScale: { expr: 'log(I)' },
    xScale: { expr: 'log(Q)' },
    fitting: { expr: 'A-n*X', active: true },
  });

  addConfiguration('Zimm', {
    yScale: { expr: '1/I' },
    xScale: { expr: 'Q^2' },
    fitting: { expr: '1/I0+Cl^2/I0*X', active: true },
  });


  addConfiguration('Kratky', {
    yScale: { expr: 'log(Q^2*I)' },
    xScale: { expr: 'log(Q)' },
    fitting: { expr: 'm*X+b', active: true },
  });

  addConfiguration('Debye Beuche', {
    yScale: { expr: 'sqrt(I)' },
    xScale: { expr: 'Q^2' },
    fitting: { expr: 'm*X+I0', active: true },
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
        .active(config.fitting.active)
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

    my.serialize = function(_) {
      if (!arguments.length) {
        return {
          xScale: xScale.serialize(),
          yScale: yScale.serialize(),
          fitting: fitting.serialize(),
        };
      }

      xScale.serialize(_.xScale);
      yScale.serialize(_.yScale);
      fitting.serialize(_.fitting);

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
      var plotContainer = d3.select("#plot_container")
            .style('height', '80vh'),
          xScale = plotfit.scale().expr('Q'),
          xScaleVC = plotfit.scaleVC().scale(xScale),
          yScale = plotfit.scale().expr('I'),
          yScaleVC = plotfit.scaleVC().scale(yScale),
          fitting = plotfit.fitting().expr('m*X+b')
            .data(fullData.map(d => [xScale(d.Q, d.I), yScale(d.Q, d.I)]))
            .registerWebWorker(),
          fittingVC = plotfit.fittingVC().fitting(fitting),
          chart = plotfit.chart()
            .data(fullData)
            .xScale(xScale)
            .yScale(yScale)
            .fitting(fitting)
            .bindTo(plotContainer.node());
          configuration = plotfit.configuration()
            .xScale(xScale)
            .yScale(yScale)
            .fitting(fitting);

      window.__fullData = fullData;
      window.__configuration = configuration;

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
        fitting.data(fullData.map(d => [xScale(d.Q, d.I), yScale(d.Q, d.I)]));
      }).on('scope.main expr.main', function() {
        var xLabel = xScale.textExpr(),
            yLabel = yScale.textExpr();

        chart
          .xLabel(xLabel)
          .title(yLabel + ' vs ' + xLabel);
      });

      yScale.on('change.main', function() {
        fitting.data(fullData.map(d => [xScale(d.Q, d.I), yScale(d.Q, d.I)]));
      }).on('scope.main expr.main', function() {
        var xLabel = xScale.textExpr(),
            yLabel = yScale.textExpr();

        chart
          .yLabel(yLabel)
          .title(yLabel + ' vs ' + xLabel);
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

      d3.select("#save-and-reload").selectAll("button")
        .on("click", function() {
          var action = d3.select(this).attr('data-action');
          if (action === 'save') {
            window.location.hash = btoa(JSON.stringify(configuration.serialize()));
          } else if (action === 'reload') {
            configuration.serialize(JSON.parse(atob(window.location.hash.substring(1))));
          } else if (action === 'clear') {
            window.location.hash = '';
          } else {
            console.error('Unexpected:', action);
          }
        });

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

      fitting.on('domain.main', function() {
        $("#plot_range").bootstrapSlider('setValue', fitting.domain());
      });

      (function() {
        var csvs = [fullData],
            plots = d3.selectAll(".bar").datum(d => csvs[0]),
            bbox = plots.node().getBoundingClientRect(),
            width = bbox.width - 2 * 10,
            height = bbox.height - 2 * 8,
            x = (d => d.Q),
            y = (d => d.I),
            xScale = d3.scale.linear().range([0, width]).domain([
              d3.min(csvs.map(d => d3.min(d, x))),
              d3.max(csvs.map(d => d3.max(d, x))),
            ]),
            yScale = d3.scale.linear().range([height, 0]).domain([
              d3.min(csvs.map(d => d3.min(d, y))),
              d3.max(csvs.map(d => d3.max(d, y))),
            ]),
            line = d3.svg.line().x(d => xScale(x(d))).y(d => yScale(y(d)));

        console.log(bbox);

        var svgs = plots.selectAll("svg").data(d => [d]);
        svgs.enter().append('svg')
          .attr('width', width)
          .attr('height', height);

        var paths = svgs.selectAll("path").data(d => [d]);
        paths.enter().append('path')
          .attr('stroke-width', 1)
          .attr('fill', 'none')
          .attr('stroke', 'black');
        paths
          .attr("d", function(d) {
            var xScale = d3.scale.linear()
                  .range([0, width])
                  .domain(d3.extent(d, x));

            var yScale = d3.scale.linear()
                  .range([height, 0])
                  .domain(d3.extent(d, y));

            var line = d3.svg.line()
                  .x(dd => xScale(x(dd)))
                  .y(dd => yScale(y(dd)));

              //console.log(xScale.domain(), yScale.domain(), d);

              return line(d);
          });

      })();

      configuration('Reset');
    });
})();
