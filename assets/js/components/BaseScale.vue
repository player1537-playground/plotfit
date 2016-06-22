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
  </div>
</template>

<script>

  import SidebarInput from './SidebarInput.vue';
  import ParameterControl from './ParameterControl.vue';

  import scale from '../scale.js';

  export default {
      props: {
          dropdownLabel: String,
          dropdownOptions: Array,
          scope: Array,
          expr: String,
          isLog: Boolean,
      },
      data() {
          return {
          };
      },
      methods: {
          setExpr(_) { this.$dispatch('expr', _); },
          setIsLog(_) { this.$dispatch('is-log', _); },
          setScope(_) { this.$dispatch('scope', _); },
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
