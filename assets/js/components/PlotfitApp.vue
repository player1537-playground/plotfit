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

  import LeftSidebar from './LeftSidebar.vue';
  import MainPlot from './MainPlot.vue';
  import RightSidebar from './RightSidebar.vue';
  import store from '../vuex/store';

  export default {
      store: store,
      components: {
          LeftSidebar,
          MainPlot,
          RightSidebar,
      }
  }

</script>
