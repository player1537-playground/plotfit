<style>

</style>

<template>
  <div>
    <sidebar-input
       :dropdown-label="dropdownLabel"
       :dropdown-options="dropdownOptions"
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

  import { getXScaleExpr,
           getXScaleIsLog,
           getXScaleScope } from '../vuex/getters';
  import { setXScaleExpr,
           setXScaleIsLog,
           setXScaleScope } from '../vuex/actions';

  import scale from '../scale.js';

  export default {
      props: {
          dropdownLabel: String,
          dropdownOptions: Array,
          scope: Array,
          expr: String,
          isLog: Boolean,
      },
      data: function() {
          return {
          };
      },
      components: {
          SidebarInput,
      },
      methods: {
          setExpr(_) { this.$dispatch('expr', _); },
          setIsLog(_) { this.$dispatch('is-log', _); },
          setScope(_) { this.$dispatch('scope', _); },
      },
  }

</script>
