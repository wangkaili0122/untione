/**
 * ajax请求时显示loading模态框
 */

import {
  Loading,
  Notification
} from 'element-ui'

// loading组件的实例对象
var loadinginstace

/**
 * 请求拦截器
 * @param {Object} config
 */
const requestHandler = function (config) {
  // 防止一次请求结束后模态框关闭导致多次请求会刷新多次的问题
  if (config && config.showModal) {
    if (window.loadingCloseTimeOut) {
      clearTimeout(window.loadingCloseTimeOut)
    }
    // element ui Loading方法
    loadinginstace = Loading.service({
      fullscreen: true,
      text: '加载中',
      spinner: 'el-icon-loading',
      background: 'rgba(255, 255, 255, 0.4)'
    })
  }
  return config
}
/**
 * 请求失败拦截器
 * @param {Object} error
 */
const requestErrorHandler = function (error) {
  // Do something with request error
  loadinginstace.close()
  Notification({
    showClose: true,
    duration: 2000, // 弹框显示时间，毫秒
    message: '加载超时!', // 返回 response 里的错误信息
    type: 'error',
    offset: 120
  })
  return Promise.reject(error)
}

/**
 * 响应拦截器
 * @param {Object} response
 */
const responseHandler = function (response) {
  // 防止多次请求模态框刷新多次 即闪屏
  if (loadinginstace) {
    window.loadingCloseTimeOut = setTimeout(
      () => {
        loadinginstace.close()
      }, 200
    )
  }
  return response
}

/**
 * 响应失败拦截器
 * @param {Object} error
 */
const responseErrorHandler = function (error) {
  loadinginstace.close()
  return Promise.reject(error)
}

var loadingRequestInterceptor = null
var loadingResponseInterceptor = null

export default {
  install: (axios) => {
    loadingRequestInterceptor = axios.interceptors.request.use(requestHandler, requestErrorHandler)
    loadingResponseInterceptor = axios.interceptors.response.use(responseHandler, responseErrorHandler)
  },
  uninstall: (axios) => {
    if (loadingRequestInterceptor) {
      axios.interceptors.request.eject(loadingRequestInterceptor)
    }
    if (loadingResponseInterceptor) {
      axios.interceptors.request.eject(loadingResponseInterceptor)
    }
  }
}
