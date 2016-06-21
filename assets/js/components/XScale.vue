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

    <p>{{ xScale ? xScale(2, 3) : "Syntax Error" }}</p>

  </div>
</template>

<script>

  import SidebarInput from './SidebarInput.vue';

  import { getXScaleExpr,
           getXScaleIsLog,
           getXScaleScope } from '../vuex/getters';
  import { setXScaleExpr,
           setXScaleIsLog,
           setXScaleScope } from '../vuex/actions';

  import expression from '../expression.js';

  export default {
      data: function() {
          return {
          };
      },
      vuex: {
          getters: {
              expr: getXScaleExpr,
              isLog: getXScaleIsLog,
              scope: getXScaleScope,
          },
          actions: {
              setExpr: setXScaleExpr,
              setIsLog: setXScaleIsLog,
              setScope: setXScaleScope,
          },
      },
      computed: {
          xScale() {
              try {
                  return expression(['Q', 'I'])
                      .scope(this.scope)
                      .expr(this.expr);
              } catch (SyntaxError) {
                  return null;
              }
          },
      },
      components: {
          SidebarInput,
      },
  }

</script>
