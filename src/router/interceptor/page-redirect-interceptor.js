/**
 * 拦截url里面的?page={routerName}参数跳转到正确的页面
 */

/**
 * 进入路由之前的拦截器
 * @param {*} to
 * @param {*} from
 * @param {*} next
 */
const beforeEach = function (to, from, next) {
  if (to.fullPath.indexOf('?') < 0) {
    next()
    return
  }
  var params = to.fullPath.split('?').slice(-1)[0]
  var pageParam = params.split('&').find(item => {
    return item.indexOf('page=') >= 0
  })
  if (pageParam) {
    var routerName = pageParam.split('=').slice(-1)[0]
    next({ name: routerName })
  } else {
    next()
  }
}

export default {
  install (router) {
    router.beforeEach(beforeEach)
  },
  uninstall (router) {
  }
}
