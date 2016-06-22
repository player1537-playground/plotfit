<style>

</style>

<template>
  <div id="wrapper" :class="{ 'toggled-right': right, 'toggled-left': left }">
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

  import { getSidebarLeft, getSidebarRight } from '../vuex/getters';

  export default {
      store: store,
      vuex: {
          getters: {
              right: getSidebarRight,
              left: getSidebarLeft,
          },
      },
      components: {
          LeftSidebar,
          MainPlot,
          RightSidebar,
      }
  }

</script>
