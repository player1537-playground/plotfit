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

    <!--
    <div class="form-horizontal" v-show="scope.length">
      <parameter-control
         v-for="variable in scope"
         track-by="$index"
         :key="variable.key"
         :index="$index"
         :value="variable.value"
         @value="updateScope"
         ></parameter-control>
      </div>
    -->
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
      data() {
          return {
              expr: this.value.expr,
              isLog: this.value.isLog,
              scope: this.value.scope,
          };
      },
      methods: {
          sidebarInputUpdate(e) {
              this.expr = e.target.value.text;
              this.isLog = e.target.value.button;
              this.emitInputEvent();
          },
          emitInputEvent() {
              this.emitEvent('input', {
                  expr: this.expr,
                  isLog: this.isLog,
                  scope: this.scope,
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
