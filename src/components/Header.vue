<template>
  <b-row class="header" align-v="start">
    <b-col class="logo" md="6">
      <router-link to="/">
        <img src="../assets/images/logo.png" alt="Aileron Airways" />
      </router-link>
    </b-col>
    <b-col class="search" align-self="center">
      <span>
        <i v-on:click="search" class="material-icons icon">search</i>
        <input type="text" v-model="searchValue" placeholder="Search..." />
        <i class="material-icons arrow-down">arrow_drop_down</i>
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
    }
  }
}
</script>


<style lang="scss">
@import '../assets/styles/theme.scss';

.header {
  background-color: $header-bg;
  color: $text;
  box-shadow: 0 3px 6px rgba(0,0,0,0.16);
  padding-bottom: 15px;
  .logo {
    padding: 35px 30px 15px 30px;
    img {
      max-width: 100%;
      height: auto;
    }
  }
  .search {
    i {
      cursor: pointer;
      position: absolute;
    }
    .icon {
      top: 50%;
      transform: translateY(-50%);
      font-size: 3em;
    }
    input {
      background-color: $search-bg;
      border-radius: 2px;
      border-width: 0;
      width: 100%;
      font-size: 3em;
      padding-left: 65px;
      &:focus {
        outline: none;
      }
    }
    .arrow-down {
      top: 50%;
      transform: translateY(-50%);
      font-size: 5em;
      right: 10px;
    }
  }
}

</style>
