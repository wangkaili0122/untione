<template>
  <div class="home">
    <!--背景模糊，需要对外层div进行处理-->
    <blur-background :is-blur="isBlur">
      <div class="container">
        <!--header-->
        <div class="header">
          <div class="logo">
            <a href="#" style="cursor: default">
              <img :src="logoImg" @error="logoImgError"/>
            </a>
            <span class="minijian" style="font-size:20px;font-family: 微软雅黑;margin-left:10px">
                {{$project.projectName}}
            </span>
            <!--<div class="title"></div>-->
          </div>
          <!--
            <el-popover
              placement="bottom"
              :visible-arrow="true"
              popper-class="mainDropdownMenu"
              trigger="manual"
              v-if="servicesShow"
              v-model="servicesVisible">
              <top-menu :menus="servicesData"
                        @mainMenuClick="topMenuClick"
                        v-on:mouseover.native="onmouseenter($event,'services')"
                        v-on:mouseout.native="onmouseleave($event,'services')"></top-menu>
              <div class="item"
                   :class="{'item-slected': curModule===3}"
                   @click.stop="switchModule(3)" slot="reference"
                   v-on:mouseover="onmouseenter($event,'services')"
                   v-on:mouseout="onmouseleave($event,'services')">
                服务中心
              </div>
            </el-popover>
          </div>-->
          <dropdown-menu class="navs-tabs">
            <dropdown-menu-item>
              <div class="item" :class="{'item-slected': curModule===0}" @click.stop="switchModule(0)">
                个人中心
              </div>
            </dropdown-menu-item>
            <dropdown-menu-item v-if="platformAppsLength>0" :show-drop-down="$store.state.home.appPanelVisibility">
              <div class="item" :class="{'item-slected': curModule===1}" @click.stop="switchModule(1)"
                   v-on:mouseover="onmouseenter($event,'platform')"
                   v-on:mouseout="onmouseleave($event,'platform')">
                平台管理
              </div>
              <top-menu :menus="platformApps" slot="dropdown"
                        @mainMenuClick="topMenuClick"
                        v-on:mouseover.native="onmouseenter($event,'platform')"
                        v-on:mouseout.native="onmouseleave($event,'platform')"></top-menu>

            </dropdown-menu-item>
            <dropdown-menu-item :show-drop-down="$store.state.home.appPanelVisibility">
              <top-menu :menus="applicationData" slot="dropdown"
                        @mainMenuClick="topMenuClick"
                        v-on:mouseover.native="onmouseenter($event,'app')"
                        v-on:mouseout.native="onmouseleave($event,'app')"></top-menu>
              <div class="item"
                   :class="{'item-slected': curModule===2}"
                   @click.stop="switchModule(2)"
                   v-on:mouseover="onmouseenter($event,'app')"
                   v-on:mouseout="onmouseleave($event,'app')">
                应用中心
              </div>
            </dropdown-menu-item>
          </dropdown-menu>
          <div class="navs-right">
            <!--<div class="item">登录</div>-->
            <!--<div class="item">消息</div>-->
            <!--<div class="item" >-->
            <!--</div>-->
            <!--检索-->
            <transition name="el-fade-in-linear">
              <i v-show="this.curModule==3" class="iconfont icon-search" @click.stop="openSearchPanel()" title="检索"></i>
            </transition>
            <!--皮肤-->
            <i class="iconfont icon-pifu" @click="themeVisible=!themeVisible" title="更换皮肤"
               style="font-weight: bolder"></i>
            <!--打开/关闭tab页签对话框-->
            <i class="el-icon-menu" :class="{'has-app': visitedViews.length > 0}" @click.stop="toggleAppPanel()"
               title="打开/隐藏窗口"></i>
            <!--退出登录-->
            <!--            <i class="iconfont icon-logout"  @click="logout" title="退出登录"></i>-->
            <!-- 头像和用户名-->
            <div class="userInfo">
              <el-popover
                placement="bottom"
                width="130"
                trigger="hover"
                :visible-arrow="false"
                :popper-class="$store.state.home.appPanelVisibility? 'userInfoDropdown' : 'userInfoDropdown_APP' ">
                <div slot="reference">
                  <span class="avatar">
                    <img v-if="$store.state.user.avatar != ''"
                         :src="$store.state.user.avatar.indexOf('base64')>=0?$store.state.user.avatar:($project.serverUrl +'/'+ $store.state.user.avatar)"
                         alt="" class="user-avatar" @error="userImgError"/>
                    <img v-if="$store.state.user.avatar == ''" src="@/assets/img/touxiang.jpg" alt=""
                         class="user-avatar"/>
                  </span>
                  <span class="user" :title="$store.state.user.userName">{{$store.state.user.userName}}</span>
                  <i class="el-icon-arrow-down el-icon--right" style="margin-left: -5px"></i>
                </div>
                <div class="dropMenu" @click="goto('personal')"><i
                  class="icon-jiaosexiugai iconfont menu-icon"></i><span>个人信息</span></div>
                <div class="dropMenu" @click="goto('password')"><i class="icon-shezhi-tianchong iconfont menu-icon"></i><span>修改密码</span>                </div>
                <!--<div class="dropMenu" @click="goto('version')"><i class="icon-banben iconfont menu-icon"></i><span>关于</span>                </div>-->
                <div class="divide"></div>
                <div class="dropMenu" @click="logout"><i class="iconfont icon-logout menu-icon"></i><span>退出登录</span>
                </div>
              </el-popover>
            </div>
          </div>
        </div>
        <!--main-->
        <div class="main">
          <!--三个模块视图-->
          <swiper class="swiper-container" ref="moduleSwiper" :options="swiperOption">
            <swiper-slide>
              <div class="content">
                <personal-center :personCenterTab="personCenterTab"/>
              </div>
            </swiper-slide>
            <swiper-slide>
              <div class="content">
                <platform-management @getData="platformGetData"/>
              </div>
            </swiper-slide>
            <swiper-slide>
              <div class="content">
                <application-center @getData="applicationGetData"/>
              </div>
            </swiper-slide>
            <swiper-slide>
              <div class="content">
                <services ref="service" @getData="servicesGetData" @openSearchPanel="openSearchPanel"/>
              </div>
            </swiper-slide>
          </swiper>
          <!--上层应用页视图-->
          <transition name="custom-classes-transition"
                      enter-active-class="animated zoomIn durationTimeIn"
                      leave-active-class="animated zoomOut durationTimeOut">
            <app-panel v-show="appPanelVisibility"/>
          </transition>
        </div>
      </div>
    </blur-background>
    <!--上层弹出层 submenu-->
    <transition name="custom-classes-transition"
                enter-active-class="animated fadeIn durationFadeIn"
                leave-active-class="animated fadeOut durationFadeOut">
      <div class="mask" v-if="subMenuVisibility">
        <subMenu/>
      </div>
    </transition>
    <!--换肤组件-->
    <theme :visible.sync="themeVisible"></theme>
    <!--检索面版-->
    <el-dialog :visible.sync="searchShow" :fullscreen="true" :append-to-body="true" :modal="false"
               custom-class="searchPanel">
      <search v-if="searchShow" @close="closeSearchPanel" @collection="collectionService"
              @collectionCancel="collectionCancelService"></search>
    </el-dialog>

    <version :visible.sync="versionVisible"></version>
  </div>
