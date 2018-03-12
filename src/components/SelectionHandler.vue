<template>
  <b-row class="selection-handler" v-if="this.selectCount>0">
    <b-col lg="8" offset-lg="2" md="10" offset-md="1">
      <h2>{{ selectCount }} timeline<span v-if="this.selectCount>1">s</span> selected</h2>
      <b-btn id="delete" @click="$parent.delete">Delete</b-btn>
      <b-btn id="cancel" @click="$parent.cancel">Cancel</b-btn>
    </b-col>
  </b-row>
</template>

<script>


export default {
  name: 'SelectionHandler',
  props: {
    selectCount: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
    }
  },
  methods: {
    del: function() {
    },
    cancel: function() {
    }
  }
}
</script>

<style lang="scss">
@import '../assets/styles/theme.scss';

.selection-handler {
  text-align: center;
  div {
    position: fixed;
    background-color: $background;
    box-shadow: 0 -3px 6px rgba(0,0,0,0.16);
    bottom: 0;
    padding: 9px 20px 8px 20px;
    h2 {
      display: inline;
      float: left;
    }
    #cancel {background-color: $cancel;}
    #delete {background-color: $delete;margin-left: 20px}
    button {
      border: none;
      border-radius: 2px;
      width: 94px;
      height: 36px;
      font-size: 16px;
      float: right;
    }
  }
}
</style>
