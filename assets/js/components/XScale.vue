<style>

</style>

<template>
  <div>
    <sidebar-input
       dropdown-label="X = "
       :dropdown-options="['Q', 'log(Q)', 'Q^2']"
       button-label="log"
       :input-text="expr"
       @input-text="setExpr"
       :button-state="isLog"
       @button-state="setIsLog"
       >
    </sidebar-input>

  </div>
</template>

<script>

  import SidebarInput from './SidebarInput.vue';

  import { getXScaleExpr, getXScaleIsLog } from '../vuex/getters';
  import { setXScaleExpr, setXScaleIsLog } from '../vuex/actions';

  export default {
      data: function() {
          return {
          };
      },
      vuex: {
          getters: {
              expr: getXScaleExpr,
              isLog: getXScaleIsLog,
          },
          actions: {
              setExpr: setXScaleExpr,
              setIsLog: setXScaleIsLog,
          },
      },
      components: {
          SidebarInput,
      },
  }

</script>
