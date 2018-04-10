<template lang="html">
  <div>
    <b-row class="register" align-v="center" @click="clearSelected()">
      <b-col></b-col> <!-- used to center the table -->
      <b-col md="11">
        <b-btn class="btn-round" variant="create" @click="openModal('createTimeline')" style="float: right;">+</b-btn>
        <b-table :items="timelines"
                  bordered:false
                  :sort-by.sync="sort.by"
                  :sort-desc.sync="sort.desc"
                  :fields="fields"
                  @row-clicked="rowClicked"
                  @sort-changed="sortChanged"
                  @row-dblclicked="openTimeline"
                  fixed
                  >
        </b-table>
      </b-col>
      <b-col></b-col> <!-- used to center the table -->
    </b-row>
    <a-selection-handler :select-count="selectCount" @del="openModal('deleteTimeline')" @cancel="cancel" @edit="openModal('editTitle')"></a-selection-handler>
    <b-modal  v-model="modal" :title="modalTitle" @shown="modalOpened" @hidden="modalClosed">
      <b-container fluid>
        <b-row>
          <b-col v-if="modalType === 'createTimeline'">
            <input type="text" v-model="newTimelineTitle" @keyup.enter="createTimeline" @keyup="checkTitleInput" placeholder="Enter title" id="titleInput" />
            <b-alert variant="danger" :show="showTitleWarning">Title must be at least 5 characters long</b-alert>
          </b-col>
          <b-col v-else-if="modalType === 'deleteTimeline'">
            <p>
              Are you sure you wish to delete selected timelines?
            </p>
          </b-col>
          <b-col v-else-if="modalType === 'editTitle'">
            <input type="text" v-model="newTimelineTitle" @keyup.enter="changeTitle" @keyup="checkTitleInput" placeholder="Enter new title" id="titleInput" />
            <b-alert variant="danger" :show="showTitleWarning">Title must be at least 5 characters long</b-alert>
          </b-col>
        </b-row>
      </b-container>
      <div slot="modal-footer" class="w-100">
        <b-btn class="float-left" @click="closeModal">CANCEL</b-btn>
        <b-btn v-if="modalType === 'createTimeline'" class="float-right" @click="createTimeline">CREATE</b-btn>
        <b-btn v-else-if="modalType === 'deleteTimeline'" class="float-right" @click="deleteTimeline">DELETE</b-btn>
        <b-btn v-else-if="modalType === 'editTitle'" class="float-right" @click="changeTitle">SAVE</b-btn>
      </div>
    </b-modal>
  </div>
</template>

<script>

import aSelectionHandler from '../selection-handler/selection-handler.vue'
import {formatDate, validTitle} from '../../scripts/script'
import $ from 'jquery'

/*
  The columns of the table.
*/
const fields = [
  { key: 'title', sortable: true},
  { key: 'date', sortable: true, formatter: 'formatDate' }
]
/*
Default sort.
*/
var sort = {
  by: 'date',
  desc: false
}
function setSort(by, desc) {
  sort.by = by
  sort.desc = desc
}
function clearSort() {
  sort.by = ''
  sort.desc = ''
}

var lastSelected = {}

function selectRow(item) {
  item.selected = true,
  item._rowVariant = 'select'
  lastSelected = item
}
function deselectRow(item) {
  item.selected = false,
  item._rowVariant = ''
}

