/**
 * 一个自动寻找父亲页面的方法
 */

/**
 * 寻找组件的第一个为page的父级组件（即其所属的页面）
 * @param {VueComponent} firstVueParent
 * @return {VueComponent}
 */
var findParentPage = (firstVueParent) => {
  let found = false

  while (!found && firstVueParent.$root !== firstVueParent) {
    if (firstVueParent.$data.isPage == undefined || !firstVueParent.$data.isPage) {
      firstVueParent = firstVueParent.$parent
    } else {
      found = true
    }
  }
  return firstVueParent
}

export default findParentPage
