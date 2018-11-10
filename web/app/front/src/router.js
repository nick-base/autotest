import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
import Auto from './views/Auto.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/project/:project',
      name: 'project',
      component: Auto
    },
    {
      path: '/sub/:project/:sub',
      name: 'sub',
      component: Auto
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "about" */ './views/About.vue')
    }
  ]
})