export default {
  name: 'aRegister',
  components: {
    aSelectionHandler
  },
  data() {
    return {
      fields,
      sort,
      newTimelineTitle: '',
      showTitleWarning: false,
      modal: false,
      modalTitle: '',
      modalType: '',
      formatDate
    }
  },
  mounted() {
    let t = this
    $('#app').click(function() {
      t.clearSelected()
    })
  },
  computed: {
    timelines() {
      return this.$store.state.timelines
    },
    selectCount() {
      return this.$store.getters.selectedTimelines.length
    }
  },
  methods: {
    /* Clear all selected. */
    clearSelected: function() {
      for (var i = 0; i < this.$store.state.timelines.length; i++) {
        var timeline = this.$store.state.timelines[i]
        timeline.selected = false
        timeline._rowVariant = ''
      }
    },
    /* Select rows between 2 rows when shift click. */
    selectBetweenRows: function(iStart) {
      let timelines = this.$store.state.timelines
      var iEnd = timelines.indexOf(lastSelected)
      for (var i = Math.min(iStart, iEnd); i < Math.max(iStart, iEnd); i++) {
        timelines[i].selected = true
        timelines[i]._rowVariant = 'select'
      }
    },
    /* Called when the cancel button is clicked on the selection-handler. */
    cancel: function() {
      this.clearSelected()
    },
    /*
      By default the b-table sort just loops between ascending and descending.
      By checking when sorted this can turn sorting off on a column every third click.
    */
    sortChanged: function(ctx) {
      if (ctx.sortBy === sort.by && ctx.sortDesc === false && sort.desc === true) {
        clearSort()
      } else {
        setSort(ctx.sortBy, ctx.sortDesc)
      }
    },
    /*
      Deals with selection and deselction of rows.
    */
    rowClicked: function(item, index, event) {
      event.stopPropagation()
      if (item.selected) {
        if (event.ctrlKey) {
          deselectRow(item)
        } else if (!event.shiftKey) {
          if (this.selectCount > 1) {
            this.clearSelected()
            selectRow(item)
          } else {
            deselectRow(item)
          }
        }
      } else {
        if (event.ctrlKey) {
          selectRow(item)
        } else if (event.shiftKey) {
          if (this.selectCount > 0) {
            this.selectBetweenRows(index)
          }
          selectRow(item)
        } else {
          if (this.selectCount > 0) {
            this.clearSelected()
          }
          selectRow(item)
        }
      }
    },
    /* When a row is doulbe clicked, open that timeline. */
    openTimeline: function(item) {
      this.$store.commit('setCurrentTimeline', item)
      this.$router.push({name: 'TIMELINE'})
    },
    createTimeline() {
      if (!validTitle(this.newTimelineTitle)) {
        document.getElementById('titleInput').focus()
        this.showTitleWarning = true
        return
      }
      this.closeModal()
      this.$store.dispatch('createTimeline', this.newTimelineTitle).then(item => {
        this.openTimeline(item)
      })
    },
    deleteTimeline: function() {
      this.closeModal()
      this.$store.dispatch('deleteSelectedTimelines')
    },
    changeTitle: function() {
      if (!validTitle(this.newTimelineTitle)) {
        document.getElementById('titleInput').focus()
        this.showTitleWarning = true
        return
      }
      this.closeModal()
      var payload = {
        id: this.$store.getters.selectedTimelines[0].id,
        title: this.newTimelineTitle
      }
      this.$store.dispatch('changeTimelineTitle', payload)
    },
    /* Called when a key is pressed on the create modal input. */
    checkTitleInput: function() {
      /*
        If the user has tried to create a timeline that has less than 5 characters
        then the warning gets shown.
        This automatically hides the warning once they have entered at least 5 characters.
      */
      if (this.showTitleWarning === true) {
        if (validTitle(this.newTimelineTitle)) {
          this.showTitleWarning = false
        }
      }
    },
    openModal: function(type) {
      this.modal = true
      this.modalType = type
    },
    closeModal: function() {
      this.modal = !this.modal
    },
    modalOpened: function() {
      if (this.modalType === "createTimeline") {
        document.getElementById('titleInput').focus()
        this.modalTitle = "Create"
      } else if (this.modalType === "deleteTimeline") {
        this.modalTitle = "Delete"
      } else if (this.modalType === "editTitle") {
        document.getElementById('titleInput').focus()
        this.modalTitle = "Edit"
        this.newTimelineTitle = this.$store.getters.selectedTimelines[0].title
      }
    },
    modalClosed: function() {
      if (this.modalType === "createTimeline" || this.modalType === "editTitle") {
        this.clearSelected()
        this.newTimelineTitle = ''
        this.showTitleWarning = false
      }
      this.modalType = ''
      this.modalTitle = ''
    }
  }
}
</script>

<style lang="scss">
@import '../../assets/styles/theme.scss';
@import '../../assets/styles/main.scss';

.register {
  padding-top: 20px;
  pointer-events: visibleStroke;
  .btn-round {
    margin-bottom: 10px;
    @media screen and (max-width: 720px) {
      width: 100%;
      border-radius: 2px;
    }
  }
  table {
    background-color: $register-bg;
    color: $text;
    width: 100%;
    th {
      background-color: $background;
      border: none;
      @media only screen and (max-width: 576px) {
        font-size: 2em;
      }
      font-size: 3em;
      outline: none;
    }
    td {
      border: none;
      font-size: 1.5em;
      overflow: hidden;
    }
    .table-select {
      background-color: $select;
      color: white;
    }
  }
}
</style>