</template>

<script>
  import 'assets/animate.css'
  import personalCenter from './components/personalCenter/personal-center.vue'
  import PlatformManagement from './components/platformManagement'
  import applicationCenter from './components/applicationCenter'
  import services from './components/services/services'
  import appPanel from './components/appPanel'
  import subMenu from './components/subMenu'
  import BlurBackground from './components/blurBackground'
  import TopMenu from '@/views/home/components/top-menu'
  import Theme from '@/views/home/components/theme'
  import Search from '@/views/home/components/search'
  import { AppVisitCount } from 'request/services/app'
  import logo from '../../assets/img/logo/logo.png'
  import defaultPersonalImg from '@/assets/img/touxiang.jpg'
  import DropdownMenu from '@/views/home/components/dropdown-menu/dropdown-menu'
  import DropdownMenuItem from '@/views/home/components/dropdown-menu/dropdown-menu-item'
  import Version from '@/views/system/version/index'
  export default {
    name: 'home1',
    components: {
      DropdownMenu,
      DropdownMenuItem,
      Search,
      Theme,
      TopMenu,
      BlurBackground,
      personalCenter,
      PlatformManagement,
      applicationCenter,
      appPanel,
      subMenu,
      services,
      Version
    },
    data: function () {
      return {
        curModule: 0,
        swiperOption: {
          observer: true,
          observeParents: true,
          observeSlideChildren: true,
          allowTouchMove: false
        },
        platformApps: [],
        platformAppsLength: 0,
        platformShow: true,
        servicesData: [],
        applicationData: [],
        personalCenterVisible: false,
        platformVisible: false,
        appVisible: false,
        servicesVisible: false,
        themeVisible: false,
        searchShow: false,
        personCenterTab: '',
        applicationShow: true,
        servicesShow: false,

        versionVisible:false
      }
    },
    created () {
      //进入该页面后判断二级页面对话框显示状态，如果是打开，就隐藏掉
      // 避免打开二级页面弹出框后刷新页面，弹框依然存在的问题
      if (this.$store.state.home.subMenuVisibility) {
        this.$store.commit('home/HIDE_SUBMENU')
      }
    },
    methods: {
      switchModule (index) {
        this.curModule = index
        this.swiper.slideTo(index, 500, false)
        this.$store.dispatch('home/hideAppPanel')
      },
      toggleAppPanel () {
        // 如果没有打开的应用，则提示不能打开。
        if (this.visitedViews.length === 0) {
          this.$alert('当前没有打开的应用!', '提示', { type: 'warning' })
          return
        }
        this.$store.dispatch('home/toggleAppPanel')
      },
      platformGetData (data) {
        this.platformApps = data || []
        this.platformAppsLength = this.platformApps.length
      },
      servicesGetData (data) {
        this.servicesData = data || []
      },
      applicationGetData (data) {
        this.applicationData = data || []
      },
      topMenuClick (menu) {
        if (menu.openType == '1') {
          window.open(menu.url)
        } else {
          this.$store.dispatch('home/addView', menu).then(({ view }) => {
            this.$store.dispatch('home/selectView', String(view.id))
          })
        }
        //
        if (menu.type === 'app') {
          // 添加app访问次数
          AppVisitCount(menu.id)
        }
      },
      // 鼠标移入菜单后显示下拉菜单
      onmouseenter (event, module) {
        switch (module) {
          case 'personal':
            if (window.personalCenterVisibleTimeout) {
              clearTimeout(window.personalCenterVisibleTimeout)
            }
            this.personalCenterVisible = this.$store.state.home.appPanelVisibility
            break
          case 'platform':
            if (window.platformVisibleTimeout) {
              clearTimeout(window.platformVisibleTimeout)
            }
            this.platformVisible = this.$store.state.home.appPanelVisibility
            break
          case 'app':
            if (window.appVisibleTimeout) {
              clearTimeout(window.appVisibleTimeout)
            }
            this.appVisible = this.$store.state.home.appPanelVisibility
            break
          case 'services':
            if (window.servicesVisibleTimeout) {
              clearTimeout(window.servicesVisibleTimeout)
            }
            this.servicesVisible = this.$store.state.home.appPanelVisibility
            break
          default:
            break
        }
      },
      // 鼠标移出菜单后隐藏下拉菜单
      onmouseleave (event, module) {
        switch (module) {
          case 'personal':
            window.personalCenterVisibleTimeout = setTimeout(() => {
              this.personalCenterVisible = false
            }, 100)
            break
          case 'platform':
            window.platformVisibleTimeout = setTimeout(() => {
              this.platformVisible = false
            }, 100)
            break
          case 'app':
            window.appVisibleTimeout = setTimeout(() => {
              this.appVisible = false
            }, 100)
            break
          case 'services':
            window.servicesVisibleTimeout = setTimeout(() => {
              this.servicesVisible = false
            }, 100)
            break
          default:
            break
        }
      },
      openSearchPanel () {
        //  打开检索面板
        this.searchShow = true
      },
      closeSearchPanel () {
        this.searchShow = false
      },
      collectionService (service) {
        this.$refs['service'].addService(service)
      },
      collectionCancelService (service) {
        this.$refs['service'].removeService(service)
      },
      // 退出登录
      logout () {
        this.$confirm('您确定要退出系统登录么?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          closeOnClickModal: false,
          type: 'warning'
        }).then(() => {
          this.$logout()
        }).catch(() => {
        })
      },
      goto (type) {
        switch (type) {
          case 'personal':
            this.switchModule(0)
            this.personCenterTab = 'personalInfo'
            break
          case 'password':
            this.switchModule(0)
            this.personCenterTab = 'accountSetting'
            break
          case 'version':
            this.versionVisible = true
            break
        }
      },
      //logo显示失败
      logoImgError (e) {
        e.target.src = logo
      },
      //用户头像 显示失败
      userImgError (e) {
        e.target.src = defaultPersonalImg
      }
    },
    computed: {
      appPanelVisibility () {
        return this.$store.state.home.appPanelVisibility
      },
      subMenuVisibility () {
        return this.$store.state.home.subMenuVisibility
      },
      isBlur () {
        return this.$store.state.home.subMenuVisibility
      },
      swiper () {
        return this.$refs.moduleSwiper.swiper
      },
      visitedViews () {
        return this.$store.state.home.visitedViews
      },
      popperTriggerType () {
        this.$forceUpdate()
        return this.$store.state.home.appPanelVisibility ? 'hover' : 'manual'
      },
      'logoImg': function () {
        if (this.$project.projectLogo && this.$project.projectLogo.length > 0) {
          return this.$project.serverUrl + '/' + this.$project.projectLogo
        } else {
          return logo
        }
      }
    },
  }
