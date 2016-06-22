<style>

</style>

<template>
  <div>
    <base-scale
       dropdown-label="X = "
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

  import { getXScaleExpr,
           getXScaleIsLog,
           getXScaleScope } from '../vuex/getters';
  import { setXScaleExpr,
           setXScaleIsLog,
           setXScaleScope } from '../vuex/actions';

  import scale from '../expression.js';

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
      components: {
          BaseScale,
      },
  }

</script>
