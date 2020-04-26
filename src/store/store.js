import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'
import cachePlugin from './plugins/cache'
import sessionCachePlugin from './plugins/sessionCache'

import vuexModules from './modules/index'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {},
  mutations: {
    CLEAR (state) {
    }
  },
  actions: {},
  modules: vuexModules,
  strict: process.env.NODE_ENV !== 'production', // 开发模式不启用严格模式
  plugins: [
    createPersistedState({
      // 定义需要缓存状态的模块
      paths: [
        'auth',
        'user',
        'permission',
        'theme',
        'dict',
        'menu',
        'msg'
      ]
    }),
    cachePlugin(),
    sessionCachePlugin({paths:['home']})
  ]
})
