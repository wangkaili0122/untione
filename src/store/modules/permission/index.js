/**
 * 保存用户的权限信息，并提供判断页面和操作是否拥有权限的功能
 */
import Vue from 'vue'
import Recursion from 'utils/recursion.js'

export default {
  namespaced: true,
  state: {
    permission: []
  },
  mutations: {
    /**
     * 存储用户权限信息
     */
    SET_PERM: (state, data) => {
      state.permission = data
    },
    CLEAR: (state, data) => {
      state.permission = []
    }
  },
  actions: {
  },
  getters: {
    hasPagePerm: (state, getters) => {
      /**
       * 查询用户是否拥有指定页面的访问权限
       * @param {String} page
       */
      return (page) => {
        // 开发版且权限控制开关关闭时，不进行判断。发布版必须进行权限控制
        if (process.env.NODE_ENV === 'development' && !Vue.prototype.$project.permission) {
          return true
        }
        //  判断是否拥有页面权限
        var permPage = Recursion.recursion(state.permission, 'childrenList', (data) => data.webUrl === page)
        return permPage
      }
    },
    hasBtnPerm: (state, getters) => {
      /**
       * 查询指定你页面的指定按钮 是否有操作权限
       * @param {String} page
       * @param {String} btnPerm
       */
      return (page, btnPerm) => {
        // 开发版且权限控制开关关闭时，不进行判断。发布版必须进行权限控制
        if (process.env.NODE_ENV === 'development' && !Vue.prototype.$project.permission) {
          return true
        }
        //  判断是否拥有页面的按钮权限
        var permPage = getters['hasPagePerm'](page)
        if (permPage && permPage.childrenList && Array.isArray( permPage.childrenList)) {
          var result = permPage.childrenList.find(btn => btn.funcIds.indexOf(btnPerm) >= 0)
          return result
        } else {
          return null
        }
      }
    },
    menus: (state, getters) => {
      var menus = Recursion.recursionTree(JSON.parse(JSON.stringify(state.permission)), 'childrenList', (data) => data.menuType === 'C' && data.visible == 0)
      // console.log('menus',menus)
      return menus || []
    }
  }
}
