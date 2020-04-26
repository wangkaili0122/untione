/**
 * 保存用户选择的皮肤
 */

export default {
  namespaced: true,
  state: {
    theme: 'default'
  },
  mutations: {
    SET_THEME (state, data) {
      state.theme = data
    }
  },
  actions: {}
}
