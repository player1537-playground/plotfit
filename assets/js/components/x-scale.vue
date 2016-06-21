<style>

</style>

<template>
  <div class="input-group">
    <div class="input-group-btn">
      <button type="button" class="btn btn-default dropdown-toggle"
              data-toggle="dropdown">
        {{ dropdownLabel }}<span class="caret"></span>
      </button>
      <ul class="dropdown-menu">
        <li v-for="option in standardValues">
          <a href="#!" value="option" @click="updateExpr(option)">{{ option }}</a>
        <li>
      </ul>
      <button type="button" class="btn btn-default"
              :class="{ 'active': buttonActive }" @click.prevent="buttonPressed">
        {{ buttonLabel }}
      </button>
    </div>
    <input type="text" class="form-control pull-left"
           v-model="inputText" debounce="500"/>
  </div>
</template>

<script>

  import { xScaleExpr } from '../vuex/getters';
  import { xScaleSetExpr } from '../vuex/actions';

  export default {
      data: function() {
          return {
              standardValues: [
                  'Q',
                  'log(Q)',
                  'Q^2',
              ],
              buttonLabel: 'log',
              dropdownLabel: 'X = ',
          };
      },
      vuex: {
          getters: {
              expr: xScaleExpr,
          },
          actions: {
              updateExpr: xScaleSetExpr,
          },
      },
      computed: {
          inputText: {
              get() {
                  return this.expr;
              },
              set(val) {
                  this.updateExpr(val);
              },
          },
      },
  }

</script>
