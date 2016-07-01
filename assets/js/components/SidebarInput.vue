<style>

</style>

<template>
  <div class="input-group">
    <div class="input-group-btn">
      <button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown">
        <span>{{ dropdownLabel }}</span>
        <span class="caret"></span>
      </button>
      <ul class="dropdown-menu">
        <li v-for="option in dropdownOptions">
          <a href="#!" :data-value="option" @click="updateText">{{ option }}</a>
        <li>
      </ul>
      <label class="btn btn-default">
        <input type="checkbox" @change.stop.prevent="updateButton"
               v-model="value.button">
        <span>{{ buttonLabel }}<span>
      </label>
    </div>
    <input type="text" class="form-control pull-left" v-model="value.text"
           @input.stop.prevent="updateText" />
  </div>
</template>

<script>

  export default {
      name: 'SidebarInput',
      props: {
          dropdownLabel: String,
          dropdownOptions: Array,
          buttonLabel: String,
          value: Object,
      },
      methods: {
          updateText(e) {
              this.emitEvent('input', {
                  text: e.target.value || e.target.dataset.value,
                  button: this.value.button,
              });
          },
          updateButton(e) {
              this.emitEvent('input', {
                  text: this.value.text,
                  button: e.target.checked,
              });
          },
          emitEvent(eventName, value) {
              this.$emit(eventName, { target: { value } });
          },
      },
  }

</script>
