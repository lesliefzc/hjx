import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'
Vue.use(VueRouter)
const routes: Array<RouteConfig> = [
  {
    path: '/',
    redirect:"/login",
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('../views/user/login.vue')
  },
  {
    path: '/index',
    name: 'index',
    redirect: '/home',
    component: () => import('../views/index/mainTabbar.vue'),
    children:[
      {
        path: '/home',
        name: 'home',
        component: () => import('../views/index/index.vue'),
      },
      {
        path: '/account',
        name: 'account',
        component: () => import('../views/index/account.vue'),
      },
      {
        path: '/car',
        name: 'car',
        component: () => import('../views/index/car.vue'),
      },
      {
        path: '/goods',
        name: 'goods',
        component: () => import('../views/index/goods.vue'),
      },
      {
        path: '/dynamicSales',
        name: 'dynamicSales',
        component: () => import('../views/index/dynamicSales.vue'),
      },
      {
        path: '/templateOrder',
        name: 'templateOrder',
        component: () => import('../views/index/templateOrder.vue'),
      },
    ]
  },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
