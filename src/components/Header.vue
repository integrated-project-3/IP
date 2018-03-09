<template>
  <b-row class="header" align-v="start" align-h="start">
    <b-col class="logo" sm="5">
      <img src="../assets/logo.png" />
    </b-col>
    <b-col class="search" sm="7">
      <span>
        <i v-on:click="search" class="material-icons">search</i>
        <b-form-input v-model="searchValue" placeholder="Search..."></b-form-input>
      </span>
    </b-col>
  </b-row>
</template>


<script>
export default {
  name: 'Header',
  data: function() {
    return {
      searchValue: ''
    }
  },
  methods: {
    search: function() {
      alert(this.searchValue)
    }
  }
}
</script>


<style lang="scss">
@import '../assets/styles/theme.scss';

.header {
  background-color: $header-bg;
}

.header .logo {
  padding: 35px 0 15px 30px;
}

.header .search {

}
</style>
