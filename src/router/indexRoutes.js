/**
 * 构造路由，添加路由拦截器
 */
import Vue from 'vue'
import Router from 'vue-router'
import authInterceptor from './interceptor/index-auth-interceptor.js'
import progressInterceptor from './interceptor/progress-interceptor.js'
import ssoInterceptor from './interceptor/sso-interceptor'

import login from 'views/login.vue'

Vue.use(Router)
const router = new Router({
  routes: [
    {
      path: '/login',
      name: 'login',
      component: login
    },
    {
      path: '/firstResetPassword',
      name: 'first-reset-password',
      component: () => import('views/home/first-reset-password.vue'),
      meta: {
        auth: true,
        keepAlive: false
      }
    },
    {
      path: '/changePassword',
      name: 'change-password',
      component: () => import('views/home/change-password.vue'),
      meta: {
        auth: true,
        keepAlive: false
      }
    },
    {
      path: '/',
      name: 'home',
      component: () => import('views/home'),
      meta: {
        auth: true,
        keepAlive: false
      }
    },
    {
      path: '/resetPassword',
      name: 'reset-password-page',
      component: () => import('views/reset-password/reset-password-page'),
      meta: {
        auth: false,
        keepAlive: false
      }
    },
    {
      path: '/myMessageDetail',
      component: () => import('@/views/home/components/personalCenter/work-item/my-message-detail.vue'),
      name: 'my-message-detail',
      meta: {
        auth: true,
        keepAlive: false
      }
    },
    {
      path: '/newsNoticeDetail',
      component: () => import('@/views/home/components/personalCenter/work-item/news-notice-detail.vue'),
      name: 'news-notice-detail',
      meta: {
        auth: true,
        keepAlive: false
      }
    },
    {
      path: '*', /* 路由匹配不到的就跳转到404页面 */
      redirect: {path: '/'},
      meta: {
        auth: false,
        showInMenu: false
      }
    }
  ]
})

// 给路由添加拦截器
ssoInterceptor.install(router)
authInterceptor.install(router)
progressInterceptor.install(router)
export default router
