<template lang="html">
  <b-row class="header" id="header" align-v="start" @click="headerClicked">
    <b-col md="6" class="logo">
      <router-link to="/">
        <img src="../../assets/images/logo.png" alt="Aileron Airways" />
      </router-link>
    </b-col>
    <b-col md="6" align-self="center" class="search">
      <input type="text" v-model="searchValue" placeholder="Search..." @keyup.enter="search" id="header-search-box"/>
      <i @click="searchValue = ''" class="material-icons header-icon" v-if="searchValue.length > 0" id="header-clear-icon">clear</i>
      <i @click="search" class="material-icons header-icon" id="header-search-icon">search</i>
    </b-col>
  </b-row>
</template>

<script>
export default {
  name: 'aHeader',
  data: function() {
    return {
      searchValue: ''
    }
  },
  methods: {
    headerClicked() {
      // stops selected timelines from being cleared on register
      event.stopPropagation()
    },
    search: function() {
      console.log(this.searchValue)
    }
  }
}
</script>


<style lang="scss">
@import '../../assets/styles/theme.scss';

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
    width: 100%;
    #header-search-box {
      background-color: $search-bg;
      border-radius: 2px;
      border-width: 0;
      width: 93%;
      font-size: 2em;
      padding-left: 15px;
      &:focus {outline: none;}
    }
    .header-icon {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      &#header-clear-icon {right: 10%;}
      &#header-search-icon {font-size: 2.2em;}
    }
  }
}
</style>
