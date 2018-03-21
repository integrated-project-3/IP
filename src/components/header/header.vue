<template lang="html">
  <b-row class="header" align-v="start">
    <b-col md="6">
      <!-- Adds a logo which when clicked goes to the register. -->
      <a-logo />
    </b-col>
    <b-col md="6" align-self="center">
      <!-- Adds a search box. Calls the search function when it emits a searched event. -->
      <a-search @searched="search"></a-search>
    </b-col>
  </b-row>
</template>


<script>
import aLogo from '../logo/logo.vue'
import aSearch from '../search/search.vue'

export default {
  name: 'aHeader',
  components: {
    aLogo,
    aSearch
  },
  data: function() {
    return {
      searchValue: ''
    }
  },
  methods: {
    /* Called when the user searches. */
    search: function(searchValue) {
      console.log(searchValue)
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
}

</style>
