import Vue from 'vue';
import App from './components/App.vue';

Vue.config.devtools = true;

var app = new Vue({
  el: "body",
  components: {
    app: App,
  },
});
