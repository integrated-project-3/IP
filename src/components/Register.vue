<template>
  <div>
    <b-row class="register" align-v="center">
      <b-col></b-col>
      <b-col md="11">
        <b-table :items="getTimelines"
                  bordered:false
                  :sort-by.sync="sort.by"
                  :sort-desc.sync="sort.desc"
                  :fields="fields"
                  @row-clicked="rowClicked"
                  @sort-changed="sortChanged"
                  @row-dblclicked="openTimeline"
                  :busy.sync="isBusy"
                  >
        </b-table>
      </b-col>
      <b-col></b-col>
    </b-row>
    <SelectionHandler :select-count="selectCount"></SelectionHandler>
  </div>
</template>

<script>

import SelectionHandler from './SelectionHandler.vue'
import axios from 'axios'

var fields = [
  { key: 'title', sortable: true},
  { key: 'date', sortable: true, formatter: 'dateFormatter' }
]
var sort = {
  by: 'date',
  desc: false
}
var selectCount = 0

function clearSelected(t) {
  console.log(t)
  for (var i = 0; i < timelines.length; i++) {
    var timeline = timelines[i]
    timeline.selected = false
    timeline._rowVariant = ''
  }
  t.selectCount = 0
}
function selectRow(item, t) {
  item.selected = true,
  item._rowVariant = 'select'
  t.selectCount++
}
function deselectRow(item, t) {
  item.selected = false,
  item._rowVariant = ''
  t.selectCount--
}
function selectBetweenRows(newIndex, t) {
  console.log(newIndex, t)
}
function deleteSelected(t) {
  var sure = confirm("Delete?")
  if (sure != null) {
    for (var i = timelines.length-1; i >= 0; i--) {
      var timeline = timelines[i]
      if (timeline.selected) {
        timelines.splice(i,1)
      }
    }
    t.selectCount = 0
  }
}

function setSort(by, desc) {
  sort.by = by
  sort.desc = desc
}
function clearSort() {
  sort.by = ''
  sort.desc = ''
}

export default {
  name: 'register',
  components: {
    SelectionHandler
  },
  data() {
    return {
      fields,
      sort,
      selectCount,
      clearSelected,
      isBusy: false
    }
  },
  methods: {
    cancel: function() {
      clearSelected(this)
    },
    delete: function() {
      deleteSelected(this)
    },
    sortChanged: function(ctx) {
      if (ctx.sortBy === sort.by && ctx.sortDesc === false && sort.desc === true) {
        clearSort()
      } else {
        setSort(ctx.sortBy, ctx.sortDesc)
      }
    },
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
            selectBetweenRows(index, this)
          }
        } else {
          if (this.selectCount > 0) {
            clearSelected(this)
          }
          selectRow(item, this)
        }
      }
    },
    openTimeline: function(item) {
      this.$router.push({name: 'TIMELINE', params: {timeline: item}} )
    },
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
    dateFormatter: function(ticks) {
      const epochTicks = 621355968000000000;
      var ticksSinceEpoch = ticks - epochTicks;
      var millisecondsSinceEpoch = ticksSinceEpoch / 10000;
      var date = new Date(millisecondsSinceEpoch);
      return date.toLocaleDateString()
    }
  }
}
</script>

<style lang="scss">
@import '../assets/styles/theme.scss';

.register {
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
}
</style>
