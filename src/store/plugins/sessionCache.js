/**
 * 把首页页签的状态存储到sessionstorage里面
 * 用以实现刷新保留状态，关闭清理状态
 * 使用方式在store的plugins里面添加sessionstorage({paths:[modulesName])
 */
import merge from 'deepmerge'

export default function ({paths}) {
  let key = 'vuexCache'
  return store => {
    if (window.top == window) {
      let savedState = JSON.parse(window.sessionStorage.getItem(key))
      if (savedState) {
        store.replaceState(merge(store.state, savedState, {
          arrayMerge: function (store, saved) {
            return saved
          },
          clone: false,
        }));
      }

      //侦听store里面状态的更改
      store.subscribe((mutation, state) => {
        //判断要更改的是否是paths里面的模块state
        let index = paths.indexOf(mutation.type.split('/')[0])
        if (index >= 0) {
          let saveState = {}
          paths.forEach(path => {
            if (store.state[path]) {
              saveState[path] = store.state[path]
            }
          })
          window.sessionStorage.setItem(key, JSON.stringify(saveState))
          saveState = null
        }
      })
    }
  }
}
