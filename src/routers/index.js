import { createRouter,createWebHashHistory } from "vue-router";

const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import('@/views/Home/index.vue'),
  },
  {
    path: '/article',
    name: 'article',
    component: () => import('@/views/Article/index.vue'),
  },
  {
    path: '/boiling',
    name: 'boiling',
    component: () => import('@/views/Boiling/index.vue'),
  },
  {
    path: '/markdown',
    name: 'markdown',
    component: () => import('@/views/MarkDown/index.vue'),
  },
  {
    path: '/code',
    name: 'code',
    component: () => import('@/views/Code/index.vue'),
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
