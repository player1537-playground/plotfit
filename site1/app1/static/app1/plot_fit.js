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
        }

        my.c = function(_) {
            if (!arguments.length) return c;
            c = _;
            return my;
        }

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
        }

        my.a = function(_) {
            if (!arguments.length) return a;
            a = _;
            return my;
        }

        my.b = function(_) {
            if (!arguments.length) return b;
            b = _;
            return my;
        }

        my.scaleName(scaleName);

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
        }

        my.fittingName(my.fittingName());

        return my;
    };

    return my;

})(typeof plotfit==="undefined" ? {} : plotfit, Plotly.d3);

(function() {
    var d3 = Plotly.d3;

    Plotly.d3.csv(filename)
        .row(function(d) { return { Q: +d.Q, I: +d.I, dev: +d.dev }; })
        .get(function(error, fullData) {
            var WIDTH_PERCENT = 60,
                HEIGHT_PERCENT = 80,
                graphDivD3 = d3.select("#plot_container");

            window.__fullData = fullData;

            graphDivD3
                //.style("width", WIDTH_PERCENT + "%")
                //.style("margin-left", (100 - WIDTH_PERCENT) / 2 + '%')
                .style('height', HEIGHT_PERCENT + 'vh')
                //.style('margin-top', (100 - HEIGHT_PERCENT) / 2 + 'vh');

            var graphDiv = graphDivD3.node(),
                fullX = fullData.map(function(d) { return d.Q; }),
                fullY = fullData.map(function(d) { return d.I; }),
                fullDev = fullData.map(function(d) { return d.dev; }),
                xScale = plotfit.xScale(),
                yScale = plotfit.yScale(),
                fitting = plotfit.fitting().x(d => d.Q).y(d => d.I),
                plottedX,
                plottedY,
                plottedDev,
                plottedMinY;

            function recalculateData() {
                plottedX = fullData.map(d => xScale(d.Q, d.I));
                plottedY = fullData.map(d => yScale(d.I, d.Q));
                plottedDev = fullData.map(d => 0.0);
                plottedMinY = d3.min(plottedY);
            }

            recalculateData();

            var data = [{
                name: filename,
                x: plottedX,
                y: plottedY,
                mode: "lines+markers",
                error_y: {
                    type: 'data',
                    visible: true,
                    array: plottedDev,
                    thickness: 1.5,
                    width: 3,
                    opacity: 0.5,
                },
            }],
                layout = {
                    //                      height: 600,
                    //                      width: 600,
                    xaxis: {
                        autorange: true,
                        type: 'linear',
                    },
                    yaxis: {
                        autorange: true,
                        type: 'linear',
                    },
                    title: 'I_q chart',
                    showlegend: true,
                    legend: {
                        orientation: 'h',
                    },
                },
                trace = null;

            Plotly.plot(graphDiv, data, layout);

            function selectData(start, end) {
                if (trace !== null) {
                    Plotly.deleteTraces(graphDiv, -1);
                    trace = null;
                }

                var fitted = fitting(fullData, start, end),
                    newy = fullX.map(function(Q) {
                        return yScale(fitted(Q));
                    });

                fitted.params.map(function(d) {
                    console.log(d.prettyName, "=", d.value);
                });

                trace = { x: plottedX, y: newy, type: 'scatter' };

                Plotly.addTraces(graphDiv, trace);
            }

            $("#btn-xaxis-linear").on("click", function(eventData) {
                Plotly.relayout(graphDiv, { 'xaxis.type': 'linear' });
                $(".btn-xaxis").removeClass("active");
                $(this).addClass("active");
            });

            $("#btn-xaxis-log").on("click", function(eventData) {
                Plotly.relayout(graphDiv, { 'xaxis.type': 'log' });
                $(".btn-xaxis").removeClass("active");
                $(this).addClass("active");
            });

            $("#btn-yaxis-linear").on("click", function(eventData) {
                Plotly.relayout(graphDiv, { 'yaxis.type': 'linear' });
                $(".btn-yaxis").removeClass("active");
                $(this).addClass("active");
            });

            $("#btn-yaxis-log").on("click", function(eventData) {
                Plotly.relayout(graphDiv, { 'yaxis.type': 'log' });
                $(".btn-yaxis").removeClass("active");
                $(this).addClass("active");
            });

            function redraw() {
                recalculateData();
                if (trace !== null) {
                    Plotly.deleteTraces(graphDiv, -1);
                    trace = null;
                }

                graphDiv.data[0].x = plottedX;
                graphDiv.data[0].y = plottedY;

                Plotly.relayout(graphDiv, {
                    title: yScale.scaleName() + ' vs ' + xScale.scaleName(),
                });
                Plotly.redraw(graphDiv);
            }

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
                Plotly.Plots.resize(graphDiv);
            });

            $("#plot_range_slider").slider({
                range: true,
                min: 0,
                max: fullData.length - 1,
                values: [0, fullData.length - 1],
                slide: function(event, ui) {
                    console.log(ui.values[0], ui.values[1]);
                    selectData(ui.values[0], ui.values[1]);
                },
            });


        });
})();
