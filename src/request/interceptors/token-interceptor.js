/**
 * 在请求中添加token
 */
import Auth from 'utils/auth.js'
import url from '../api/login.js'

const tokenHandler = function (config) {
  // 让每个请求携带token-- ['Authorization']为自定义key 请根据实际情况自行修改
  var token = Auth.hasToken()
  if (config.url !== url.LOGIN && token) { // 在这个地方如果使用store.getters获取不到token
    config.headers['access-token'] = token
  }
  return config
}

var tokenInterceptor = null

export default {
  install: (axios) => {
    tokenInterceptor = axios.interceptors.request.use(tokenHandler)
  },
  uninstall: (axios) => {
    if (tokenInterceptor) {
      axios.interceptors.request.eject(tokenInterceptor)
    }
  }
}
