/**
 * 所有store的模块都必须引入这里，作为模块的统一出口
 */
import auth from './auth'
import permission from './permission'
import theme from './theme'
import home from './home'
import dict from './dict'
import user from './user'
import menu from './menu'
import msg from './msg'
import tabs from './tabs'

export default {
  permission,
  auth,
  theme,
  home,
  dict,
  user,
  menu,
  msg,
  tabs
}
