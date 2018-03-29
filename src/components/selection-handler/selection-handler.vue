<template lang="html">
  <b-row class="selection-handler" v-if="selectCount>0" @click="handlerClicked()">
    <b-col lg="8" offset-lg="2" md="10" offset-md="1" class="main">
      <h2>{{ selectCount }} timeline<span v-if="this.selectCount>1">s</span> selected</h2>
      <div class="buttons">
        <b-btn v-if="selectCount === 1" variant="info" @click="edit">Edit</b-btn>
        <b-btn variant="cancel" @click="cancel">Cancel</b-btn>
        <b-btn variant="delete" @click="del">Delete</b-btn>
      </div>
    </b-col>
  </b-row>
</template>

<script>
export default {
  name: 'aSelectionHandler',
  props: {
    selectCount: {
      type: Number,
      required: true
    }
  },
  methods: {
    handlerClicked() {
      // stops selected timelines from being cleared on register
      event.stopPropagation()
    },
    del: function() {
      this.$emit("del")
    },
    cancel: function() {
      this.$emit("cancel")
    },
    edit: function() {
      this.$emit("edit")
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../../assets/styles/theme.scss';

.selection-handler {
  text-align: center;
  div.main {
    position: fixed;
    background-color: $background;
    box-shadow: 0 -3px 6px rgba(0,0,0,0.16);
    bottom: 0;
    padding: 9px 20px 8px 20px;
    h2 {
      display: inline;
      float: left;
    }
    div.buttons {
      float: right;
      .btn-delete {margin-left: 20px}
      .btn-cancel {margin-left: 20px}
      button {
        border: none;
        width: 100px;
      }
    }
    @media screen and (max-width: 670px) {
      h2 {
        display: block;
        float: none;
      }
      div.buttons {
        float: none;
        .btn-delete {margin-left: 0;}
        .btn-cancel {margin-left: 5px; margin-right: 5px;}
        button {
          margin-top: 10px;
        }
      }
    }
  }
}
</style>
