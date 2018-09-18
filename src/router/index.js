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
var GetBasicMessage = resolve => require(['../components/basic/GetBasicMessage.vue'], resolve)  
//作品管理
var GetProductListIndex = resolve => require(['../components/product/GetProductListIndex.vue'], resolve)  
var productDetail = resolve => require(['../components/product/productDetail.vue'], resolve)  
var productcomment = resolve => require(['../components/product/productcomment.vue'], resolve)  
//财务管理
var TimesRechargeOrderIndex = resolve => require(['../components/financemanager/TimesRechargeOrderIndex.vue'], resolve)  
var VipsRechargeOrderIndex = resolve => require(['../components/financemanager/VipsRechargeOrderIndex.vue'], resolve)  
var MatchOrderIndex = resolve => require(['../components/financemanager/MatchOrderIndex.vue'], resolve)  
var GetWithdrawIndex = resolve => require(['../components/financemanager/GetWithdrawIndex.vue'], resolve)  
//用户管理
var GetUserIndex = resolve => require(['../components/user/GetUserIndex.vue'], resolve)  
var GetUserIndexDetail = resolve => require(['../components/user/GetUserIndexDetail.vue'], resolve)  
//审核管理
var ProductExamineIndex = resolve => require(['../components/examine/ProductExamineIndex.vue'], resolve)  
var ProductExamineDetail = resolve => require(['../components/examine/ProductExamineDetail.vue'], resolve)  
var UserExamineIndex = resolve => require(['../components/examine/UserExamineIndex.vue'], resolve)  
//平台管理
var GetInvestmentIndex = resolve => require(['../components/back/GetInvestmentIndex.vue'], resolve)  
var SysMesList = resolve => require(['../components/back/SysMesList.vue'], resolve)  
var GetFeedbackList = resolve => require(['../components/back/GetFeedbackList.vue'], resolve)  

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
        { path: '/GetBasicMessage', component: GetBasicMessage, name: '基本信息' },
        // 作品管理
        { path: '/GetProductListIndex', component: GetProductListIndex, name: '作品列表' },
        { path: '/product/productDetail/:id', component: productDetail, name: '作品详情' },
        { path: '/product/productcomment/:id', component: productcomment, name: '作品评论' },
        //财务管理
        { path: '/TimesRechargeOrderIndex', component: TimesRechargeOrderIndex, name: '次数充值列表' },        
        { path: '/VipsRechargeOrderIndex', component: VipsRechargeOrderIndex, name: '会员充值列表' },        
        { path: '/MatchOrderIndex', component: MatchOrderIndex, name: '匹配订单' },        
        { path: '/GetWithdrawIndex', component: GetWithdrawIndex, name: '提现明细' },        
        //用户管理
        { path: '/GetUserIndex', component: GetUserIndex, name: '用户列表' },                
        { path: 'user/GetUserIndexDetail/:id', component: GetUserIndexDetail, name: '用户详情' },                
        //审核管理
        { path: '/ProductExamineIndex', component: ProductExamineIndex, name: '作品审核列表' },                
        { path: 'examine/ProductExamineDetail/:id', component: ProductExamineDetail, name: '作品审核详情' },                
        { path: '/UserExamineIndex', component: UserExamineIndex, name: '认证审核列表' },        
        //平台管理
        { path: '/GetInvestmentIndex', component: GetInvestmentIndex, name: '广告列表' },                                      
        { path: '/SysMesList', component: SysMesList, name: '系统公告' },                                      
        { path: '/GetFeedbackList', component: GetFeedbackList, name: '帮助与反馈' },                                      
    ]
    },
  ]
})
