/**
 * 603身份认证超期重新登录
 * 拦截ajax请求的603错误
 */

import API from 'request/api/login'
import store from 'store/store'
import Auth from 'utils/auth'
import { request } from 'request/index'
import { Notification,MessageBox } from 'element-ui'
import Vue from 'vue'

export default function (error) {
  //如果是sso单点登录，就不验证refreshtoken
  if(Vue.prototype.$project.loginType==='sso'){
    store.commit('CLEAR')
    if (window.showLoginOverTimeTips) { // 避免多次跳转和多次清理缓存
    } else {
      window.showLoginOverTimeTips = true

      MessageBox.alert('身份认证超期，即将跳转到登录页。','登录超时',{
        type:'error',
        callback: action => {
          window.showLoginOverTimeTips = false
          Vue.prototype.$login()
        }
      })
    }
    return Promise.reject(error)
  }
  //  先判断refreshToken是否存在，如果存在就刷新token，如果不存在就跳转到登录页面
  //  判断是不是refreshtoken请求返回的603，如果是，就清理缓存跳转到登录页
  else if (error.config.url.indexOf(API.REFRESH_TOKEN) > 0) {
    window.refreshTokening = false
    // 跳转到登录页  先清除本地登陆状态
    if (window.showLoginOverTimeTips) { // 避免多次跳转和多次清理缓存
    } else {
      window.showLoginOverTimeTips = true
      setTimeout(() => {
        window.showLoginOverTimeTips = false
      }, 2000)
      store.dispatch('auth/Logout').then(resp => {
        Vue.prototype.$login({})
        Notification({
          title: '警告',
          message: '登录超时，请重新登录！',
          type: 'warning',
          offset: 50,
          duration: 2000
        })
      })
    }
    return Promise.reject(error)
  } else {
    // 重新请求token,清理已经超期的token
    if (!window.refreshTokening) {
      store.commit('auth/REMOVE_ACCESS_TOKEN')
      window.refreshTokening = true
      // 记录这次401请求，并设置flag避免多次调用该方法去请求
      return store.dispatch('auth/refreshToken').then(resp => {
        //  重新发送上一次请求
        window.refreshTokening = false
        return request.request(error.config)
      })
    } else {
      // 第一个401需要去重新请求token，其他的设置timeout重新请求
      let promis = new Promise(resolve => {
        setTimeout(() => {
          resolve()
        }, 200)
      })
      // 如果当前refreshtoken未超期，就重新发送401失败的请求，refreshtoken超期返回失败信息，避免一直刷新

      return promis.then(() => {
        if (Auth.hasRefreshToken()) {
          return request.request(error.config)
        } else {
          return Promise.reject(error)
        }
      })
    }
  }
}
