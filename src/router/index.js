import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'

// 路由页面导入
import login from '@/components/Login.vue'
import home from '@/components/Home.vue'
import error from '@/components/404.vue'  //404错误
// import manage from '@/components/manage/manage.vue'
var manage = resolve => require(['@/components/manage/manage.vue'], resolve)

var role = resolve => require(['@/components/role/role.vue'], resolve)
var roleLimit = resolve => require(['@/components/role/roleLimit.vue'], resolve)
var power = resolve => require(['../components/role/power.vue'], resolve)

// 平台基本信息
var CommissionSet = resolve => require(['../components/common/CommissionSet.vue'], resolve)   
var FreightFormworkList = resolve => require(['../components/common/FreightFormworkList.vue'], resolve)

// 分类管理
var FirstLevelList = resolve => require(['../components/classification/FirstLevelList.vue'], resolve)
var SecondLevelList = resolve => require(['../components/classification/SecondLevelList.vue'], resolve)


// 懒加载方式，当路由被访问的时候才加载对应组件
Vue.use(Router)

export default new Router({
  // mode:'history',
  routes: [
    {
      path: '/login',
      name: '登录',
      component: login
    },
    {
      path: '/',
      name: '首页',
      component: home,
      children: [
        // 404
        { path: '/error', component: error, name: '404页' },
        // manage
        { path: '/manage', component: manage, name: '管理员管理', },
        // role
        { path: '/role', component: role, name: '权限管理' },
        { path: '/power', component: power, name: '角色管理' },
        { path: '/role/rolelimit/:id', component: roleLimit, name: '权限设置' },
        // 平台基本信息
        { path: '/CommissionSet', component: CommissionSet, name: '佣金设置' }, 
        { path: '/FreightFormworkList', component: FreightFormworkList, name: '运费模板' }, 
        // 分类管理
        { path: '/FirstLevelList', component: FirstLevelList, name: '一级分类' }, 
        { path: '/SecondLevelList/:id', component: SecondLevelList, name: '二级分类' }, 
    ]
    },
  ]
})
