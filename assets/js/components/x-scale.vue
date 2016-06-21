<style>

</style>

<template>
  <div>
    <sidebar-input
       dropdown-label="X = "
       :dropdown-options="['Q', 'log(Q)', 'Q^2']"
       button-label="log"
       :input-text="inputText"
       @input-text="updateInputText"
       :button-state="buttonActive"
       @button-state="updateButtonState"
       >
    </sidebar-input>

  </div>
</template>

<script>

  import sidebarInput from './sidebar-input.vue';

  import { xScaleExpr, xScaleLogOrLinear } from '../vuex/getters';
  import { xScaleSetExpr, xScaleSetLogOrLinear } from '../vuex/actions';

  export default {
      data: function() {
          return {
          };
      },
      vuex: {
          getters: {
              expr: xScaleExpr,
              logOrLinear: xScaleLogOrLinear,
          },
          actions: {
              updateExpr: xScaleSetExpr,
              updateLogOrLinear: xScaleSetLogOrLinear,
          },
      },
      computed: {
          inputText: {
              get() {
                  return this.expr;
              },
              set(val) {
                  this.updateExpr(val);
              },
          },
          buttonActive: {
              get() {
                  return this.logOrLinear === 'log';
              },
              set(val) {
                  this.updateLogOrLinear(val ? 'log' : 'linear');
              },
          },
      },
      methods: {
          updateInputText(val) {
              this.inputText = val;
          },
          updateButtonState(val) {
              this.buttonActive = val;
          },
      },
      components: {
          sidebarInput,
      },
  }

</script>
