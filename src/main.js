import Vue from 'vue/dist/vue.js'
import App from './App.vue'
import BootstrapVue from 'bootstrap-vue'
import VueRouter from 'vue-router'

Vue.use(BootstrapVue)
Vue.use(VueRouter)

import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

// set up routes

import Register from './components/Register.vue'
import Timeline from './components/Timeline.vue'

const routes = [
  { name: 'REGISTER', path: '/', component: Register},
  { name: 'TIMELINE', path: '/timeline', component: Timeline}
]

const router = new VueRouter({
  routes
})

// try and fail to turn off productionTip
Vue.config.productionTip = false;

new Vue({
  render: h => h(App),
  router
}).$mount('#app')