</script>

<style scoped lang="stylus">
  @import "~@/views/home/home.styl";
  $headerHeight = 60px

  .home
    position: relative
    width: 100%
    height: 100%
    min-width: 1200px;
    min-height: 600px;
    overflow hidden

  .outer
    position: absolute;
    left: -100px;
    top: -100px;
    width: calc(100% + 200px);
    height: calc(100% + 200px);
    /*background-image: url("~@/assets/img/background.jpg");*/
    background-size: 100% 100%;

  .outer-blur
    filter: blur(10px);

  .bg
    position: absolute;
    left: 100px;
    top: 100px;
    width: calc(100% - 200px);
    height: calc(100% - 200px);

  .bg-wrapper
    position: relative;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    overflow auto

  .container
    width: 100%
    height: 100%

  .header
    position relative
    z-index 501
    width: 100%
    height $headerHeight
    font-size: 16px
    color: $fontColor
    .logo
      position absolute
      left 40px
      height $headerHeight
      line-height: $headerHeight
      font-size 20px
      z-index 10000
      img
        display: inline-block
        vertical-align: middle
        height 38px
        width 38px
      .title {
        width 204px
        height 38px
        margin-top: 'calc((%s - 38px)/2)' % $headerHeight
        background-image url("../../assets/img/logo/title.png")
        background-repeat no-repeat
      }
    //  给菜单栏添加hover和选中变色
    .navs-tabs
      .item
        color white
      .item:hover
        color: $selectColor
        cursor: pointer
      .item-slected
        color: $selectColor

  .navs-right
    top 0px
    position absolute
    right 20px
    line-height: $headerHeight
    .item
      display inline-block
      padding-left: 10px
      padding-right: 10px
      margin-right 20px
    .item:hover
      color: $selectColor
      cursor: pointer
    i
      margin-left: 12px
      padding 10px
    i:hover
      color: $selectColor
      cursor: pointer
    .has-app
      color: $selectColor

  .main
    width 100%
    height: 'calc(100% - %s)' % $headerHeight
    padding: 0
    position: relative
    .swiper-container
      width: 100%
      height: 100%
    .content
      width: 100%
      height: 100%

  .durationTimeIn
    animation-duration: .3s

  // 动画执行时间

  .durationTimeOut
    animation-duration: .5s

  // 动画执行时间

  .mask
    position absolute
    width: 100%
    height: 100%
    left 0
    top 0
    z-index $zIndex-mask
    overflow auto

  .durationFadeIn
    animation-duration: .3s

  // 动画执行时间

  .durationFadeOut
    animation-duration: .2s

  // 动画执行时间


