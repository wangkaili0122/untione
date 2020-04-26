/**
 * 消息状态改变的ids
 */

export default {
  namespaced: true,
  state: {
    msg: ''
  },
  mutations: {
    SET_MSG_IDS (state, data) {
      state.msg = data
    }
  },
  actions: {}
}
