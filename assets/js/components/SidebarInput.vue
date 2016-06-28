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
          <a href="#!" value="option" @click.stop.prevent="updateText">{{ option }}</a>
        <li>
      </ul>
      <label class="btn btn-default">
        <input type="checkbox" @click.stop.prevent="updateButton" :value="button">
        <span>{{ buttonLabel }}<span>
      </label>
    </div>
    <input type="text" class="form-control pull-left" :value="text"
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
      data() {
          return {
              text: this.value.text,
              button: this.value.button,
          };
      },
      methods: {
          updateText(e) {
              this.text = e.target.value;
              this.emitInputEvent();
          },
          updateButton(e) {
              this.button = e.target.value;
              this.emitInputEvent();
          },
          emitInputEvent() {
              this.emitEvent('input', {
                  text: this.text,
                  button: this.button,
              });
          },
          emitEvent(eventName, value) {
              console.log(eventName, value);
              this.$emit(eventName, { target: { value } });
          },
      },
  }

</script>
