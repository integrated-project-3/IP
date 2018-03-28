import VueRouter from 'vue-router'
import aRegister from './components/register/register.vue'
import aTimeline from './components/timeline/timeline.vue'
import aEvent from './components/event/event.vue'

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
  },
  {
    name: 'EVENT',
    path: '/event',
    component: aEvent
  }
]

const router = new VueRouter({
  mode: 'history',
  routes
})

export default router
