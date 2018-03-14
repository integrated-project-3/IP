<template lang="html">
  <div>
    <b-row class="register" align-v="center">
      <!-- used to center the table -->
      <b-col></b-col>
      <b-col md="11">
        <b-btn id="create" @click="createTimelineModal = !createTimelineModal">+</b-btn>
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
      <!-- used to center the table -->
      <b-col></b-col>
    </b-row>
    <a-selection-handler :select-count="selectCount" @del="del" @cancel="cancel"></a-selection-handler>
    <b-modal  v-model="createTimelineModal" title="Create" id="createModal" @shown="createModalOpened" @hidden="createModalClosed" >
      <b-container fluid>
        <b-row>
          <b-col>
            <input type="text" v-model="newTimelineTitle" @keyup.enter="createTimeline" @keyup="checkTitleInput" placeholder="Enter title" id="createTimelineInput" />
            <b-alert variant="danger" :show="showTitleWarning">Title must be at least 5 characters long</b-alert>
          </b-col>
        </b-row>
      </b-container>
      <div slot="modal-footer" class="w-100">
        <b-btn class="float-left" @click="closeCreateTimelineModal">CANCEL</b-btn>
        <b-btn class="float-right" @click="createTimeline">CREATE</b-btn>
      </div>
    </b-modal>
  </div>
</template>

<script>

import aSelectionHandler from '../selection-handler/selection-handler.vue'
import axios from 'axios'

/*
  The columns of the table.
*/
const fields = [
  { key: 'title', sortable: true},
  { key: 'date', sortable: true, formatter: 'dateFormatter' }
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

var selectCount = 0

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

var timelines = []
/*
  Calls AWS API which invokes a lambda function.
  The lambda calls the ideagen API and modifies some of the data before returning it.
*/
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
      clearSelected,
      timelines,
      createTimelineModal: false,
      newTimelineTitle: '',
      showTitleWarning: false
    }
  },
  methods: {
    /*
      Called when the cancel button is clicked on the selection-handler.
    */
    cancel: function() {
      clearSelected(this)
    },
    /*
      Called when the delete button is clicked on the selection-handler.
    */
    del: function() {
      for (var i = 0; i < timelines.length; i++) {
        if (timelines[i].selected === true) {
          var d = axios.put('https://b0qss3eydk.execute-api.eu-west-2.amazonaws.com/aileron/DeleteTimeline', {
            'TimelineId': timelines[i].id
          }, {
            headers: {
              'X-Api-Key': 'zQfYRHZ1vY3GFnvDZep8Z5KqlHsOKxgf1vnldchF'
            }
          }).catch(error => {
            console.log(error)
          })
        }
      }
      // eslint-disable-next-line
      d.then(response => {
        this.$router.go(this.$router.currentRoute)
      })
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
    /*
      When a row is doulbe clicked, open that timeline.
    */
    openTimeline: function(item) {
      this.$router.push({name: 'TIMELINE', params: {timeline: item}} )
    },
    /*
      Used to format the ticks returned by the API to readable string.
      Could be done in the lambda before returning the data, however keeping the ticks
      means that the date can be sorted correctly.
    */
    dateFormatter: function(ticks) {
      const epochTicks = 621355968000000000;
      const ticksSinceEpoch = ticks - epochTicks;
      const millisecondsSinceEpoch = ticksSinceEpoch / 10000;
      const date = new Date(millisecondsSinceEpoch);
      return date.toLocaleDateString()
    },
    /*
      Called when the cancel button is pressed on the create timeline modal.
    */
    closeCreateTimelineModal: function() {
      this.createTimelineModal = !this.createTimelineModal
    },
    /*
      Called when the create button is clicked on the create timeline modal.
    */
    createTimeline() {
      if (!validTitle(this.newTimelineTitle)) {
        document.getElementById('createTimelineInput').focus()
        this.showTitleWarning = true
        return
      }
      var c = axios.put('https://b0qss3eydk.execute-api.eu-west-2.amazonaws.com/aileron/CreateTimeline', {
        'Title': this.newTimelineTitle
      }, {
        headers: {
          'X-Api-Key': 'zQfYRHZ1vY3GFnvDZep8Z5KqlHsOKxgf1vnldchF'
        }
      }).catch(error => {
        console.log(error)
      })
      this.newTimelineTitle = ''
      this.createTimelineModal = !this.createTimelineModal
      // eslint-disable-next-line
      c.then(response => {
        this.$router.go(this.$router.currentRoute)
      })
    },
    /*
      Called when the create modal is opened.
    */
    createModalOpened: function() {
      document.getElementById('createTimelineInput').focus()
    },
    /*
      Called when the create modal is closed.
    */
    createModalClosed: function() {
      this.newTimelineTitle = ''
      this.showTitleWarning = false
    },
    /*
      Called when a key is pressed on the new timeline modal input.
    */
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
    }
  }
}
</script>

<style lang="scss">
@import '../../assets/styles/theme.scss';

.register {
  /*
    Stops timelines from highlighting when shift clicking.
  */
  user-select: none; /* CSS3 (little to no support) */
  -ms-user-select: none; /* IE 10+ */
  -moz-user-select: none; /* Gecko (Firefox) */
  -webkit-user-select: none; /* Webkit (Safari, Chrome) */

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
  #create {
    background-color: $create;
    border: none;
    border-radius: 25px;
    width: 45px;
    height: 45px;
    font-size: 20px;
    float: right;
  }
}
#createModal {
  border-radius: 2px;
  header {
    border: none;
    color: $text;
  }
  input {
    width: 100%;
    background: $background;
    border: none;
    font-size: 1.5em;
    padding-left: 10px;
    &:focus {
      outline: none;
    }
  }
  footer {
    border: none;
  }
  button {
    background-color: white;
    color: $create;
    border: none;
  }
}
</style>
