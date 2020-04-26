/**
 * 工作台模块接口
 * @author ljn-19555
 * @date 2019-03-15
 */
import url from '../api/workspace.js'
import { request } from '../index.js'

/**
 * 获取消息列表
 */
export function GetMsg (data) {
  return request({
    url: url.MSG_LIST,
    method: 'post',
    data: data
  })
}
/**
 * 获取消息公告列表
 */
export function GetNewsList (data) {
  return request({
    url: url.NEWS_LIST,
    method: 'post',
    data: data
  })
}
/**
 * 常用应用展示
 */
export function CommonAppShow (data) {
  return request({
    url: url.COMMON_APP_SHOW,
    method: 'post',
    data: data
  })
}
/**
 * 常用应用设置
 */
export function CommonAppInstall (data) {
  return request({
    showModal: false,
    url: url.COMMON_APP_INSTALL,
    method: 'post',
    data: data
  })
}
/**
 * 常用链接展示
 */
export function CommonLinkShow (data) {
  return request({
    url: url.COMMON_LINK_SHOW,
    method: 'post',
    data: data
  })
}
/**
 * 常用链接设置
 */
export function CommonLinkInstall (data) {
  return request({
    url: url.COMMON_LINK_INSTALL,
    method: 'post',
    data: data
  })
}
/**
 * 个人信息-用户详情
 * */
export function  GetUserDetail(data) {
  return request({
    url: url.PERSONAL_USER_DETAIL,
    method: 'get',
    data: data
  })
}
/**
 * 个人信息-用户信息保存
 * */
export function UserInfoUpdate (data) {
  return request({
    url: url.PERSONAL_UPDATE_USER,
    method: 'post',
    data: data
  })
}
