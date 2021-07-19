import { createRouter, createWebHistory } from 'vue-router'
import Main from '@/views/Main.vue'

const routes = [
  { path: '/', name: 'Main', component: Main },
  { path: '/match/:id', name: 'Match info', component: () => import('@/views/Match.vue') }
]

const router = createRouter({
	base: '/dist/',
	history: createWebHistory(process.env.BASE_URL),
	routes
})

export default router
