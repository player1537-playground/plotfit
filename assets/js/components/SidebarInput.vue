<style>

</style>

<template>
  <div class="input-group">
    <div class="input-group-btn">
      <button type="button" class="btn btn-default dropdown-toggle"
              data-toggle="dropdown">
        {{ dropdownLabel }}<span class="caret"></span>
      </button>
      <ul class="dropdown-menu">
        <li v-for="option in dropdownOptions">
          <a href="#!" value="option" @click="inputTextInternal = option">{{ option }}</a>
        <li>
      </ul>
      <label class="btn btn-default">
        <input type="checkbox" v-model="buttonStateInternal">{{ buttonLabel }}
      </label>
    </div>
    <input type="text" class="form-control pull-left"
           v-model="inputTextInternal" debounce="500"/>
  </div>
</template>

<script>

  export default {
      props: {
          dropdownLabel: String,
          dropdownOptions: Array,
          buttonLabel: String,
          inputText: {
              type: String,
          },
          buttonState: {
              type: Boolean,
          },
      },
      data: function() {
          return {
          };
      },
      computed: {
          inputTextInternal: {
              get() { return this.inputText; },
              set(val) { this.$dispatch('input-text', val); },
          },
          buttonStateInternal: {
              get() { return this.buttonState; },
              set(val) { this.$dispatch('button-state', val); },
          },
      },
  }

</script>
