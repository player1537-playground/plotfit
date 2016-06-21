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
    <div class="container-fluid">
      <div class="row">
        <div class="col-xs-12">
          <div class="btn-group-vertical">
            <h3>Left Sidebar</h3>
            <x-scale></x-scale>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

  import XScale from './XScale.vue';

  export default {
      components: {
          XScale,
      },
  }

</script>
