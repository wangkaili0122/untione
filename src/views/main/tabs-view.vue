<!--
     /**
      * 页签组件
      * @desc 主页面的页签组件，实现页签形式打开页面
      * @example 调用示例
      *  <tabs-view></tabs-view>
      */
       -->
<template>
  <div class="tabs-view-container">
    <el-tabs v-model="selectedTab" @tab-click="selectView" @tab-remove="closeSelectedView">
      <!--<el-tab-pane label="主页" name="personal-center"></el-tab-pane>-->
      <el-tab-pane v-for="tab in Array.from(visitedViews)"
                   :name="tab.name"
                   :key="tab.name"
                   :closable="!tab.isDefault">
        <span slot="label"  @contextmenu.prevent="openMenu(tab,$event)" class="tabTitle">{{tab.title}}</span>
      </el-tab-pane>
    </el-tabs>

    <ul v-show="visible" :style="{left:left+'px',top:top+'px'}" class="contextmenu">
      <li @click="refreshSelectedTab(selectedTab)">刷新页签</li>
      <li @click="closeSelectedTab(selectedTab)">关闭页签</li>
      <li @click="closeOthersTabs">关闭其他</li>
      <li @click="closeAllTabs">关闭所有</li>
    </ul>
  </div>
</template>

<script>
  export default {
    name: 'tabs-view',
    data() {
      return {
        visible: false,
        top: 0,
        left: 0,
      }
    },
    mounted() {
      this.addViewTabs()
    },
    methods: {
      generateRoute() {
        if (this.$route.name) {
          var route = {
            name: this.$route.name,
            fullPath: this.$route.fullPath,
            path: this.$route.path,
            meta: JSON.parse(JSON.stringify(this.$route.meta)),
            params: JSON.parse(JSON.stringify(this.$route.params)),
            query: JSON.parse(JSON.stringify(this.$route.query)),
          }
          route.meta.title = this.$store.state.menu.selectedMenuNamePath.slice(-1)[0]
          return route
        }
        return false
      },
      isActive(route) {
        return route.name === this.$route.name
      },
      selectView(tab) {
        this.$router.push({name: tab.name})
      },
      closeSelectedView(tab) {
        this.closeSelectedTab({name: tab})
      },
      addViewTabs() {
        const route = this.generateRoute()
        if (!route) {
          return false
        }
        this.$store.dispatch('tabs/addView', route)
      },
      //切换到当前页签
      moveToCurrentTab() {
        // const tags = this.$refs.tag
        // this.$nextTick(() => {
        //   for (const tag of tags) {
        //     if (tag.to.path === this.$route.path) {
        //       this.$refs.scrollPane.moveToTarget(tag.$el)
        //
        //       // when query is different then update
        //       if (tag.to.fullPath !== this.$route.fullPath) {
        //         this.$store.dispatch('tabs/updateVisitedView', this.$route)
        //       }
        //
        //       break
        //     }
        //   }
        // })
      },
      refreshSelectedTab(view) {
        if(typeof(view)=='string'){
          view={name:view}
        }
        view = this.$store.getters['tabs/getVisitedView'](view)
        this.$store.dispatch('tabs/delCachedView', view).then(() => {
          const {name} = view
          this.$nextTick(() => {
            this.$router.replace({
              name: name,
              query:{
                t: Date.now()
              }
            })
          })
        })
      },
      closeSelectedTab(view) {
        if(typeof(view)=='string'){
          view={name:view}
        }
        this.$store.dispatch('tabs/delView', view).then(({visitedViews}) => {
          if (this.isActive(view)) {
            const latestView = visitedViews.slice(-1)[0]
            if (latestView) {
              this.$router.push(latestView.isDefault ? {name: latestView.name} : latestView)
            } else {
              this.$router.push('/')
            }
          }
        })
      },
      closeOthersTabs() {
        this.$router.push(this.selectedTag)
        this.$store.dispatch('tabs/delOthersViews', this.selectedTag).then(() => {
          this.moveToCurrentTab()
        })
      },
      closeAllTabs() {
        this.$store.dispatch('tabs/delAllViews')
        this.$router.push('/')
      },
      openMenu(tab, e) {
        this.visible = true
        this.selectedTag = tab
        const offsetLeft = this.$el.getBoundingClientRect().left // container margin left
        // this.left = e.clientX - offsetLeft + 15 // 15: margin right
        this.left = e.clientX + 15 // 15: margin right
        this.top = e.clientY
      },
      closeMenu() {
        this.visible = false
      }
    },
    computed: {
      visitedViews() {
        return this.$store.state.tabs.visitedViews
      },
      selectedTab: {
        get() {
          return this.$route.name
        },
        set() {
        }
      }
    },
    watch: {
      $route(val) {
        this.addViewTabs()
        this.moveToCurrentTab()
      },
      visible(value) {
        if (value) {
          document.body.addEventListener('click', this.closeMenu)
        } else {
          document.body.removeEventListener('click', this.closeMenu)
        }
      }
    }
  }
</script>

<style scoped lang="stylus">
  .tabs-view-container {
    height: 40px;
    width: 100%;
    background: #fff;
    box-shadow: 0 1px 3px 0 rgba(0, 0, 0, .12), 0 0 3px 0 rgba(0, 0, 0, .04);
    span.tabTitle{
      display inline-block
    }
    .contextmenu {
      margin: 0;
      background: #fff;
      z-index: 100;
      position: absolute;
      list-style-type: none;
      padding: 5px 0;
      border-radius: 4px;
      font-size: 12px;
      font-weight: 400;
      color: #333;
      box-shadow: 2px 2px 3px 0 rgba(0, 0, 0, .3);
      li {
        margin: 0;
        padding: 7px 16px;
        cursor: pointer;
        &:hover {
          background: #eee;
        }
      }
    }
  }
</style>
