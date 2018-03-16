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
</style>
