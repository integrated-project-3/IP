<template lang="html">
  <div class="search">
    <span>
      <!--
        Displays a search icon which can trigger the search
      -->
      <i v-on:click="search" class="material-icons icon">search</i>
      <input type="text" v-model="searchValue" :placeholder="placeholder" @keyup.enter="search"/>
      <!--
        Display an arrow to expand the search
      -->
      <i class="material-icons arrow-down">arrow_drop_down</i>
    </span>
  </div>
</template>

<script>
export default {
  name: 'aSearch',
  data() {
    return {
      searchValue: ''
    }
  },
  props: {
    /*
      Set the placeholder for the search.
      Default: Search...
    */
    placeholder: {
      type: String,
      required: false,
      default: "Search..."
    }
  },
  methods: {
    /*
      Called when the user searches.
      Emits a searched function with the searchValue for a parent component to use.
    */
    search: function() {
      this.$emit("searched", this.searchValue)
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../../assets/styles/theme.scss';

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
</style>
