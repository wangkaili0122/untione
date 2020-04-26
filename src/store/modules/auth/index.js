/**
 * 管理用户登录状态和token
 */

import Auth from 'utils/auth.js'
import {
  Login,
  Logout,
  RefreshToken
} from 'request/services/login.js'

import { GetUserInfo, UserPwdChanged } from 'request/services/user.js'
import { GetHasRightMenus } from 'request/services/menu.js'
import axios from 'axios'

export default {
  namespaced: true,
  state: {
    isLogin: false,
    accessToken: '',
    refreshToken: '',
    pwdChanged: false
  },
  mutations: {
    SET_ACCESS_TOKEN (state, token) {
      if (token && token.accessToken && token.accessToken.length > 0) {
        state.isLogin = true
        state.accessToken = token.accessToken
        Auth.setToken(token.accessToken, token.expireTime)
        Auth.setLoginStatus(token.expireTime)
      } else {
        state.isLogin = false
        state.accessToken = ''
        state.refreshToken = ''
        Auth.clear()
      }
    },
    SET_REFRESH_TOKEN (state, token) {
      if (token && token.refreshToken && token.refreshToken.length > 0) {
        state.refreshToken = token.refreshToken
        Auth.setRefreshToken(token.refreshToken, token.expireTime)
      } else {
        state.isLogin = false
        state.accessToken = ''
        state.refreshToken = ''
        Auth.clear()
      }
    },
    SET_PWD_CHANGED (state, value){
      state.pwdChanged = value
    },
    CLEAR (state) {
      state.isLogin = false
      state.accessToken = ''
      Auth.clear()
    }
  },
  actions: {
    // 登录操作，返回promise，允许调用该方法的时候使用回调函数
    login: ({
              commit,
              dispatch,
              getters,
              rootGetters
            }, {
              loginName,
              password,
              rememberMe,
              showError
            }) => {
      return new Promise((resolve, reject) => {
        Login({
          loginName,
          password,
          rememberMe
        }).then(resp => {
          // todo 获取用户信息后设置缓存,如果是本地登录，就设置双token，单点登录在sso-interceptor.js里面只设置access-token使用单token
          var tokenInfo = resp.data
          commit('SET_ACCESS_TOKEN', { accessToken: tokenInfo['accessToken'], expireTime: tokenInfo['expireTime'] })
          commit('SET_REFRESH_TOKEN', {
            refreshToken: tokenInfo['refreshToken'],
            expireTime: (new Date(tokenInfo['expireTime']).getTime() + 1000 * 60 * 60 * 12)
          })
          // 请求登录用户的个人信息 和 登录用户的权限信息
          axios.all([GetUserInfo(), UserPwdChanged()]).then(([userResp, pwdResp]) => {
            // 用户个人信息
            var userInfo = userResp.data.data
            commit('user/SET_USER_INFO', userInfo, { root: true })
            // 用户是否修改初始密码
            var pwdChanged = pwdResp.data.data
            commit('SET_PWD_CHANGED', pwdChanged)
            if (pwdChanged) {
              axios.all([GetHasRightMenus()]).then(([permResp]) => {
                // 权限信息存储
                var perms = permResp.data.data
                commit('permission/SET_PERM', perms, { root: true })
                resolve()
              }).catch(error => {
                reject(error)
              })
            } else {
              window.top.location.href = '/index.html#/firstResetPassword'
            }
            resolve(resp)
          })

          /* dispatch('afterLogin').then(response => {
             resolve(resp)
           }).catch(error => {
             reject(error)
           })*/
        }).catch(error => {
          console.error(error)
          reject(error)
        })
      })
    },
    // 登出系统，清理缓存
    logout ({
              commit,
              dispatch
            }) {
      return new Promise((resolve, reject) => {
        Logout().then(resp => {
          // 清理本地缓存，比如登录状态和权限等
          // commit('CLEAR')
          commit('CLEAR', null, { root: true })
          resolve(resp)
        }).catch(error => {
          reject(error)
        })
      })
    },
    afterLogin: ({
                   commit,
                   dispatch
                 }) => {
      return new Promise((resolve, reject) => {
        // 请求登录用户的个人信息 和 登录用户的权限信息
        axios.all([GetUserInfo(),  UserPwdChanged()]).then(([userResp, pwdResp]) => {
          // 用户个人信息
          var userInfo = userResp.data.data
          commit('user/SET_USER_INFO', userInfo, { root: true })
          // 用户是否修改初始密码
          var pwdChanged = pwdResp.data.data
          commit('SET_PWD_CHANGED', pwdChanged)
          if (pwdChanged) {
            axios.all([GetHasRightMenus()]).then(([permResp]) => {
              // 权限信息存储
              var perms = permResp.data.data
              commit('permission/SET_PERM', perms, { root: true })
              resolve()
            }).catch(error => {
              reject(error)
            })
          } else {
            window.top.location.href = '/index.html#/firstResetPassword'
          }
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },
    refreshToken: ({ commit, dispatch }) => {
      return new Promise((resolve, reject) => {
        RefreshToken().then(resp => {
          resolve(resp)
        }).catch(error => {
          reject(error)
        })
      })
    }
  },
  getters: {
    isLogin: () => {
      return () => {
        // 从cookie里面读取登陆状态，避免登录超时cookie失效后state和cookie不一致的问题
        return Auth.isLogin()
      }
    },
    getToken: () => {
      return () => {
        return Auth.hasToken()
      }
    }
  }
}
