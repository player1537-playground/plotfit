<style>

</style>

<template>
  <div>
    <base-scale
       :dropdown-label="'X = '"
       :dropdown-options="['Q', 'log(Q)', 'Q^2']"
       :value="{ expr: xScale.expr, isLog: xScale.isLog, scope: xScale.scope }"
       @input="updateXScale"
       >
    </base-scale>

  </div>
</template>

<script>

  import BaseScale from './BaseScale.vue';

  import { getXScale } from '../vuex/getters';
  import { setXScale } from '../vuex/actions';

  export default {
      name: 'XScale',
      vuex: {
          getters: {
              xScale: getXScale,
          },
          actions: {
              setXScale,
          },
      },
      methods: {
          updateXScale(e) {
              this.setXScale(e);
          },
      },
      components: {
          BaseScale,
      },
  }

</script>
