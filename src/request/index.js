import Axios from 'axios'
import loadingInterceptor from './interceptors/loading-interceptor'
import tokenInterceptor from './interceptors/token-interceptor'
import statusInterceptor from './interceptors/status-interceptor'
import urlCompileInterceptor from './interceptors/url-compile-interceptor'
import 'plugins/dynamicServerIP.js'
import { config as projectConfig } from '@/plugins/projectConfig'

const axios = Axios.create({
  baseURL: projectConfig.serverUrl, // 'http://localhost:8089', // globals.serverUrl, // api的base_url
  timeout: 20000, // request timeout
  responseType: 'json',
  withCredentials: false, // 是否允许带cookie这些
  headers: {
    // 'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
    'Content-Type': 'application/json;charset=utf-8',
    'X-Requested-With': 'XMLHttpRequest'
  },
  showModal: true, // 显示loading的配置，默认true显示，false不显示
  showError: true // 是否弹框显示ajax请求的错误信息，如果为false，就不显示
})

// 加载axios拦截器
tokenInterceptor.install(axios)
loadingInterceptor.install(axios)
statusInterceptor.install(axios)
urlCompileInterceptor.install(axios)

// 对axios的实例重新封装成一个plugin ,方便 Vue.use(xxxx)
export default {
  install: function (Vue, Option) {
    Object.defineProperty(Vue.prototype, '$http', {
      value: axios
    })
  }
}
// 抛出接口请求方法，方便一些不依赖vue的组件调用
export const request = axios
