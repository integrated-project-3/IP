<template lang="html">
  <div class="search">
    <span>
      <input type="text" v-model="searchValue" :placeholder="placeholder" @keyup.enter="search"/>
      <i v-if="searchValue.length > 0" @click="searchValue = ''" class="material-icons icon clear-icon">clear</i>
      <i @click="search" class="material-icons icon search-icon">search</i>
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
    placeholder: {
      type: String,
      required: false,
      default: "Search..."
    }
  },
  methods: {
    search: function() {
      this.$emit("searched", this.searchValue)
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../../assets/styles/theme.scss';

.search {
  width: 100%;
}
i {
  position: absolute;
}
.icon {
  top: 50%;
  transform: translateY(-50%);
  &.search-icon {
    font-size: 3em;
  }
  &.clear-icon {
    right: 7%;
  }
}
input {
  background-color: $search-bg;
  border-radius: 2px;
  border-width: 0;
  width: 95%;
  font-size: 2em;
  padding-left: 15px;
  &:focus {
    outline: none;
  }
}
</style>
