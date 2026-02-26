import { createRouter, createWebHistory } from 'vue-router'
import Landing from '../components/Landing.vue'

const routes = [
  { path: '/', component: Landing },
  { path: '/quiz', component: () => import('../components/Quiz.vue') },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 }
  },
})

export default router
