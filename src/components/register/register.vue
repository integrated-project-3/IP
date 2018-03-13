<template lang="html">
  <div>
    <b-row class="register" align-v="center">
      <!-- used to center the table -->
      <b-col></b-col>
      <b-col md="11">
        <b-btn id="create" @click="create">+</b-btn>
        <b-table :items="getTimelines"
                  bordered:false
                  :sort-by.sync="sort.by"
                  :sort-desc.sync="sort.desc"
                  :fields="fields"
                  @row-clicked="rowClicked"
                  @sort-changed="sortChanged"
                  @row-dblclicked="openTimeline"
                  ref="register"
                  >
        </b-table>
      </b-col>
      <!-- used to center the table -->
      <b-col></b-col>
    </b-row>
    <a-selection-handler :select-count="selectCount" @del="del" @cancel="cancel"></a-selection-handler>
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

/*
  Keep track of what is sorted and how many.
*/
var selectCount = 0
var selectedItems = []

/*
  Called when clearing all selected rows.
  Parameter this(t) to access the selectCount.
*/
function clearSelected(t) {
  for (var i = 0; i < selectedItems.length; i++) {
    var timeline = selectedItems[i]
    timeline.selected = false
    timeline._rowVariant = ''
  }
  selectedItems = []
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
  selectedItems.push(item)
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
  for (var i = 0; i < selectedItems.length; i++) {
    if (selectedItems[i] === item) {
      selectedItems.splice(i,1)
      break
    }
  }
}

/*
  Called when selecting between two rows by shift clicking.
  Parameter this(t) to access selectCount.
  Parameter item that is being selected.
*/
function selectBetweenRows(item, t) {
  console.log(item, t)
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
      clearSelected
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
      console.log(sort)
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
      Calls AWS API which invokes a lambda function.
      The lambda calls the ideagen API and modifies some of the data before returning it.
    */
    getTimelines: function(ctx) {
      let promise = axios.get('https://b0qss3eydk.execute-api.eu-west-2.amazonaws.com/prod/timelines', {
        headers: {
          'X-Api-Key': 'zQfYRHZ1vY3GFnvDZep8Z5KqlHsOKxgf1vnldchF'
        }
      })
      return promise.then((data) => {
        return data.data
      }).catch(error => {
        return []
      })
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
      Create a new timeline.
    */
    create: function() {

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
</style>
