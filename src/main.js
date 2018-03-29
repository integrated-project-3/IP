import Vue from 'vue/dist/vue.js'
import app from './app.vue'
import BootstrapVue from 'bootstrap-vue'
import VueRouter from 'vue-router'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'
import router from './router'
import {getAll, createTimeline, deleteTimeline, changeTimelineTitle, createEvent, linkEventToTimeline, unlinkEventFromEvent, linkEventToEvent} from './scripts/api'

Vue.use(BootstrapVue)
Vue.use(VueRouter)
Vue.use(Vuex)

Vue.config.productionTip = false

var timelines = []

const store = new Vuex.Store({
  state: {
    timelines,
    currentTimeline: null,
    currentEvent: null
  },
  mutations: {
    addTimeline (state, timeline) {
      state.timelines.push(timeline)
    },
    addEvent(state, event) {
      state.currentTimeline.timelineEvents.push(event)
    },
    removeTimeline(state, id) {
      for (var i = 0; i < state.timelines.length; i++) {
        if (state.timelines[i].id === id) {
          state.timelines.splice(i,1)
          if (state.currentTimeline != null)
            if (state.currentTimeline.id === id)
              state.currentTimeline = null
          return
        }
      }
    },
    setCurrentTimeline(state, timeline) {
      state.currentTimeline = timeline
    },
    clearCurrentTimeline(state) {
      state.currentTimeline = null
    },
    setCurentEvent(state, event) {
      state.currentEvent = event
    },
    clearCurrentEvent(state) {
      state.currentEvent = null
    },
    updateTimelineTitle(state, payload) {
      for (var i = 0; i < state.timelines.length; i++) {
        if (state.timelines[i].id === payload.id) {
          state.timelines[i].title = payload.title
          if(payload.id === state.currentTimeline.id) {
            state.currentTimeline.title = payload.title
          }
          return
        }
      }
    }
  },
  actions: {
    createTimeline ({ commit }, title) {
      return new Promise ((resolve) => {
        createTimeline(title).then(response => {
          var item = response.data
          var timeline = {
           title: item.Title,
           date: item.CreationTimeStamp,
           isDeleted: item.IsDeleted,
           id: item.Id,
           selected: false,
           _rowVariant: ''
        }
          timeline.timelineEvents = []
          commit('addTimeline', timeline)
          resolve(timeline)
        })
      })
    },
    deleteTimeline({ commit }, id) {
      deleteTimeline(id).then(() => {
        commit('removeTimeline', id)
      })
    },
    deleteSelectedTimelines({ state }) {
      /*
        Filter returns an array of all selected timelines.
        Foreach loops through that returned array,
        using 'e' as the current timline.
        Dispatch calls deleteTimeline action.
        This at the end allows the use of this inside the forEach function.
      */
      state.timelines.filter(t => t.selected).forEach(function(e){this.dispatch('deleteTimeline',e.id)}, this)
    },
    changeTimelineTitle({ state, commit }, payload) {
      var id = payload.id
      var title = payload.title
      changeTimelineTitle(id, title).then(() => {
        commit('updateTimelineTitle', {id, title})
      })
    },
    createEventExact ({state, commit}, payload) {
      var newEvent = {}
      createEvent(payload).then(response => {
        newEvent = response.data
        newEvent.LinkedTimelineEventIds = []
        linkEventToTimeline(newEvent.Id, state.currentTimeline.id).then(() => {
          commit('addEvent', newEvent)
        })
      })
    },
    createEventBA({state, commit}, payload) {
      var newEvent = {}
      createEvent(payload).then(response => {
        newEvent = response.data
        linkEventToTimeline(newEvent.Id, state.currentTimeline.id).then(() => {
          if (payload.beforeAfter === 'before') {
            /*
              Create a new timeline, create Event 1 at 12:00.
              Create Event 2 set as before Event 1.
              Now if you create Event 3 and also set this as before Event 1,
              this will find that Event 2 already has a link to Event 1.
              Replaces Event 2's link to Event 1 with a link to Event 3.
              Links Event 3 to Event 1.
              index would be the index of Event 2 in that example
            */
            let index = state.currentTimeline.timelineEvents.map(function(e) {if(e.LinkedTimelineEventIds != null)if(e.LinkedTimelineEventIds[0] != null)return e.LinkedTimelineEventIds[0]}).indexOf(payload.eventId)
            if (index != -1) {
              unlinkEventFromEvent(state.currentTimeline.timelineEvents[index].Id, payload.eventId)
              linkEventToEvent(state.currentTimeline.timelineEvents[index].Id, newEvent.Id)
              state.currentTimeline.timelineEvents[index].LinkedTimelineEventIds[0] = newEvent.Id
            }
            linkEventToEvent(newEvent.Id, payload.eventId).then(() => {
              newEvent.LinkedTimelineEventIds = []
              newEvent.LinkedTimelineEventIds.push(payload.eventId)
              commit('addEvent', newEvent)
            })
          } else if (payload.beforeAfter === 'after') {
            let index = state.currentTimeline.timelineEvents.map(function(e) {return e.Id}).indexOf(payload.eventId)
            let item = state.currentTimeline.timelineEvents[index]
            if (item.LinkedTimelineEventIds != null) {
              if (item.LinkedTimelineEventIds[0] != null) {
                linkEventToEvent(newEvent.Id, item.LinkedTimelineEventIds[0])
                unlinkEventFromEvent(item.Id, item.LinkedTimelineEventIds[0])
                newEvent.LinkedTimelineEventIds = []
                newEvent.LinkedTimelineEventIds.push(item.LinkedTimelineEventIds[0])
              }
            }
            linkEventToEvent(item.Id, newEvent.Id).then(() => {
              item.LinkedTimelineEventIds = []
              item.LinkedTimelineEventIds.push(newEvent.Id)
              commit('addEvent', newEvent)
            })
          }
        })
      })
    }
  },
  getters: {
    selectedTimelines: (state) => {
      return state.timelines.filter(t => t.selected)
    }
  },
  plugins: [createPersistedState({
    paths: ['currentTimeline']
 })]
})

new Vue({
  render: h => h(app),
  router,
  store,
  methods: {
    fetchTimelines() {
      timelines.splice(0, timelines.length)
      var get = getAll()
      get.then((data) => {
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
        this.updateCurrentTimeline()
      })
    },
    updateCurrentTimeline() {
       if (this.$store.state.currentTimeline === null) return
      if (this.$store.state.timelines === null) return
      if (this.$store.state.timelines[0] === null) return
      var index = this.$store.state.timelines.map(function(e){return e.id}).indexOf(this.$store.state.currentTimeline.id)
      if (index === -1) {
        this.$store.commit('clearCurrentTimeline')
      } else {
        this.$store.commit('setCurrentTimeline',this.$store.state.timelines[index])
      }
    }
  },
  mounted() {
    this.fetchTimelines()
  }
}).$mount('#app')
