/**
 * 匹配get请求的URL，把params参数替换到URL里面
 * url='sys/user/{userId}' params={userId:'01'} 匹配后为url='sys/user/01'
 */

const compileHandler = function (config) {
  var url = config.url
  var params = config.params
  //   如果不是get请求，或者URL里面没有动态参数，就直接返回
  if (config.method.toLowerCase() !== 'get' || url.indexOf('{') < 0) {
    return config
  }
  //   如果URL里面有动态参数但是params里面没有，就报错提示
  if (!(params && Object.keys(params).length > 0)) {
    console.error('get请求缺少动态参数！')
    return config
  }
  // 处理URL里面参数表达式替换为参数，并从params里面删除已经替换过的key
  Object.keys(params).forEach(key => {
    if (url.indexOf('{' + key + '}') >= 0) {
      url = url.replace('{' + key + '}', params[key])
      delete params[key]
    }
  })
  config.url = url
  config.params = params
  return config
}

var compileInterceptor = null

export default {
  install: (axios) => {
    compileInterceptor = axios.interceptors.request.use(compileHandler)
  },
  uninstall: (axios) => {
    if (compileInterceptor) {
      axios.interceptors.request.eject(compileInterceptor)
    }
  }
}
