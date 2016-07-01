<style>

</style>

<template>
  <div>
    <sidebar-input
       :dropdown-label="'Fit'"
       :dropdown-options="['m*X+b']"
       :button-label="'Fit'"
       :value="{ text: fitting.expr, button: fitting.isFitting }"
       @input="sidebarInputUpdate"
       ></sidebar-input>

    <div class="form-horizontal" v-show="fitting.scope.length">
      <parameter-control
         v-for="variable in fitting.scope"
         track-by="$index"
         :value="{ name: variable.key, index: $index, text: variable.value }"
         @input="parameterControlUpdate"
         ></parameter-control>
    </div>
  </div>
</template>

<script>

  import SidebarInput from './SidebarInput.vue';
  import ParameterControl from './ParameterControl.vue';

  import { getFitting } from '../vuex/getters';
  import { setFitting } from '../vuex/actions';

  export default {
      name: 'FittingControl',
      vuex: {
          getters: {
              fitting: getFitting,
          },
          actions: {
              setFitting,
          },
      },
      methods: {
          sidebarInputUpdate(e) {
              this.emitSetFitting({
                  expr: e.target.value.text,
                  isFitting: e.target.value.button,
                  scope: [],
              });
          },
          parameterControlUpdate(e) {
              if (!isFinite(e.target.value.text)) {
                  return;
              }

              this.emitSetFitting({
                  expr: this.fitting.expr,
                  isFitting: this.fitting.isFitting,
                  scope: [{
                      key: e.target.value.name,
                      value: Number.parseFloat(e.target.value.text || 0),
                  }],
              });
          },
          emitSetFitting(value) {
              this.setFitting({ target: { value } });
          },
      },
      components: {
          SidebarInput,
          ParameterControl,
      },
  }

</script>
