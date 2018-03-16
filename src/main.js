import Vue from 'vue/dist/vue.js'
import app from './app.vue'
import BootstrapVue from 'bootstrap-vue'
import VueRouter from 'vue-router'

Vue.use(BootstrapVue)
Vue.use(VueRouter)

Vue.config.productionTip = false

import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

// set up routes

import aRegister from './components/register/register.vue'
import aTimeline from './components/timeline/timeline.vue'

const routes = [
  { name: 'REGISTER', path: '/', component: aRegister},
  { name: 'TIMELINE', path: '/timeline', component: aTimeline}
]

const router = new VueRouter({
  mode: 'history',
  routes
})

new Vue({
  render: h => h(app),
  router
}).$mount('#app')
