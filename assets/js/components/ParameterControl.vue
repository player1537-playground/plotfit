<style>

</style>

<template>
  <div class="form-group"
       style="margin-bottom:0px">
    <label class="col-xs-6 control-label text-right">
      {{ value.name }}
    </label>
    <div class="col-xs-6">
      <input type="text"
             class="form-control"
             placeholder="0"
             :name="value.name"
             :value="value.text === 0 ? '' : value.text"
             @input.stop.prevent="update"
             ></input>
    </div>
  </div>
</template>

<script>

  export default {
      name: 'ParameterControl',
      props: {
          value: Object,
      },
      methods: {
          update(e) {
              this.emitEvent('input', {
                  name: this.value.name,
                  index: this.value.index,
                  text: e.target.value,
              });
          },
          emitEvent(eventName, value) {
              this.$emit(eventName, { target: { value } });
          },
      },
  }

</script>
