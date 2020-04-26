/**
 * 判断用户是否有页面权限，决定是进入页面还是跳转到登录页等
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

  //如果目标页面为本地登录页，但当前配置是sso登录，就跳转到sso登录页
  if(to.name==='login' && Vue.prototype.$project.loginType==='sso'){
    Vue.prototype.$login()
  }
  if (!to.meta.auth) {
    // 如果目标页面不需要权限，就直接放行
    next()
    return
  }
  // 需要权限的，没登录就先登录
  if (!store.getters['auth/isLogin']()) {
    //  清空登陆用户信息和菜单数据
    store.commit('CLEAR')
    //  跳转到登录页面
    Vue.prototype.$login()
  } else {
    if (!store.state.auth.pwdChanged) {
      // 如果登录用户没有修改初始密码
      window.top.location.href = '/index.html#/firstResetPassword'
      return
    }
    //   判断用户是否具有目标页面的访问权限
    var hasPagePerm = store.getters['permission/hasPagePerm'](to.name)
    if (hasPagePerm) {
      next()
    } else {
      //  已经登录，但没有权限的页面，要提示您没有目标页面的访问权限
      Vue.prototype.$alert('您没有该页面的访问权限！', '提示', { type: 'warning' })
    }
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
