<style>

</style>

<template>
  <div>
    <base-scale
       dropdown-label="Y = "
       :dropdown-options="['Q', 'log(Q)', 'Q^2']"
       :expr="expr"
       @expr="setExpr"
       :is-log="isLog"
       @is-log="setIsLog"
       :scope="scope"
       @scope="setScope"
       >
    </base-scale>

  </div>
</template>

<script>

  import BaseScale from './BaseScale.vue';

  import { getYScaleExpr,
           getYScaleIsLog,
           getYScaleScope } from '../vuex/getters';
  import { setYScaleExpr,
           setYScaleIsLog,
           setYScaleScope } from '../vuex/actions';

  import scale from '../expression.js';

  export default {
      data: function() {
          return {
          };
      },
      vuex: {
          getters: {
              expr: getYScaleExpr,
              isLog: getYScaleIsLog,
              scope: getYScaleScope,
          },
          actions: {
              setExpr: setYScaleExpr,
              setIsLog: setYScaleIsLog,
              setScope: setYScaleScope,
          },
      },
      computed: {
          yScale() {
              try {
                  return scale(['Q', 'I'])
                      .isLog(this.isLog)
                      .scope(this.scope)
                      .expr(this.expr);
              } catch (SyntaxError) {
                  return null;
              }
          },
      },
      components: {
          BaseScale,
      },
  }

</script>