</style>
<style lang="stylus">
  $headerHeight = 60px
  .userInfo {
    display: inline-block
    margin-left: 12px
    .avatar {
      .user-avatar {
        width: 30px;
        height: 30px;
        display inline-block
        border-radius: 50%;
        margin-top: 15px;
        margin-right: 5px;
        vertical-align top
      }
    }
    .user {
      font-size 14px
      padding: 0 5px;
      white-space pre
    }
    &:hover {
      color: #ffffff
      cursor: pointer
    }
  }

  .el-popover.userInfoDropdown_APP {
    background-color: rgb(255, 255, 255);
    color: #606266;
    div.divide {
      width: 75%;
      height: 0px;
      border-bottom: 1px solid #c3c8cf;
      margin: 5px auto;
    }
    div.dropMenu:hover {
      color: #409EFF
      background-color #ebedf0
    }
  }

  .el-popover.userInfoDropdown {
    background-color: rgba(52, 50, 103, 0.7);
    color: #ffffff;
    div.divide {
      width: 75%;
      height: 0px;
      border-bottom: 1px solid #c0c6cd;
      margin: 5px auto;
    }
    div.dropMenu:hover {
      color: #409EFF
      background rgba(52, 50, 103, 0.3)
    }
  }

  .el-popover.userInfoDropdown, .el-popover.userInfoDropdown_APP {
    position absolute
    top: 48px !important
    min-width 100px !important
    padding: 5px 0px;
    border-radius: 3px;
    border: none
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1)
    div.dropMenu {
      padding 5px 20px
      cursor pointer
      .menu-icon {
        font-size: 16px;
      }
      span {
        margin-left 10px
      }
    }
  }

  .mainDropdownMenu
    width 40%
    height 300px
    min-width 400px

  .searchPanel {
    background-color transparent
    .el-dialog__header {
      display none
    }
  }

  .swiper-button-prev, .swiper-button-next
    background-image none
    font-size: 50px
    width 50px
    color: #007aff 8 a
    i
      border-radius: 50%;
      background rgba(255, 255, 255, 0.35)

  .swiper-button-prev:hover, .swiper-button-next:hover
    color: #007aff
    i
      background rgba(255, 255, 255, 0.539)
</style>
