import Vue from 'vue';
import PlotfitApp from './components/PlotfitApp.vue';

Vue.config.devtools = true;
Vue.config.debug = true;

var old$on = Vue.prototype.$on;

Vue.prototype.$on = function(event, fn) {
  return old$on.call(this, event, function() {
    var array = [];
    array.push('$on');
    array.push(event);
    for (var i=0; i<arguments.length; ++i) {
      array.push(arguments[i]);
    }
    array.push(this);
    console.log.apply(console, array);
    return fn.apply(this, arguments);
  });
};

new Vue({
  el: "body",
  components: {
    PlotfitApp,
  },
});
