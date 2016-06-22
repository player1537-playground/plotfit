<style>

</style>

<template>
  <div class="form-group"
       style="margin-bottom:0px">
    <label class="col-xs-6 control-label text-right">
      {{ key }}
    </label>
    <div class="col-xs-6">
      <input type="text"
             class="form-control"
             placeholder="0"
             :name="key"
             v-model="valueInternal"
             number
             debounce="500"></input>
    </div>
  </div>
</template>

<script>

  export default {
      props: {
          key: String,
          value: Number,
          index: Number,
      },
      data() {
          return {
          };
      },
      computed: {
          valueInternal: {
              get() { return this.value; },
              set(_) {
                  this.$dispatch('value', {
                      key: this.key,
                      index: this.index,
                      value: _,
                  });
              },
          },
      },
  }

</script>
