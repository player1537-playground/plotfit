<style>

</style>

<template>
  <div>
    <sidebar-input
       :dropdown-label="dropdownLabel"
       :dropdown-options="dropdownOptions"
       :button-label="'log'"
       :value="{ text: value.expr, button: value.isLog }"
       @input="sidebarInputUpdate"
       ></sidebar-input>

    <div class="form-horizontal" v-show="value.scope.length">
      <parameter-control
         v-for="variable in value.scope"
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

  export default {
      name: 'BaseScale',
      props: {
          dropdownLabel: String,
          dropdownOptions: Array,
          value: Object,
      },
      methods: {
          sidebarInputUpdate(e) {
              var newIsLog = e.target.value.button
                  ? !this.value.isLog
                  : this.value.isLog;

              this.emitEvent('input', {
                  expr: e.target.value.text,
                  isLog: newIsLog,
                  scope: [],
              });
          },
          parameterControlUpdate(e) {
              if (!isFinite(e.target.value.text)) {
                  return;
              }

              this.emitEvent('input', {
                  expr: this.value.expr,
                  isLog: this.value.isLog,
                  scope: [{
                      key: e.target.value.name,
                      value: Number.parseFloat(e.target.value.text || 0),
                  }],
              });
          },
          emitEvent(eventName, value) {
              this.$emit(eventName, { target: { value } });
          },
      },
      components: {
          SidebarInput,
          ParameterControl,
      },
  }

</script>
