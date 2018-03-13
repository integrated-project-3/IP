import Vue from 'vue/dist/vue.js'
import app from './app.vue'
import BootstrapVue from 'bootstrap-vue'
import VueRouter from 'vue-router'

Vue.use(BootstrapVue)
Vue.use(VueRouter)

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
  routes
})

// try and fail to turn off productionTip
Vue.config.productionTip = false;

new Vue({
  render: h => h(app),
  router
}).$mount('#app')
