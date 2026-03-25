import { createRouter, createWebHistory } from 'vue-router'
import Landing from '../components/Landing.vue'

function getSessionCookie() {
  const match = document.cookie.match(/(?:^|;\s*)sid=([^;]*)/)
  return match ? decodeURIComponent(match[1]) : null
}

async function isLoggedIn() {
  const sid = getSessionCookie()
  if (!sid || sid === 'Guest') return false

  try {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 3000)
    const res = await fetch('/api/method/frappe.auth.get_logged_user', {
      signal: controller.signal,
    })
    clearTimeout(timeout)
    const data = await res.json()
    return data.message && data.message !== 'Guest'
  } catch {
    return false
  }
}

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

router.beforeEach(async (to) => {
  if (to.path !== '/') return true
  if (await isLoggedIn()) {
    window.location.href = '/lms/practice/sat'
    return false
  }
  return true
})

export default router
