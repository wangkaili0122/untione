/**
 * 保存主页弹出层的页签打开情况和其显示隐藏状态
 */
export default {
  namespaced: true,
  state: {
    appPanelVisibility: false,
    subMenuVisibility: false,
    visitedViews: [],
    selectedViewID: null,
    subMenu: null
  },
  mutations: {
    // appPanel 显隐操作
    SHOW_APP_PANEL: (state) => {
      state.appPanelVisibility = true
    },
    HIDE_APP_PANEL: (state) => {
      state.appPanelVisibility = false
    },
    TOGGLE_APP_PANEL: (state) => {
      state.appPanelVisibility = !state.appPanelVisibility
    },
    // view相关操作。 操作view的唯一途径。 如果有view存在，则必须有被选中的view。
    SELECT_VIEW: (state, viewID) => {
      // todo select不成功，需要向外抛出什么信息？
      state.selectedViewID = viewID
    },
    ADD_VISITED_VIEW: (state, view) => {
      // todo 添加view时，需要对数据进行校验。 如果校验不成功，需要向外抛出什么信息？
      // 1、view是一个对象。 2、view必须包含某些字段：id、name等。 3、判断view是否已经存在，id是否有重复。
      var isInclude = state.visitedViews.find(hasView => hasView.id == view.id)
      // 如果已经打开该页面就不做处理
      if (!view || isInclude) {
        return
      }
      state.visitedViews.push(view)
    },
    DEL_VISITED_VIEW: (state, view) => {
      // todo 删除view不成功，需要向外抛出什么信息？
      let index = state.visitedViews.indexOf(view)
      if (index !== -1) {
        state.visitedViews.splice(index, 1)
      }
    },
    DEL_ALL_VIEW: (state) => {
      state.visitedViews.splice(0, state.visitedViews.length)
    },
    // subMenu 显隐操作
    SHOW_SUBMENU: (state) => {
      state.subMenuVisibility = true
    },
    HIDE_SUBMENU: (state) => {
      state.subMenuVisibility = false
    },
    SELECT_SUBMENU: (state, menu) => {
      state.subMenu = menu
    },
    CLEAR: (state) => {
      state.appPanelVisibility= false
      state.subMenuVisibility= false
      state.visitedViews= []
      state.selectedViewID= null
      state.subMenu= null
    }
  },
  actions: {
    //
    showAppPanel({commit}) {
      commit('SHOW_APP_PANEL')
    },
    hideAppPanel({commit}) {
      commit('HIDE_APP_PANEL')
    },
    toggleAppPanel({commit}) {
      commit('TOGGLE_APP_PANEL')
    },
    //
    selectView({commit}, viewID) {
      commit('SELECT_VIEW', viewID)
    },
    addView({commit}, view) {
      return new Promise(resolve => {
        commit('ADD_VISITED_VIEW', view)
        resolve({
          view
        })
      })
    },
    delView({commit, state}, view) {
      return new Promise(resolve => {
        commit('DEL_VISITED_VIEW', view)
        resolve({
          deletedView: view,
          visitedViews: [...state.visitedViews]
        })
      })
    },
    delAllViews({commit}) {
      return new Promise(resolve => {
        commit('DEL_ALL_VIEW')
        resolve({})
      })
    },
    //
    showSubMenu({commit}) {
      commit('SHOW_SUBMENU')
    },
    hideSubMenu({commit}) {
      commit('HIDE_SUBMENU')
    },
    selectSubMenu: ({commit}, menu) => {
      return new Promise(resolve => {
        commit('SELECT_SUBMENU', menu)
        resolve({})
      })
    }
  }
}
