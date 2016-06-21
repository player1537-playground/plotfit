<style>

</style>

<template>
  <div>
    <sidebar-input
       dropdown-label="X = "
       :dropdown-options="['Q', 'log(Q)', 'Q^2']"
       button-label="log"
       :input-text="expr"
       :update-input-text="updateExpr"
       :button-state="isLog"
       :update-button-state="updateIsLog"
       >
    </sidebar-input>

  </div>
</template>

<script>

  import SidebarInput from './SidebarInput.vue';

  import { xScaleExpr, xScaleIsLog } from '../vuex/getters';
  import { xScaleSetExpr, xScaleSetIsLog } from '../vuex/actions';

  export default {
      data: function() {
          return {
          };
      },
      vuex: {
          getters: {
              expr: xScaleExpr,
              isLog: xScaleIsLog,
          },
          actions: {
              updateExpr: xScaleSetExpr,
              updateIsLog: xScaleSetIsLog,
          },
      },
      components: {
          SidebarInput,
      },
  }

</script>
