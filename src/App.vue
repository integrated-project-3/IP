<template>
  <b-container id="app" fluid>
    <Header />
    <router-view></router-view>
  </b-container>
</template>

<script>

import Header from './components/Header.vue'

export default {
  name: 'app',
  components: {
    Header
  }
}
</script>

<style lang="scss">
@import './assets/styles/theme.scss';

* {
  font-family: 'Gill Sans MT';
}

body {
  background-color: $background;
}
</style>
