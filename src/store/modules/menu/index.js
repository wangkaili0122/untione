/**
 * 菜单状态，存储当前路由匹配到的菜单名称
 */

const state = {
  selectedMenu: '',
  selectedMenuId:'',
  selectedMenuIdPath:[],
  selectedMenuNamePath:[],
  currentPagePath: ''// 当前页面路径
}

const mutations = {
  SET_SELECTED_MENU: (state, data) => {
    state.selectedMenu = data
  },
  SET_SELECTED_MENU_ID: (state, data) => {
    state.selectedMenuId = data
  },
  SET_SELECTED_MENU_ID_PATH: (state, data) => {
    state.selectedMenuIdPath = data
  },
  SET_SELECTED_MENU_NAME_PATH: (state, data) => {
    state.selectedMenuNamePath = data
  },
  SET_CURRENT_PAGE_PATH: (state, data) => {
    state.currentPagePath = data || ''
  }
}

const actions = {}
const getters = {}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}
