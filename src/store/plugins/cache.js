/**
 * 缓存管理插件，用于自动触发所有模块的缓存清理方法
 * 清理缓存只需要触发store里面的清理方法就可以清理各个子模块的清理方法
 * 需要自动清理缓存的模块只需要在mutations里面添加CLEAR 方法即可
 */
import vuexModules from '../modules/index'

export default function cachePlugin (socket) {
  return store => {
    store.subscribe((mutation, state) => {
      if (mutation.type !== 'CLEAR') {
        return
      }
      Object.keys(vuexModules).forEach(key => {
        if (vuexModules[key].mutations && vuexModules[key].mutations.CLEAR) {
          store.commit(key + '/CLEAR')
        }
      })
    })
  }
}
