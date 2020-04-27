<!--
     /**
      * 组件名称
      * @desc 组件描述
      * @example 调用示例
      *  <reset-password-page></reset-password-page>
      */
       -->
<template>
  <div class="reset-page">
    <div class="title-bg">
      <div class="title-content">
        <div class="title-text">
          <div class="logo-img"><img :src="logoImg" @error="logoImgError" class="logo-class"/></div>
          <div class="title-name"><span class="cname">{{projectName}}</span></div>
        </div>
        <div class="title-link">
          <span @click="toLoginPage">登 录</span>
        </div>
      </div>
    </div>
    <div class="reset-password">
      <reset-password></reset-password>
    </div>
  </div>
</template>

<script>
  import ResetPassword from './reset-password';
  import logo from '../../assets/img/logo/logo.png'
  export default {
    name: 'reset-password-page',
    components: { ResetPassword },
    data () {
      return {
        projectName: this.$project.projectName
      };
    },
    methods: {
      //logo显示失败
      logoImgError(e){
        e.target.src = logo;
      },
      toLoginPage () {
        // this.$login();
        // window.history.back();
        if(this.$route.query.loginUrl){
          window.location.href=this.$route.query.loginUrl
        }else{
          window.history.back()
        }
      }
    },
    computed: {
      'logoImg':function(){
        if(this.$project.projectLogo && this.$project.projectLogo.length>0){
          return this.$project.serverUrl+'/'+this.$project.projectLogo
        }else{
          return logo
        }
      }
    }
  };
</script>

<style scoped lang="stylus">
  .reset-page{
    width:100%;
    height:100%;
    background-color: #eff6fc;
    position: relative;
    .title-bg {
      position: absolute;
      z-index: 0;
      width: 100%;
      height: 301px;
      background: url("../../assets/img/reset-password-bg.png") no-repeat top center;
      .title-content {
        height: 80px;
        padding: 20px 20%;
        display: flex;
        justify-content: space-between;
        .title-text{
          display: flex;
          .logo-img{
            padding: 15px;
            .logo-class{
              height: 50px;
            }
          }
          .title-name{
            .cname {
              height: 80px
              line-height: 80px;
              color: #6cbcff;
              display: inline-block;
              font-size: 29px;
              font-family: "sans-serif";
            }
          }
        }
        .title-link{
          padding: 0 20px;
          span {
            cursor: pointer;
            display: inline-block;
            font-size: 20px;
            line-height: 80px;
            font-weight: bold;
            font-family: '微软雅黑';
            color: white;
            text-shadow: 0 0 5px #4c4c4c;
            &:hover {
              color: #6cbcff;
            }
          }
        }
      }
    }
    .reset-password{
      position: relative;
      top: 120px;
      z-index: 1;
    }
  }
</style>
