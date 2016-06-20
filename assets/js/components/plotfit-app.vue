<style>

</style>

<template>
  <div id="wrapper">
    <left-sidebar></left-sidebar>
    <main-plot></main-plot>
    <right-sidebar></right-sidebar>
  </div>
</template>

<script>

  import leftSidebar from './left-sidebar.vue';
  import mainPlot from './main-plot.vue';
  import rightSidebar from './right-sidebar.vue';
  import store from '../vuex/store';

  export default {
      store: store,
      components: {
          leftSidebar,
          mainPlot,
          rightSidebar,
      }
  }

</script>
