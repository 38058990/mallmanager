// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import '@/assets/css/reset.css'
import MyHttpServer from '@/plugins/http.js'
import moment from 'moment'
import myBread from '@/components/cuscom/myBread.vue'

//elementUI
Vue.use(ElementUI)
Vue.use(MyHttpServer)


//解决重复点击路由报错情况
import Router from 'vue-router'

const originalPush = Router.prototype.push
Router.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}

//注册全局面包屑组件
Vue.component(myBread.name,myBread)
Vue.config.productionTip = false

Vue.filter('fmtdate',(v) => {
  return moment(v).format('YYYY-MM-DD')
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
