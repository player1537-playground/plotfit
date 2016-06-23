import Vue from 'vue';
import PlotfitApp from './components/PlotfitApp.vue';

Vue.config.devtools = true;
Vue.config.debug = true;

new Vue({
  el: "body",
  components: {
    PlotfitApp,
  },
});
