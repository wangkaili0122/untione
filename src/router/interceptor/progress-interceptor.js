/**
 * 页面加载时显示进度条
 */

import NProgress from 'nprogress'
import 'nprogress/nprogress.css'// progress bar style

/**
 * 进入路由之前的拦截器
 * @param {*} to
 * @param {*} from
 * @param {*} next
 */
const beforeEach = function (to, from, next) {
  NProgress.start();
  next();
}

/**
 * 离开页面的拦截器
 * @param {Object} to
 * @param {Object} from
 */
const afterEach = function (to, from) {
  NProgress.done();
}

export default {
  install(router) {
    router.beforeEach(beforeEach);
    router.afterEach(afterEach);
  },
  uninstall(router) {
  }
}
