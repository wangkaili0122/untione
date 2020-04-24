/**
 * 对树结构的数据进行递归寻找符合条件的子节点
 */

/**
 * 根据childrenKey寻找
 * @param data 传入数据
 * @param childrenKey 子节点的key
 * @param expression(data) 判断节点是否符合要求，返回bool类型
 */
const recursion = function (data, childrenKey, expression) {
  var result = null
  if (Array.isArray(data)) {
    for (var n = 0; n < data.length; n++) {
      result = recursion(data[n], childrenKey, expression) || null
      if (result) {
        break
      }
    }
  } else if (expression(data)) {
    result = data
  } else if (data[childrenKey] && Array.isArray(data[childrenKey])) {
    for (var i = 0; i < data[childrenKey].length; i++) {
      result = recursion(data[childrenKey][i], childrenKey, expression) || null
      if (result) {
        break
      }
    }
  }
  return result
}

/**
 * 找到所有符合条件的节点，做成数组
 * @param data
 * @param childrenKey
 * @param expression
 * @constructor
 */
const recursionAll = function (data, childrenKey, expression) {
  var result = []
  if (Array.isArray(data)) {
    for (var n = 0; n < data.length; n++) {
      let rst = recursionAll(data[n], childrenKey, expression) || null
      if (rst.length > 0) {
        result = result.concat(rst)
      }
    }
  } else if (expression(data)) {
    result.push(data)
  }
  if (data[childrenKey] && Array.isArray(data[childrenKey])) {
    for (var i = 0; i < data[childrenKey].length; i++) {
      let rst = recursionAll(data[childrenKey][i], childrenKey, expression) || null
      if (rst.length > 0) {
        result = result.concat(rst)
      }
    }
  }
  return result
}
/**
 * 找到所有符合条件的节点，保留树结构
 * @param data
 * @param childrenKey
 * @param expression
 */
const recursionTree = function (data, childrenKey, expression) {
  if (Array.isArray(data)) {
    var result = []
    data.forEach(item => {
      var rs = recursionTree(item, childrenKey, expression)
      if (rs) {
        result.push(rs)
      }
    })
    return result.length > 0 ? result : null
  } else {
    if (expression(data)) {
      if (data[childrenKey]) {
        data[childrenKey] = recursionTree(data[childrenKey], childrenKey, expression)
        return data
      } else {
        return data
      }
    } else {
      return null
    }
  }
}

/**
 * 检索找到所有符合条件的节点，保留树结构
 * @param data
 * @param childrenKey
 * @param expression
 */
const recursionTreeAll = function (data, childrenKey, expression) {
  // var filterChildren = (item, childrenKey, expression) => {
  //   if(!item) return
  //   var result = []
  //   if(Array.isArray(item)) {
  //     item.map(v => {
  //       if (expression(v)){
  //         if(v[childrenKey]) {
  //           v[childrenKey] = filterChildren(v[childrenKey], childrenKey, expression)
  //           result.push(v)
  //         } else {
  //           return v
  //         }
  //       } else {
  //         return v
  //       }
  //     })
  //     return result
  //   } else {
  //     if (expression(item)) {
  //       return item
  //     } else {
  //       return null
  //     }
  //   }
  // }
  // var result = []
  // if (Array.isArray(data)) {
  //  data.forEach(item => {
  //    let ss = filterChildren(item, childrenKey, expression)
  //    if(ss) {
  //      result.push(ss)
  //    }
  //  })
  //   return result
  // }
  if (Array.isArray(data)) {
    var result = []
    data.forEach(item => {
      var rs = recursionTreeAll(item, childrenKey, expression)
      if (rs) {
        result.push(rs)
      }
    })
    return result.length > 0 ? result : null
  } else {
    if (expression(data)) {
      if (data[childrenKey]) {
        data[childrenKey] = recursionTreeAll(data[childrenKey], childrenKey, expression)
        return data
      } else {
        return data
      }
    } else {
      // return null
      if (data[childrenKey]) {
        data[childrenKey] = recursionTreeAll(data[childrenKey], childrenKey, expression)
        if(data[childrenKey] && data[childrenKey].length>0){
          return data
        }else{
          return null
        }
      } else {
        return null
      }
    }
  }
}

/**
 * 遍历tree结构数据，找到符合条件的数据项，设置新的属性值 或修改某个数字能够值
 * @param that  当前作用域Array
 * @param list  树结构数组Array
 * @param key   需要遍历的键值条件String
 * @param val   键值匹配值
 * @param newKey   需要添加的新属性String，如不需加新属性可为null
 * @param newVal   给新属性设置的值
 * @param childrenKey  遍历的children节点属性名String
 */
const resetTreeList = (that, list, key, val, newKey, newVal, childrenKey) => {
  if (!list) return
  if (list.length > 0) {
    list.map(item => {
      if (item[key] === val) {
        if (newVal) {
          if (newKey) {
            that.$set(item, newKey, newVal)
          } else {
            that.$set(item, val, newVal)
          }
        }
      }
      if (item[childrenKey]) {
        resetTreeList(item[childrenKey])
      }
    })
  }
  return list
}

/**
 * 找出树结构中该节点中及其所有下属节点中的某个属性idKey的值，以数组形式Array输出
 * @param data  树结构数据array || object
 * @param childrenKey  遍历的children节点属性名String
 * @param idKey   需要遍历的键值条件String
 * @param array  存储符合条件的值
 */
const filterTreeData  = (data, childrenKey, idKey, array = []) => {
  if (!data) return
  if(Array.isArray(data)) {
    data.map(item => {
      if (item[idKey] !== undefined ) {
        array.push(item[idKey])
      }
      if(item[childrenKey]) {
        array = filterTreeData(item[childrenKey], childrenKey, idKey, array)
      }
    })
    return array
  } else {
    if (data[idKey] !== undefined) {
      array.push(data[idKey])
    }
    if(data[childrenKey]) {
      array = filterTreeData(data[childrenKey], childrenKey, idKey, array)
    }
    return array
  }
}

export default { recursion, recursionAll, resetTreeList, recursionTree, recursionTreeAll, filterTreeData }
