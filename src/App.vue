<template>
  <b-container id="app" fluid>
    <Header />
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

body {
  background-color: $background;
}
</style>
