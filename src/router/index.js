import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/components/login/'
import Home from '@/components/home/'
import Users from '@/components/users'
import Right from '@/components/rights/right/'
import Role from '@/components/rights/role/'
import goodsList from '@/components/goods/goodslist/'
import goodsAdd from '@/components/goods/goodsadd/'
import Cateparams from '@/components/goods/goodscate/'
import Categories from '@/components/goods/categories/'
import { homedir } from 'os'
import { MessageBox, Message } from 'element-ui'

Vue.use(Router)

const router =  new Router({
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
        path: '/rights',
        name: 'rights',
        component: Right
      },{
        path: '/roles',
        name: 'roles',
        component: Role
      },{
        path: '/goods',
        name: 'goods',
        component: goodsList
      },{
        path: '/goodsadd',
        name: 'goodsadd',
        component: goodsAdd
      },{
        path: '/params',
        name: 'params',
        component: Cateparams
      },{
        path: '/categories',
        name: 'categories',
        component: Categories
      }]
    }
  ]
})

//在路由配置生效之前，统一判断token
//路由守卫，在路由配置前生效
//路由/导航  守卫
//to ->要去的路由配置
//from  当前的路由配置
//Login home ->login to 就是 login from

router.beforeEach((to, from, next) => {
  if (to.path === '/login') {

    next()
  }else{
    const token = sessionStorage.getItem("token");
    if (!token) {
      if (to.path !== '/login') {
        Message.warning('请先登录')
        router.push({ name: "login" })
        return
      }
    }
  }
  
  next()
})

export default router