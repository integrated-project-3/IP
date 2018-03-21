import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
import createPersistedState from 'vuex-persistedstate'

Vue.use(Vuex)

var timelines = []

function fetchTimelines() {
  timelines.splice(0, timelines.length)
  axios.get('https://b0qss3eydk.execute-api.eu-west-2.amazonaws.com/aileron/GetAllTimelinesAndEvents', {
    headers: {
      'X-Api-Key': 'zQfYRHZ1vY3GFnvDZep8Z5KqlHsOKxgf1vnldchF'
    }
  })
  .then((data) => {
    for (var i = 0; i < data.data.length; i++) {
      var item = data.data[i]
      var timeline = {
         title: item.Title,
         date: item.CreationTimeStamp,
         isDeleted: item.isDeleted,
         id: item.Id,
         timelineEvents: item.TimelineEvents,
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

fetchTimelines()

const store = new Vuex.Store({
  state: {
    timelines,
    currentTimeline: null
  },
  mutations: {
    addTimeline (state, timeline) {
      state.timelines.push(timeline)
    },
    removeTimeline(state, id) {
      for (var i = 0; i < state.timelines.length; i++) {
        if (state.timelines[i].id === id) {
          state.timelines.splice(i,1)
          return
        }
      }
    },
    setCurrentTimeline(state, timeline) {
      state.currentTimeline = timeline
    }
  },
  actions: {
    createTimeline ({ commit }, title) {
      axios.put('https://b0qss3eydk.execute-api.eu-west-2.amazonaws.com/aileron/CreateTimeline',
        {
          'Title': title
        },
        {
          headers:
          {
            'X-Api-Key': 'zQfYRHZ1vY3GFnvDZep8Z5KqlHsOKxgf1vnldchF'
          }
        }
      ).then(response => {
        var item = response.data
        var timeline = {
          title: item.Title,
          date: item.CreationTimeStamp,
          isDeleted: item.isDeleted,
          id: item.Id,
          selected: false,
          _rowVariant: ''
        }
        commit('addTimeline', timeline)
      })
      .catch(error => {
        console.log(error)
      })
    },
    deleteTimeline({ commit }, id) {
      axios.put('https://b0qss3eydk.execute-api.eu-west-2.amazonaws.com/aileron/DeleteTimeline',
        {
          'TimelineId': id
        },
        {
          headers:
          {
            'X-Api-Key': 'zQfYRHZ1vY3GFnvDZep8Z5KqlHsOKxgf1vnldchF'
          }
        }
      ).then(() => {
        commit('removeTimeline', id)
      })
      .catch(error => {
        console.log(error)
      })
    },
    deleteSelectedTimelines({ state }) {
      for (var i = state.timelines.length-1; i >= 0; i--) {
        var timeline = state.timelines[i]
        if (timeline.selected === true) {
          this.dispatch('deleteTimeline', timeline.id)
        }
      }
    }
  },
  getters: {
    selectedTimelines: (state) => {
      return state.timelines.filter(timeline => timeline.selected)
    }
  },
  plugins: [createPersistedState({
    paths: ['currentTimeline']
 })]
})

export default store
