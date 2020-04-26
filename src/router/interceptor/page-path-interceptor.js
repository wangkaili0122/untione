/**
 * 在进入路由页面之前解析当前页面的逻辑路径(在菜单中的路径)，把路径标识和中文名称等存入缓存
 */
import recursion from 'utils/recursion'
import store　from 'store/store'
/**
 * 目标页面组件渲染前的最后一道路由
 * @param {*} to
 * @param {*} from
 * @param {*} next
 */
const beforeResolve = function (to, from, next) {
  try{
    let path = []
    let currentMenu=null
    if (to.fullPath === "/") {
      path.push({menuId:'-1',menuName:'首页',webUrl:'main'})
    } else {
      currentMenu = recursion.recursion(store.state.permission.permission, 'childrenList', (menu) => menu.webUrl === to.name)
      path.push(currentMenu)
      // 循环找到所有父节点
      while (currentMenu && currentMenu.parentId != 0) {
        currentMenu = recursion.recursion(store.state.permission.permission, 'childrenList', (menu) => menu.menuId === currentMenu.parentId)
        path.push(currentMenu)
      }
      path.reverse()
    }

    let routePath = to.fullPath
    store.commit('menu/SET_SELECTED_MENU', path.slice(-1)[0].webUrl)
    store.commit('menu/SET_CURRENT_PAGE_PATH', routePath)

    store.commit('menu/SET_SELECTED_MENU_ID',String( path.slice(-1)[0].menuId))
    store.commit('menu/SET_SELECTED_MENU_ID_PATH', path.map(item => item.menuId))
    var selectedMenuNamePath = path.map(item => item.menuName)
    store.commit('menu/SET_SELECTED_MENU_NAME_PATH', selectedMenuNamePath)
  }catch (e) {
    console.error(e)
  }finally {
    next()
  }
}

export default {
  install (router) {
    router.beforeResolve(beforeResolve)
  },
  uninstall (router) {
  }
}
