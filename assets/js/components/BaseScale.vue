<style>

</style>

<template>
  <div>
    <sidebar-input
       :dropdown-label="dropdownLabel"
       :dropdown-options="dropdownOptions"
       :button-label="'log'"
       :value="{ text: expr, button: isLog }"
       @input="sidebarInputUpdate"
       ></sidebar-input>

    <div class="form-horizontal" v-show="scope.length">
      <parameter-control
         v-for="variable in scope"
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
              this.emitEvent('input', {
                  expr: e.target.value.text,
                  isLog: e.target.value.button,
                  scope: [],
              });
          },
          parameterControlUpdate(e) {
              this.emitEvent('input', {
                  expr: this.value.expr,
                  isLog: this.value.isLog,
                  scope: [{
                      key: e.target.value.name,
                      value: +e.target.value.text,
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
