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

</style>

<template>
  <div id="page-content-wrapper">
    <h3>Main Plot</h3>
    <div id="main-plot"></div>
  </div>
</template>

<script>

  import { getXScale, getYScale, getDevScale, getData } from '../vuex/getters';
  import Plotly from 'plotly.js';

  export default {
      vuex: {
          getters: {
              xScale: getXScale,
              yScale: getYScale,
              devScale: getDevScale,
              data: getData,
          },
          actions: {

          },
      },
      computed: {
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
                  type: this.xScale.isLog() ? 'log' : 'linear',
                  title: 'X Label',
              },
              yaxis: {
                  autorange: true,
                  type: this.yScale.isLog() ? 'log' : 'linear',
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
      },
  }

</script>
