/**
 * 把简单数据类型构建成树结构
 */
import recursion from './recursion'


/**
 * 把简单结构的数据构建为tree结构的数据
 * @param {Array} data
 * @param {String} idKey
 * @param {String} parentKey
 * @param {String} childrenKey 构建时子节点的key
 * @returns {any}
 */
function struct(data, idKey, parentKey, childrenKey) {
  let result = JSON.parse(JSON.stringify(data))

  for (var i = result.length - 1; i >= 0; i--) {
    let current = result[i]
    let target = recursion.recursion(result, childrenKey, (item) => item[idKey] === current[parentKey]);
    if (target) {
      target[childrenKey] = target[childrenKey] || []
      target[childrenKey].push(current)
      result.splice(i, 1)
    }
  }
  return result
}

export default struct
