<style>

</style>

<template>
  <div>
    <base-scale
       :dropdown-label="'Y = '"
       :dropdown-options="['I', 'log(I)', 'I^2']"
       :value="{ expr: yScale.expr, isLog: yScale.isLog, scope: yScale.scope }"
       @input="updateYScale"
       >
    </base-scale>

  </div>
</template>

<script>

  import BaseScale from './BaseScale.vue';

  import { getYScale } from '../vuex/getters';
  import { setYScale } from '../vuex/actions';

  export default {
      name: 'XScale',
      vuex: {
          getters: {
              yScale: getYScale,
          },
          actions: {
              setYScale,
          },
      },
      methods: {
          updateYScale(e) {
              this.setYScale(e);
          },
      },
      components: {
          BaseScale,
      },
  }

</script>
