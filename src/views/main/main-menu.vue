<!--
    /**
     * 使用iframe嵌入的子页面
     * 左侧为菜单栏，动态获取数据渲染
     * 右侧为内容区域
     */
-->

<script>
  import recursion from 'utils/recursion'
  export default {
    name: 'main-menu',
    props: {
      // menuUrl 和 menus只传递一个即可，代码判断如果menus有值就用menus，没有就使用menuUrl获取菜单数据
      menuUrl: {
        type: String,
        default () {
          return null
        }
      },
      defaultActive: {
        required: true,
        type: String,
        default () {
          return ''
        }
      },
      collapse: {
        type: Boolean,
        default () {
          return false
        }
      }
    },
    data () {
      return {
        menus: [],
        defaultOpeneds: []
      }
    },
    // 通过代码生成模板
    render (createElement) {
      return createElement('div', { class: 'menuContainer' },
        [createElement('el-menu', {
          on: {
            select: this.handleSelect
          },
          props: {
            defaultActive: this.defaultActive,
            defaultOpeneds: this.defaultOpeneds,
            backgroundColor: 'rgb(247, 247, 247)',
            textColor: '#303133',
            // backgroundColor: '#545c64',
            // textColor: '#fff',
            // activeTextColor: '#ffd04b',
            collapse: this.collapse
          }
        }, this.structMenu(createElement, this.menus))]
      )
    },
    created () {
      this.menus = this.$store.getters['permission/menus']
      this.menus.forEach(menu => {
        if (menu.childrenList && menu.childrenList.length > 0) {
          this.defaultOpeneds.push(menu.menuId)
        }
      })
    },
    methods: {
      getMenus () {
      },
      handleSelect (key, keyPath) {
        // 根据当前选中菜单的ID和当前菜单id路径，找到当前菜单对应的路由名称和当前菜单路径的中文名

        var selectedMenu = recursion.recursion(this.$store.getters['permission/menus'], 'childrenList', (menu) => menu.menuId == key);


        this.$router.push({
          name: selectedMenu.webUrl,
        })
      },
      structMenu (createElement, menus) {
        if (!(menus instanceof Array)) {
          return createElement('el-menu-item',
            { attrs: { index: String(menus.menuId) } },
            [createElement('i', { class: menus.icon + ' iconfont' }),
              createElement('span', { class: 'title', slot: 'title' }, menus.menuName)])
        } else {
          var menuElements = []
          menus.forEach(menu => {
            if (menu.childrenList && menu.childrenList.length > 0) {
              menuElements.push(
                createElement(
                  'el-submenu',
                  { props: { index: String(menu.menuId)  } },
                  [].concat(
                    createElement('template', { slot: 'title' },
                      [
                        createElement('i', { class: menu.icon + ' iconfont' }),
                        createElement('span', { class: 'title', slot: 'title' }, menu.menuName)
                      ]
                    ),
                    this.structMenu(createElement, menu.childrenList)
                  )
                )
              )
            } else {
              menuElements.push(this.structMenu(createElement, menu))
            }
          })
          return menuElements
        }
      }
    }

  }

</script>
<style lang="stylus" scoped>
  .menuContainer {
    height 100%
    overflow-x hidden
    overflow-y auto
    ul {
      height 100%
      .iconfont{
        /*color #d9d9d9*/
      }
      .title{
        margin-left 10px
      }
    }
  }

</style>
