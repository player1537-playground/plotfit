<style>

</style>

<template>
  <div class="form-group"
       style="margin-bottom:0px">
    <label class="col-xs-6 control-label text-right">
      {{ name }}
    </label>
    <div class="col-xs-6">
      <input type="text"
             class="form-control"
             placeholder="0"
             :name="name"
             :value="text"
             @input="update"
             number
             ></input>
    </div>
  </div>
</template>

<script>

  export default {
      props: {
          value: Object,
      },
      data() {
          return {
              index: this.value.index,
              name: this.value.name,
              text: this.value.text,
          };
      },
      methods: {
          update(e) {
              this.text = e.target.value;
              this.emitInputEvent();
          },
          emitInputEvent() {
              this.emitEvent('input', {
                  index: this.index,
                  name: this.name,
                  text: this.text,
              });
          },
          emitEvent(eventName, value) {
              this.$emit(eventName, { target: { value } });
          },
      },
  }

</script>
