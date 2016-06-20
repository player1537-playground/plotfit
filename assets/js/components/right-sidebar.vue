<style>

#wrapper {
    padding-right: 0;
}
#wrapper.toggled-right {
    padding-right: 250px;
}

#sidebar-right-wrapper {
    z-index: 1002;
    position: fixed;
    right: 250px;
    width: 0;
    height: 100%;
    margin-right: -250px;
    overflow-y: auto;
    border-left: none;
    background-color: white;
}

#wrapper.toggled-right #sidebar-right-wrapper {
    width: 250px;
    border-left: solid;
}

#wrapper.toggled-right #page-content-wrapper {
    position: absolute;
    margin-right: -250px;
}

@media(min-width:768px) {
    #wrapper {
        padding-right: 250px
    }

    #wrapper.toggled-right {
        padding-right: 0;
    }

    #sidebar-right-wrapper {
        width: 500px;
        border-left: solid;
    }

    #wrapper.toggled-right #sidebar-right-wrapper {
        width: 0;
        border-left: none;
    }

    #wrapper.toggled-right #page-content-wrapper {
        margin-right: 0;
    }
}
</style>

<template>
  <div id="sidebar-right-wrapper">
    <h3>Right Sidebar</h3>
  </div>
</template>

<script>

  import { getCount } from '../vuex/getters';

  export default {
  }

</script>
