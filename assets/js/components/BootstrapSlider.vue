<template>
  <div>
    <input style="width: 100%" type="text" v-el:slider></input>
  </div>
</template>

<script>

  export default {
      name: 'BootstrapSlider',
      props: {
          min: Number,
          max: Number,
          value: Array,
      },
      data() {
          return {
              slider: null,
          };
      },
      attached() {
          this.slider = new Slider(this.$els.slider, {
              min: this.min,
              max: this.max,
              value: this.value,
          });

          this.slider.on('slide', this.sliderSlideUpdate);
          this.slider.on('slideStop', this.sliderSlideStopUpdate);
      },
      watch: {
          min() {
              this.slider.setAttribute('min', this.min);
          },
          max() {
              this.slider.setAttribute('max', this.max);
          },
          value() {
              this.slider.setValue(this.value);
          },
      },
      methods: {
          sliderSlideUpdate(value) {
              this.emitEvent('input', value);
          },
          sliderSlideStopUpdate(value) {
              this.emitEvent('change', value);
          },
          emitEvent(eventName, value) {
              this.$emit(eventName, { target: { value } });
          },
      },
  };
</script>
