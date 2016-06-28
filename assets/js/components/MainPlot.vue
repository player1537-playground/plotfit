<style>

#page-content-wrapper {
    width: 100%;
    position: relative;
    padding: 15px;
}

@media(min-width:768px) {
    #page-content-wrapper {
        padding: 20px;
    }
}

#main-plot {
    height: 80vh;
}

</style>

<template>
  <div id="page-content-wrapper">
    <a class="btn btn-default menu-toggle"
       data-toggle="tooltip" data-placement="right"
       title="Click to toggle the file list sidebar."
       @click="setSidebarLeft(!sidebarLeft)">
      <span class="glyphicon glyphicon-transfer" aria-hidden="true"></span>
    </a>

    <a class="btn btn-default menu-toggle pull-right"
       data-toggle="tooltip"
       data-placement="left" title="Click to toggle the file list sidebar."
       @click="setSidebarRight(!sidebarRight)">
      <span class="glyphicon glyphicon-transfer" aria-hidden="true"></span>
    </a>

    <h3>Main Plot</h3>
    <div id="main-plot"></div>
  </div>
</template>

<script>

  import { getXScaleAsScale, getYScaleAsScale, getDevScaleAsScale, getData,
           getSidebarLeft, getSidebarRight } from '../vuex/getters';
  import { setSidebarLeft, setSidebarRight } from '../vuex/actions';
  import Plotly from 'plotly.js';

  export default {
      vuex: {
          getters: {
              xScale: getXScaleAsScale,
              yScale: getYScaleAsScale,
              devScale: getDevScaleAsScale,
              data: getData,
              sidebarLeft: getSidebarLeft,
              sidebarRight: getSidebarRight,
          },
          actions: {
              setSidebarLeft: setSidebarLeft,
              setSidebarRight: setSidebarRight,
          },
      },
      computed: {
          xIsLog() {
              return this.xScale.isLog();
          },
          yIsLog() {
              return this.yScale.isLog();
          },
          xData() {
              console.log(this, this.xScale);
              return this.data.map(d => this.xScale.apply(null, d));
          },
          yData() {
              return this.data.map(d => this.yScale.apply(null, d));
          },
          devData() {
              return this.data.map(d => this.devScale.apply(null, d));
          },
          xAxisType() {
              return this.xIsLog ? 'log' : 'linear';
          },
          yAxisType() {
              return this.yIsLog ? 'log' : 'linear';
          },
      },
      attached() {
          var graphDiv = document.getElementById("main-plot");

          var data = {
              name: 'Data Name',
              x: this.xData,
              y: this.yData,
              mode: 'lines+markers',
              marker: {
                  color: 'steelblue',
              },
              error_y: {
                  type: 'data',
                  array: this.devData,
                  thickness: 1.5,
                  width: 3,
                  opacity: 0.5,
              },
          };

          var layout = {
              xaxis: {
                  autorange: true,
                  type: this.xAxisType,
                  title: 'X Label',
              },
              yaxis: {
                  autorange: true,
                  type: this.yAxisType,
                  title: 'Y Label',
              },
              title: 'Title',
              showlegend: true,
              legend: {
                  orientation: 'h',
              },
          };

          var options = {
              showLink: true,
          };

          Plotly.newPlot(graphDiv, [data], layout, options);

          this.$watch('sidebarLeft', function() {
              Plotly.Plots.resize(graphDiv);
          });

          this.$watch('sidebarRight', function() {
              Plotly.Plots.resize(graphDiv);
          });

          this.$watch('xData', function(_) {
              graphDiv.data[0].x = _;
              Plotly.redraw(graphDiv);
          });

          this.$watch('yData', function(_) {
              graphDiv.data[0].y = _;
              Plotly.redraw(graphDiv);
          });

          this.$watch('devData', function(_) {
              graphDiv.data[0].error_y.array = _;
              Plotly.redraw(graphDiv);
          });

          this.$watch('xAxisType', function(_) {
              Plotly.relayout(graphDiv, { 'xaxis.type': _ });
          });

          this.$watch('yAxisType', function(_) {
              Plotly.relayout(graphDiv, { 'yaxis.type': _ });
          });
      },
  }

</script>
