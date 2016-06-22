<style>

</style>

<template>
  <div id="wrapper" class="toggled-right">
    <left-sidebar></left-sidebar>
    <right-sidebar></right-sidebar>
    <main-plot></main-plot>
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
