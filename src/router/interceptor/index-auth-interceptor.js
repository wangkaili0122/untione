/**
 * index页面必须登录才能访问
 * 组件描述
 */

import Vue from 'vue'
import store from 'store/store.js'

/**
 * 进入路由之前的拦截器
 * @param {*} to
 * @param {*} from
 * @param {*} next
 */
const beforeEach = function (to, from, next) {
  if (to.name === Vue.prototype.$project.loginPageName) {
    //在本地登录页判断当前登录类型，如果是sso就跳转到sso登录页面
    if(Vue.prototype.$project.loginType=='sso'){
      Vue.prototype.$login()
    }else if (store.getters['auth/isLogin']()) {
      // 如果目标页面不需要权限，就直接放行
      next({ name: 'home' })
    } else {
      next()
    }
  } else if (!to.meta.auth) {
    next()
  } else if (!store.getters['auth/isLogin']()) {
    //  清空登陆用户信息和菜单数据
    store.commit('CLEAR')
    //  跳转到登录页面
    Vue.prototype.$login()
  } else if (!store.state.auth.pwdChanged) {
    if (to.name === 'first-reset-password') {
      next()
    } else {
      next({ name: 'first-reset-password' })
    }
  } else{
    // 主页只要登录就可以访问，index.html只有两个页面：登录页和主页
    next()
  }
}

/**
 * 离开页面的拦截器
 * @param {Object} to
 * @param {Object} from
 */
const afterEach = function (to, from) {

}

export default {
  install (router) {
    router.beforeEach(beforeEach)
  },
  uninstall (router) {

  }
}
