<!--
    /**
     * 使用路由缓存实现tab页面，非tab模式不显示页签
     * 左侧为菜单栏，动态获取数据渲染
     * 右侧为内容区域
     */
-->
<template>
  <el-container class="app-container">
    <el-header v-if="showMenu" class="headerContainer">
      <main-header></main-header>
    </el-header>
    <el-container style="height: 100%;">
      <!-- 左侧菜单栏 -->
      <el-aside class="aside" :style="asideWidth" v-if="showMenu">
        <main-menu :default-active="activedMenu" :collapse="miniMenu"></main-menu>
      </el-aside>
      <!-- 右侧主要内容区域 -->
      <el-main class="main">
        <el-container class="main-container">
          <!-- 头部导航栏 -->
          <el-header v-if="showMenu" class="header-container" :height="titleHeight">
            <div class="navbar">
              <span @click="setMiniMenu" class="miniIcon">
                <i class="el-icon-menu"></i>
              </span>
              <div style="display:inline-block;padding-left:10px;">
                <bread-nav></bread-nav>
              </div>
            </div>
            <div class="tabsbar" v-if="$project.tabModel">
              <tabs-view></tabs-view>
            </div>

          </el-header>
          <!-- 主题内容区域 -->
          <el-main>
            <!--判断是否为tab模式-->
            <template v-if="$project.tabModel">
              <keep-alive :include="cachedViews">
                <router-view :key="key"/>
              </keep-alive>
            </template>
            <router-view v-else/>
          </el-main>
        </el-container>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
  import mainMenu from 'views/main/main-menu.vue'
  import department from 'views/system/department/department.vue'
  import { GetHasRightMenus } from 'request/services/menu.js'
  import BreadNav from "@/components/bread-nav";
  import TabsView from "@/views/main/tabs-view";
  import mainHeader from 'views/main/header.vue'

  export default {
    name: 'window',
    components: {
      TabsView,
      BreadNav,
      mainMenu,
      mainHeader
    },
    data () {
      return {
        miniMenu: false
      }
    },
    created () {
    },
    mounted () {
      // 解决在IE11上无法用router-link和a标签跳转问题，主要是当url的hash change的时候浏览器没有做出反应。里面主要是做了一个兼容。
      // 这个兼容就是当检测到浏览器为IE的时候，手动给url加一个hashchange事件。
      function checkIE(){
        return '-ms-scroll-limit' in document.documentElement.style && '-ms-ime-align' in document.documentElement.style
      }
      if (checkIE()) {
        window.addEventListener('hashchange', () => {
          var currentPath = window.top.location.hash.slice(1);
          if (this.$route.path !== currentPath) {
            this.$router.push(currentPath)
          }
        }, false)
      }
    },
    methods: {
      setMiniMenu () {
        this.miniMenu = !this.miniMenu
      },
    },
    computed: {
      asideWidth () {
        return {
          width: this.miniMenu ? '65px' : '240px'
        }
      },
      menus () {
        return this.$store.getters['permission/menus']
      },
      activedMenu(){
        return this.$store.state.menu.selectedMenuId
      },
      showMenu () {
        return window.top === window
      },
      titleHeight(){
        return this.$project.tabModel?'80px':'40px'
      },
      cachedViews() {
        return this.$store.state.tabs.cachedViews
      },
      key() {
        return this.$route.fullPath
      }
    }
  }

</script>

<style scoped lang="stylus">
  .app-container {
    height: 100%;
    width: 100%;

    position relative;
    .headerContainer{
      padding 0
    }
    .aside {
      transition-duration 0.3s transition-property width
    }

    .main {
      height 100%
      padding 0px
      .miniIcon {
        padding 5px
        cursor pointer
        color #9b9b9b
        &:hover {
          color #494949
        }
      }
      .main-container {
        height 100%
        .header-container{
          height 80px
          padding 0px
          .navbar{
            padding 0 20px
            line-height:40px;
            border-bottom:solid 1px #e6e6e6
          }
          .tabsbar{
            height 40px
            width 100%
          }
        }

      }
    }
  }

</style>
<style lang="stylus">
  .app-container{
    .el-tabs__nav-wrap.is-top{
      box-sizing border-box
      padding 0 20px
    }
    .el-tabs__header.is-top{
      margin 0
    }
    .el-main{
      .personal-center{
        background-color: #f4f4f4;
        width:90%;
      }
    }

  }

</style>
