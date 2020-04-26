/**
 * 单点登录ticket拦截器，从URL上判断有无token
 */
import store from '../../store/store'
import {config as projectConfig} from 'plugins/projectConfig'
import hash from "@/utils/hash";


/**
 * 拦截URL中的单点登录票据，存入cookie和store
 */
function ssoTicketInterceptor() {
  //如果是单点登录并且当前配置不是游客模式，初始化系统之前拦截URL判断是否是单点登录回调地址
  if (projectConfig.loginType === 'sso') {
    var path = location.href
    var tokens = path.match(/\?ticket=[a-zA-Z,0-9.\-_?]{10,100}#/)// 正则匹配URL中的token

    if (tokens && tokens[0]) {
      let token = tokens[0].slice(1, tokens[0].length - 1).split('=')[1]

      store.commit('auth/SET_ACCESS_TOKEN', {
        accessToken: token,
        expireTime: new Date().getTime() + 1000 * 60 * 60 * 24
      })// 存储token到cookie中
      //  请求用户信息和菜单
      store.dispatch('auth/afterLogin').then(resp => {
        //  请求成功执行
        let cacheHash =  hash.getCacheHash()
        hash.clearCache()
        window.history.pushState({}, projectConfig.projectName,  window.location.origin + projectConfig.indexPage + '#/')
        window.location.href = window.location.origin + window.location.pathname + '#/' + cacheHash
      }).catch(error => {
        console.error(error)
      })
    }
  }
}

export default {
  install(router) {
    ssoTicketInterceptor()
  },
  uninstall(router) {
  }
}
