/**
 * 构造路由，添加路由拦截器
 */
import Vue from 'vue'
import Router from 'vue-router'
import authInterceptor from './interceptor/auth-interceptor.js'
import progressInterceptor from './interceptor/progress-interceptor.js'
import pageRedirectInterceptor from './interceptor/page-redirect-interceptor'
import systemRouter from './modules/system.js'
import personalCenterRouter from './modules/personalCenter.js'
import ssoInterceptor from './interceptor/sso-interceptor'
import pagePathInterceptor from './interceptor/page-path-interceptor'

Vue.use(Router)
const router = new Router({
  routes: [
    ...systemRouter,
    ...personalCenterRouter
  ]
})

// 给路由添加拦截器
ssoInterceptor.install(router)
pageRedirectInterceptor.install(router)
authInterceptor.install(router)
progressInterceptor.install(router)
pagePathInterceptor.install(router)
export default router
