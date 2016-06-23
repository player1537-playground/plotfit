<style>

</style>

<template>
  <div>
    <sidebar-input
       dropdown-label="Fit"
       :dropdown-options="['m*X+b']"
       :input-text="expr"
       @input-text="setExpr"
       :button-state="isFitting"
       @button-state="setIsFitting"
       ></sidebar-input>

    <div class="form-horizontal" v-show="scope.length">
      <parameter-control
         v-for="variable in scope"
         :key="variable.key"
         :index="$index"
         :value="variable.value"
         @value="updateScope"
         ></parameter-control>
    </div>
  </div>
</template>

<script>

  import SidebarInput from './SidebarInput.vue';
  import ParameterControl from './ParameterControl.vue';

  import { getFittingExpr,
           getFittingScope,
           getFittingIsFitting } from '../vuex/getters';
  import { setFittingExpr,
           setFittingIsFitting,
           setFittingScope } from '../vuex/actions';

  import fitter from '../fitter';

  export default {
      data: function() {
          return {
          };
      },
      vuex: {
          getters: {
              expr: getFittingExpr,
              isFitting: getFittingIsFitting,
              scope: getFittingScope,
          },
          actions: {
              setExpr: setFittingExpr,
              setIsFitting: setFittingIsFitting,
              setScope: setFittingScope,
          },
      },
      methods: {
          updateScope({ key, index, value }) {
              this.scope.$set(index, { key, value });
              this.setScope(this.scope);
          },
      },
      components: {
          SidebarInput,
          ParameterControl,
      },
  }

</script>
