<style>
#wrapper {
    padding-left: 0;
}
#wrapper.toggled-left {
    padding-left: 250px;
}
#sidebar-left-wrapper {
    z-index: 1000;
    position: fixed;
    left: 250px;
    width: 0;
    height: 100%;
    margin-left: -250px;
    overflow-y: auto;
    border-right: none;
}

#wrapper.toggled-left #sidebar-left-wrapper {
    width: 250px;
    border-right: solid;
}

#wrapper.toggled-left #page-content-wrapper {
    position: absolute;
    margin-right: -250px;
}

@media(min-width:768px) {
    #wrapper {
        padding-left: 250px;
    }

    #wrapper.toggled-left {
        padding-left: 0;
    }

    #sidebar-left-wrapper {
        width: 250px;
        border-right: solid;
    }

    #wrapper.toggled-left #sidebar-left-wrapper {
        width: 0;
        border-right: none;
    }

    #wrapper.toggled-left #page-content-wrapper {
        margin-right: 0;
    }
}

</style>

<template>
  <div id="sidebar-left-wrapper">
    <h3>Left Sidebar</h3>
  </div>
</template>

<script>

  import { getCount } from '../vuex/getters';

  export default {
  }

</script>
