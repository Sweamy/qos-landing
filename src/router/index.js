import { createRouter, createWebHistory } from 'vue-router'
import Landing from '../components/Landing.vue'

const routes = [
  { path: '/', component: () => import('../components/Quiz.vue') },
  { path: '/quiz', redirect: '/' },
  { path: '/landing', component: Landing },
  { path: '/privacy', component: () => import('../components/PrivacyPolicy.vue') },
  { path: '/terms', component: () => import('../components/TermsOfUse.vue') },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 }
  },
})

export default router
