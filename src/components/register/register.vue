<template lang="html">
  <div>
    <b-row class="register" align-v="center">
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
                  >
        </b-table>
      </b-col>
      <b-col></b-col> <!-- used to center the table -->
    </b-row>
    <a-selection-handler :select-count="selectCount" @del="openModal('deleteTimeline')" @cancel="cancel"></a-selection-handler>
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
          <b-col v-else-if="modalType === 'editTimeline'">
            <input type="text" v-model="newTimelineTitle" @keyup.enter="changeTitle" @keyup="checkTitleInput" placeholder="Enter new title" id="titleInput" />
            <b-alert variant="danger" :show="showTitleWarning">Title must be at least 5 characters long</b-alert>
          </b-col>
        </b-row>
      </b-container>
      <div slot="modal-footer" class="w-100">
        <b-btn class="float-left" @click="closeModal">CANCEL</b-btn>
        <b-btn v-if="modalType === 'createTimeline'" class="float-right" @click="createTimeline">CREATE</b-btn>
        <b-btn v-else-if="modalType === 'deleteTimeline'" class="float-right" @click="deleteTimeline">DELETE</b-btn>
        <b-btn v-else-if="modalType === 'editTimeline'" class="float-right" @click="changeTitle">SAVE</b-btn>
      </div>
    </b-modal>
  </div>
</template>

<script>

import aSelectionHandler from '../selection-handler/selection-handler.vue'
import axios from 'axios'
import {formatDate} from '../../scripts/script'

var selectCount = 0

/*
  The columns of the table.
*/
const fields = [
  { key: 'title', sortable: true},
  { key: 'date', sortable: true, formatter: 'dateFormatter' }
]
var timelines = []

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

/*
  Called when clearing all selected rows.
  Parameter this(t) to access the selectCount.
*/
function clearSelected(t) {
  for (var i = 0; i < timelines.length; i++) {
    var timeline = timelines[i]
    timeline.selected = false
    timeline._rowVariant = ''
  }
  t.selectCount = 0
}
/*
  Called when selecting a row.
  Parameter this(t) to access the selectCount.
  Parameter item that is being selected.
*/
function selectRow(item, t) {
  item.selected = true,
  item._rowVariant = 'select'
  t.selectCount++
}
/*
  Called when deselecting a row.
  Parameter this(t) to access selectCount.
  Parameter item that is being deselected.
*/
function deselectRow(item, t) {
  item.selected = false,
  item._rowVariant = ''
  t.selectCount--
}
/*
  Called when selecting between two rows by shift clicking.
  Parameter this(t) to access selectCount.
  Parameter item that is being selected.
*/
function selectBetweenRows(item, t) {
  console.log(item, t)
  console.log(timelines)
}

function validTitle(str) {
  var s = str.replace(/\s/g,'')
  if (s.length >= 5) {
    return true
  }
  return false
}

/*
  Calls AWS API which invokes a lambda function.
  The lambda calls the ideagen API and modifies some of the data before returning it.
*/
function fetchTimelines() {
  timelines.splice(0, timelines.length)
  axios.get('https://b0qss3eydk.execute-api.eu-west-2.amazonaws.com/aileron/GetTimelines', {
    headers: {
      'X-Api-Key': 'zQfYRHZ1vY3GFnvDZep8Z5KqlHsOKxgf1vnldchF'
    }
  })
  .then((data) => {
    //return data.data
    for (var i = 0; i < data.data.length; i++) {
      var item = data.data[i]
      var timeline = {
         title: item.Title,
         date: item.CreationTimeStamp,
         isDeleted: item.isDeleted,
         id: item.Id,
         selected: false,
         _rowVariant: ''
      }
      timelines.push(timeline)
    }
  })
  .catch(error => {
    console.log(error)
  })
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
      selectCount,
      timelines,
      newTimelineTitle: '',
      showTitleWarning: false,
      modal: false,
      modalTitle: '',
      modalType: ''
    }
  },
  //eslint-disable-next-line
  beforeRouteEnter(to, from, next) {
    //eslint-disable-next-line
    next(vm => {
      fetchTimelines()
    })
  },
  methods: {
    /* Called when the cancel button is clicked on the selection-handler. */
    cancel: function() {
      clearSelected(this)
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
      There must have been an easier way to do this.
    */
    rowClicked: function(item, index, event) {
      if (item.selected) {
        if (event.ctrlKey) {
          deselectRow(item, this)
        } else if (!event.shiftKey) {
          if (this.selectCount > 1) {
            clearSelected(this)
            selectRow(item, this)
          } else {
            deselectRow(item, this)
          }
        }
      } else {
        if (event.ctrlKey) {
          selectRow(item, this)
        } else if (event.shiftKey) {
          selectRow(item, this)
          if (this.selectCount > 1) {
            selectBetweenRows(item, this)
          }
        } else {
          if (this.selectCount > 0) {
            clearSelected(this)
          }
          selectRow(item, this)
        }
      }
    },
    /* When a row is doulbe clicked, open that timeline. */
    openTimeline: function(item) {
      sessionStorage.setItem('timelineId', item.id)
      this.$router.push({name: 'TIMELINE'})
    },
    dateFormatter: function(ticks) {
      return formatDate(ticks)
    },
    createTimeline() {
      if (!validTitle(this.newTimelineTitle)) {
        document.getElementById('titleInput').focus()
        this.showTitleWarning = true
        return
      }
      var a = axios.put('https://b0qss3eydk.execute-api.eu-west-2.amazonaws.com/aileron/CreateTimeline', {
        'Title': this.newTimelineTitle
      }, {
        headers: {
          'X-Api-Key': 'zQfYRHZ1vY3GFnvDZep8Z5KqlHsOKxgf1vnldchF'
        }
      }).catch(error => {
        console.log(error)
      })
      this.closeModal()
      // eslint-disable-next-line
      a.then(response => {
        console.log(response)
        fetchTimelines()
      })
    },
    deleteTimeline: function() {
      for (var i = timelines.length-1; i >= 0; i--) {
        if (timelines[i].selected === true) {
          axios.put('https://b0qss3eydk.execute-api.eu-west-2.amazonaws.com/aileron/DeleteTimeline', {
            'TimelineId': timelines[i].id
          }, {
            headers: {
              'X-Api-Key': 'zQfYRHZ1vY3GFnvDZep8Z5KqlHsOKxgf1vnldchF'
            }
          }).catch(error => {
            console.log(error)
          })
          this.timelines.splice(i,1)
          this.selectCount -= 1
        }
      }
      this.closeModal()
    },
    changeTitle: function() {
      alert("edited")
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
      } else if (this.modalType === "editTimeline") {
        document.getElementById('titleInput').focus()
        this.modalTitle = "Edit"
      }
    },
    modalClosed: function() {
      if (this.modalType === "createTimeline" || this.modalType === "editTimeline") {
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
  table {
    background-color: $register-bg;
    color: $text;
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
    }
    .table-select {
      background-color: $select;
      color: white;
    }
  }
}
</style>
