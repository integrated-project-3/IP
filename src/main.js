import Vue from 'vue/dist/vue.js'
import app from './app.vue'
import BootstrapVue from 'bootstrap-vue'
import VueRouter from 'vue-router'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import axios from 'axios'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'
import router from './router'
// import store from './store'
import VueMaterial from 'vue-material'
import 'vue-material/dist/vue-material.min.css'

Vue.use(BootstrapVue)
Vue.use(VueRouter)
Vue.use(Vuex)
Vue.use(VueMaterial)

Vue.config.productionTip = false

var timelines = []

function fetchTimelines() {
  timelines.splice(0, timelines.length)
  axios.get('https://gcu.ideagen-development.com/Timeline/GetAllTimelinesAndEvent', {
    headers: {
      'TenantId': 'Team19',
      'AuthToken': '7cbc5c61-bcfa-47d8-a171-599616102147'
    }
  })
  .then((data) => {
    for (var i = 0; i < data.data.Timelines.length; i++) {
      var item = data.data.Timelines[i]
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
    },
    updateTimelineTitle(state, payload) {
      for (var i = 0; i < state.timelines.length; i++) {
        if (state.timelines[i].id === payload.id) {
          state.timelines[i].title = payload.title
          return
        }
      }
    }
  },
  actions: {
    createTimeline ({ commit }, title) {
      axios.put('https://gcu.ideagen-development.com/Timeline/Create',
        {
          'AuthToken':'7cbc5c61-bcfa-47d8-a171-599616102147',
          'TenantId':'Team19',
          'Title': title,
          'TimelineId':'e4264382-87f6-4a01-a5ed-174811691a4f'
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
        console.log(timeline)
        commit('addTimeline', timeline)
      })
      .catch(error => {
        console.log(error)
      })
    },
    deleteTimeline({ commit }, id) {
      axios.put('https://gcu.ideagen-development.com/Timeline/Delete',
        {
          'AuthToken':'7cbc5c61-bcfa-47d8-a171-599616102147',
          'TenantId':'Team19',
          'TimelineId':id
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
    },
    changeTimelineTitle({ commit }, title) {
      var id = this.getters.selectedTimelines[0].id
      axios.put('https://gcu.ideagen-development.com/Timeline/EditTitle',
        {
          'AuthToken':'7cbc5c61-bcfa-47d8-a171-599616102147',
          'TenantId':'Team19',
          'Title': title,
          'TimelineId': id
        }
      ).then(response => {
        var item = response.data
        var timeline = {
          title: item.Title,
          date: item.CreationTimeStamp,
          isDeleted: item.IsDeleted,
          id: item.Id,
          selected: false,
          _rowVariant: ''
        }
        commit('updateTimelineTitle', {id, title})
      })
      .catch(error => {
        console.log(error)
      })
    },
    createEvent ({ commit }, title) {
      alert("created event " + title)
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

new Vue({
  render: h => h(app),
  router,
  store
}).$mount('#app')
