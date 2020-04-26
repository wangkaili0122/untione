/**
 * 存储登录用户基本信息
 */
//研发超管的角色ID，用于判断当前 用户是否为研发超管
const adminRoleId = 1
export default {
  namespaced: true,
  state: {
    'userId': '',
    'userName': '',
    'deptName': '',
    'postNames': [],
    'roleNames': [],
    'roleIds': [],
    'email': '',
    'phoneNumber': '',
    'avatar': '',
    'sex': '1',
    'userNum': ''
  },
  mutations: {
    SET_USER_INFO: function (state, user) {
      Object.keys(user).forEach(key => {
        state[key] = user[key]
      })
    },
    CLEAR: function (state) {
      state.userId = ''
      state.userName = ''
      state.deptName = ''
      state.postNames = []
      state.roleNames = []
      state.email = ''
      state.phoneNumber = ''
      state.avatar = ''
      state.sex = '1'
      state.userNum = ''
    }
  },
  actions: {},
  getters: {
    //判断当前用户是否为研发超管
    isAdmin: (state, getters, rootState, rootGetters) => {
      return state.roleIds.includes(adminRoleId)
    }
  }
}
