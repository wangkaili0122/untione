<!--
/**
  * 使用iframe嵌入的子页面
  * 左侧为菜单栏，动态获取数据渲染
  * 右侧为内容区域
  * @desc 组件描述
  * @author 21086
  * @data 2020/4/24
  * @example 调用示例
  * <header></header>
  */
-->
<template>
    <div class="mainHeader">
      <div class="logo">
        <div class="lg">
          <img :src="logoImg" @error="logoImagError">
        </div>
        {{$project.projectName}}
      </div>
      <div class="useInfo">
        <span class="avatar">
          <img v-if="$store.state.user.avatar != ''"
                :src="$store.state.user.avatar.indexOf('base64')>=0?$store.state.user.avatar:($project.serverUrl +'/'+ $store.state.user.avatar)"
                alt="" class="user-avatar" @error="imgError"/>
          <img v-if="$store.state.user.avatar == ''" src="@/assets/img/touxiang.jpg" alt="" class="user-avatar"/>
        </span>
        <span class="user" title="当前用户">{{$store.state.user.userName}}</span>
        <span class="tip" title="未读消息">
        <no-read-message></no-read-message>
      </span>
        <!--<span @click="showVersion" title="关于"></span>-->
        <span @click="logout" class="logout" title="退出登录">
        <i class="iconfont icon-logout exit-icon"></i>
      </span>
      </div>
      <version :visible.sync="versionVisible"></version>
    </div>
</template>

<script>
  import NoReadMessage from './no-read-message'
  import defaultPersonalImg from '@/assets/img/touxiang.jpg'
  import logo from '../../assets/img/logo/logo.png'
  import Version from '@/views/system/version'
    export default {
      name: "header",
      components: { NoReadMessage, Version },
      data () {
        return {
          versionVisible: false,
        }
      },
      created () {
      },
      methods: {
        imgError (e) {
          e.target.src = defaultPersonalImg
        },
        logout () {
          this.$logout()
        },
        //logo显示失败
        logoImgError (e) {
          e.target.src = logo
        },
        showVersion () {
          this.versionVisible = true
        }
      },
      computed: {
        'logoImg': function () {
          if (this.$project.projectLogo && this.$project.projectLogo.length > 0) {
            return this.$project.serverUrl + '/' + this.$project.projectLogo
          } else {
            return logo
          }
        }
      }
    }
</script>

<style lang="stylus" scoped>
  .mainHeader {
    height: 100%;
    width: 100%;
    background-color: #515c6b;
    .logo {
      float left
      font-size 20px
      color white
      font-weight bold
      font-family '微软雅黑'
      line-height 60px
      padding-left 40px
      .lg {
        float left
        width 40px
        height 40px
        margin-top 10px
        margin-right 10px
        /*background-image url('../../assets/img/logo/logo.png')*/
        /*background-repeat no-repeat*/
        /*background-size contain*/
        img {
          width 40px
          height 40px
        }
      }
    }
    .userInfo {
      height: 60px;
      float: right;
      padding-right: 30px;
      line-height: 60px;
      color: white;
      display: flex;
      align-items: center;
      .avatar {
        height: 60px;
        .user-avatar {
          width: 34px;
          height: 34px;
          border-radius: 50%;
          margin-top: 13px;
        }
      }
      .user {
        padding: 0 5px;
        margin-right: 20px;
      }
      .tip {
        height: 60px;
      }
      .logout {
        cursor: pointer;
        padding: 0 5px;
        margin-right: 10px;
        color: #e2e2e2;
        .exit-icon {
          font-size: 18px;
        }
        &:hover {
          font-weight: bold;
          color: white;
        }
      }
    }
  }
</style>
