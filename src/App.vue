<template lang="html">
  <b-container id="app" fluid>
    <a-header />
    <router-view></router-view>
  </b-container>
</template>

<script>

import aHeader from './components/header/header.vue'

export default {
  name: 'app',
  components: {
    aHeader
  }
}
</script>

<style lang="scss">
@import './assets/styles/theme.scss';

* {
  font-family: 'Gill Sans MT';
}

body, #app {
  background-color: $background;
  height: 100%;
}

button {
  border: none;
  border-radius: 2px;
  width: 94px;
  height: 36px;
  font-size: 16px;
}
</style>
