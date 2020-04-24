/**
 * http状态拦截器
 */
import Vue from 'vue'
import filter603 from './error-filters/603-filter'
import {
  MessageBox,
  Notification
} from 'element-ui'


/**
 * 响应的拦截器
 * @param {Object} response
 */
const responseHandler = function (response) {
  // 对响应数据做些事
  if (response.config.responseType === 'blob' || response.config.responseType === 'arraybuffer') { // 判断返回的是否是二进制流的文件，目前用于下载二进制文件
    if (!response.data) {
      // 接口请求不成功消息弹窗组件
      Notification({
        showClose: true, // 是否显示关闭按钮
        duration: 2000, // 弹框显示时间，毫秒
        message: (!response.data.message || response.data.message.length === 0) ? '请求失败，缺少状态码，请联系管理员！' : response.data.message,
        type: 'error',
        offset: 50
      })
      return
    }
  } else if (response.data && response.data.code && response.data.code.toString() !== '0') {
    // 接口请求不成功消息弹窗组件
    if (response.config.showError){
      Notification({
        showClose: true, // 是否显示关闭按钮
        duration: 2000, // 弹框显示时间，毫秒
        message: (!response.data.message || response.data.message.length === 0) ? '请求失败，缺少状态码，请联系管理员！' : response.data.message,
        type: 'error',
        offset: 120
      })
    }
    return Promise.reject(response.data.message)
  }
  // 请求成功后延长token的过期时间
  //   store.dispatch('auth/freshTokenExpires');
  return response
}
/**
 * 响应失败的拦截器
 * @param {Object} error
 */
const responseErrorHandler = function (error) {
  console.error(error)
  if (typeof error.response === 'undefined') {
    // session失效，请求302重定向时，页面跳转到登录页面
    // store.state.isLogin = false;
    return
  } else if (error.code === 'ECONNABORTED' && error.message.indexOf('timeout') != -1) {
    // 请求超时
  } else if (error && error.response) {
    switch (error.response.status) {
      case 1000:
        error.message = '登录名或密码错误！'
        break
      case 400:
        error.message = '错误请求'
        break
      case 401:
        error.message = '登录超时，请重新登录！'
        return
      case 403:
        error.message = '您没有访问权限！'
        break
      case 404:
        error.message = '请求失败,未找到该资源！'
        break
      case 405:
        error.message = '请求方法未允许'
        break
      case 408:
        error.message = '请求超时'
        break
      case 451:
        //todo 跳转到登录页面
        error.message = '您尚未登录或登录已超时，请登录后重试'
        break
      case 500:
        error.message = '服务器端出错，请联系管理员！'
        break
      case 501:
        error.message = '网络未实现'
        break
      case 502:
        error.message = '网络错误'
        break
      case 503:
        error.message = '服务不可用'
        break
      case 504:
        error.message = '网络超时'
        break
      case 505:
        error.message = 'http版本不支持该请求'
      case 600:
        error.message = '600'
        break
      case 602:
        error.message = 'token为验证异常，请重新登录'
      case 603:
        return filter603(error)
        error.message = '身份认证超期，请重新登录'
        break
      default:
        error.message = `连接错误${error.response.status}`
    }
  } else {
    Promise.reject(error.message)
    error.message = '连接到服务器失败'
  }
  // 根据配置判断是否需要显示错误提示
  if (error.config.showError) {
    // 接口报错消息弹窗组件
    Notification({
      title: '警告',
      message: error.message,
      type: 'warning',
      offset: 120
    })
  }

  return Promise.reject(error)
}

var statusresponseInterceptor = null

export default {
  install: (axios) => {
    statusresponseInterceptor = axios.interceptors.response.use(responseHandler, responseErrorHandler)
  },
  uninstall: (axios) => {
    if (statusresponseInterceptor) {
      axios.interceptors.request.eject(statusresponseInterceptor)
    }
  }
}
