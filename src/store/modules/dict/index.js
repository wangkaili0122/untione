/**
 * 字典缓存
 * 可以查询某个字典项下面的字典值列表
 * 不清理缓存，每次刷新页面都重新获取并覆盖当前值
 */

export default {
  namespaced: true,
  state: {
    dicts: {}
  },
  mutations: {
    SET_DICTS (state, data) {
      Object.keys(data).forEach(key => {
        state.dicts[key] = data[key]
      })
    },
    // 允许前端动态增加字典项
    ADD_DICT (state, data) {
      let newDicts = {}
      newDicts[data.dictType] = data.dictValues
      state.dicts = Object.assign(newDicts, state.dicts)
      // state.dicts[data.dictType] = data.dictValues
    }
  },
  actions: {},
  getters: {
    // 根据字典类型返回字典数据
    getDictType: state => {
      return (dictType) => {
        if (state.dicts && state.dicts[dictType]) {
          return state.dicts[dictType]
        } else {
          console.warn('字典数据未加载或者没有找到该字典项的数据！')
          return []
        }
      }
    },
    // 根据字典类型和字典label获取字典值
    getDictDataValue: (state, getters, rootState, rootGetters) => {
      return (dictType, dictLabel) => {
        var dictDatas = getters['getDictType'](dictType)
        var dictData = dictDatas.find(dictData => dictData.dictType === dictLabel)
        if (dictData) {
          return dictData.dictValue
        } else {
          console.warn('没有找到指定的字典数据(' + dictType + '-' + dictLabel + ')')
          return null
        }
      }
    },
    // 根据字典类型和字典值获取字典label
    getDictDataLabel: (state, getters, rootState, rootGetters) => {
      return (dictType, dictValue) => {
        var dictDatas = getters['getDictType'](dictType)
        var dictData = dictDatas.find(dictData => dictData.dictValue == dictValue)
        if (dictData) {
          return dictData.dictLabel
        } else {
          console.warn('没有找到指定的字典数据(' + dictType + '-' + dictValue + ')')
          return null
        }
      }
    }
  }
}
