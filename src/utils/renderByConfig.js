/**
 * 根据配置文件生成vue组件内容
 */

export default {
  /**
   * 该方法已废弃
   * @param Vue
   * @param createElement (createElement())
   * @param config 配置信息
   * @param target 内容要挂载的目标选择器 '#id','.class
   * @returns {*}
   */
  render (Vue, createElement, config, target) {
    if (config.isSimple) {

      let construct = Vue.extend({
        data () {
          return {
            data: { name: 'this is a test data' }
          }
        },
        created () {
          this.$http({
            url: config.url
          }).then(resp => {
            this.$set(this.$data, 'data', resp[config.data])
          }).catch(error => {
            console.error(error)
          })
          // this.$set(this.$data, 'data',{})
        },
        render (h) {
          let html = config.template
          let matchs = config.template.match(/\$\{[a-zA-Z.]+}/g)

          matchs.forEach(item => {
            console.log(this.$data)
            let keyNames = item.replace('$', '').replace('{', '').replace('}', '').split('.')
            let value = null
            keyNames.forEach(key => {
              if (value) {
                value = value[key]
              } else {
                value = this.$data[key]
              }
            })
            html = html.replace(item, value)
          })
          return h('span', { domProps: { innerHTML: html } })
        }
      })
      let comp = new construct()
      comp.$mount(target)
    } else {
      let construct = Vue.extend(config)
      let comp = new construct()
      comp.$mount(target)
    }
  },

  /**
   * 根据模板和数据生成html
   * @param data
   * @param expression
   */
  structExpression (data, expression) {
    try {
      let html = expression
      let matchs = expression.match(/\$\{[a-zA-Z._0-9\-\[\]'"]+}/g)
      let myData = Object.assign({}, data)
      myData.data = data
      window.customRenderData=data

      if (matchs) {
        matchs.forEach(item => {
          let keyNames ='customRenderData.'+ item.slice(2, -1)
          html = html.replace(item, eval(keyNames))
        })
      }
      delete window.customRenderData
      return html
    } catch (e) {
      console.error(e)
      return ''
    }
  }
}
