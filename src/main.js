import Vue from 'vue/dist/vue.js'
import app from './app.vue'
import BootstrapVue from 'bootstrap-vue'
import VueRouter from 'vue-router'
import Vuex from 'vuex'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import axios from 'axios'


Vue.use(BootstrapVue)
Vue.use(VueRouter)
Vue.use(Vuex)

Vue.config.productionTip = false

var timelines = []

/*
  Calls AWS API which invokes a lambda function.
  The lambda calls the ideagen API and modifies some of the data before returning it.
*/
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

// vuex store

const store = new Vuex.Store({
  state: {
    timelines: timelines
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
    }
  },
  getters: {
    selectedTimelines: (state) => {
      return state.timelines.filter(timeline => timeline.selected)
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
      return new Promise((resolve, reject) => {
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
          resolve()
        })
        .catch(error => {
          console.log(error)
          reject()
        })
      })
    },
    deleteSelectedTimelines({ state }) {
      return new Promise((resolve) => {
        for (var i = state.timelines.length-1; i >= 0; i--) {
          var timeline = state.timelines[i]
          if (timeline.selected === true) {
            this.dispatch('deleteTimeline', timeline.id)
          }
        }
        resolve()
      })
    }
  }
})

// set up routes

import aRegister from './components/register/register.vue'
import aTimeline from './components/timeline/timeline.vue'

const routes = [
  {
    name: 'REGISTER',
    path: '/',
    component: aRegister
  },
  {
    name: 'TIMELINE',
    path: '/timeline',
    component: aTimeline
  }
]

const router = new VueRouter({
  mode: 'history',
  routes
})

new Vue({
  render: h => h(app),
  router,
  store
}).$mount('#app')
