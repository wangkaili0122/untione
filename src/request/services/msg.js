/**
 * 消息管理模块接口
 * @author ljn-19555
 * @date 2019-03-20
 */
import url from '../api/msg.js'
import { request } from '../index.js'

/**
 * 获取所有消息
 */
export function GetMsgAll (data) {
  return request({
    url: url.MSG_GET_LIST,
    method: 'post',
    data: data
  })
}
/**
 * 添加消息
 * @param {Object} MsgData
 */
export function AddMsg (MsgData) {
  return request({
    url: url.MSG_ADD,
    method: 'post',
    data: MsgData
  })
}
/**
 * 获取消息详情
 * @param {String} msgId
 */
export function MsgDetail (msgId) {
  return request({
    url: url.MSG_DETAIL,
    method: 'get',
    params: { msgId: msgId }
  })
}
/**
 * 删除消息
 * @param {String} msgId
 */
export function DeleteMsg (msgId) {
  return request({
    url: url.MSG_DELETE,
    method: 'get',
    params: { msgId: msgId }
  })
}
/**
 * 批量删除消息
 * @param {Array} msgIds
 */
export function DeleteMsgBatch (msgIds) {
  return request({
    url: url.MSG_DELETE_BATCH,
    method: 'post',
    data: msgIds
  })
}
/**
 * 消息状态改变
 * @param {String} msgId
 */
export function MsgStatusUpdate (msgId) {
  return request({
    url: url.MSG_STATUS_UPDATE,
    method: 'get',
    params: { msgId: msgId }
  })
}
/**
 * 接收者删除消息
 * @param {String} msgId
 */
export function DeleteReceiveMsg (msgId) {
  return request({
    url: url.MSG_RECEIVE_DELETE,
    method: 'get',
    params: { msgId: msgId }
  })
}
/**
 * 接收者批量删除消息
 * @param {Array} msgIds
 */
export function DeleteReceiveMsgBatch (msgIds) {
  return request({
    url: url.MSG_RECEIVE_DELETE_BATCH,
    method: 'post',
    data: msgIds
  })
}
/**
 * 获取除admin之外的所有用户
 */
export function GetMsgUserList () {
  return request({
    url: url.MSG_GET_USER_LIST,
    method: 'get'
  })
}
