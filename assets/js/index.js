import Vue from 'vue';
import PlotfitApp from './components/PlotfitApp.vue';

Vue.config.devtools = true;

new Vue({
  el: "body",
  components: {
    PlotfitApp,
  },
});
