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

    <plotly-plot></plotly-plot>

    <div style="width: 100%">
      <bootstrap-slider
         :max="fittingData.length"
         :min="0"
         :value="fitting.domain"
         @input="bootstrapSliderUpdate"
         @change="bootstrapSliderUpdate"
         ></bootstrap-slider>
    </div>
  </div>
</template>

<script>

  import BootstrapSlider from './BootstrapSlider.vue';
  import PlotlyPlot from './PlotlyPlot.vue';

  import { getSidebarLeft, getSidebarRight, getFittingData,
           getFitting } from '../vuex/getters';
  import { setSidebarLeft, setSidebarRight, setFitting } from '../vuex/actions';
  import Plotly from 'plotly.js';

  export default {
      vuex: {
          getters: {
              fitting: getFitting,
              fittingData: getFittingData,
              sidebarLeft: getSidebarLeft,
              sidebarRight: getSidebarRight,
          },
          actions: {
              setSidebarLeft,
              setSidebarRight,
              setFitting,
          },
      },
      methods: {
          bootstrapSliderUpdate(e) {
              this.setFitting({ target: { value: {
                  expr: this.fitting.expr,
                  isFitting: this.fitting.isFitting,
                  scope: [],
                  domain: e.target.value,
              }}});
          },
      },
      components: {
          BootstrapSlider,
          PlotlyPlot,
      },
  }

</script>
