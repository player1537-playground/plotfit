import Vue from 'vue';
import plotfitApp from './components/plotfit-app.vue';

Vue.config.devtools = true;

new Vue({
  el: "body",
  components: {
    plotfitApp,
  },
});
