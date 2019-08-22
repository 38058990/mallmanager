import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/components/login/'
import Home from '@/components/home/'
import Users from '@/components/users'
import Right from '@/components/rights/right/'
import Role from '@/components/rights/role/'
import { homedir } from 'os';

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/login',
      name: 'login',
      component: Login
    },{
      path: '/',
      name: 'home',
      component: Home,
      children:[{
        path: '/users',
        name: 'users',
        component: Users
      },{
        path: '/right',
        name: 'right',
        component: Right
      },{
        path: '/role',
        name: 'role',
        component: Role
      }]
    }
  ]
})
