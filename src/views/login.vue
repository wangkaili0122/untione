<!--
/**
  * @desc 组件描述
  * @author 21086
  * @data 2020/4/23
  * @example 调用示例
  * <login></login>
  */
-->
<template>
  <div class="login" @keydown.stop="keydownFn">
  <!--背景图片-->
  <div class="drawer"></div>
  <div class="cloud"></div>
  <div class="cloud1"></div>
  <div class="cloud2"></div>
  <div class="cloud3"></div>
  <div class="cloud4"></div>
  <div class="formContainer">
    <div class="title"></div>
    <el-form ref="formDataForm" :model="formData" label-width="0px" style="text-align:left" :rules="formDataRules"
             class="demo-ruleForm">
      <el-form-item prop="loginName" style="margin-bottom: 30px">
        <el-input prefix-icon="iconfont icon-icon" type="text" v-model="formData.loginName"
                  name="loginName"></el-input>
      </el-form-item>
      <el-form-item prop="password">
        <el-input prefix-icon="iconfont icon-mima" type="password" v-model="formData.password"
                  name="password"></el-input>
      </el-form-item>
      <el-form-item prop="verificationCode" v-if="showVerifyCode">
        <el-input prefix-icon="iconfont icon-mima" type="text" v-model="formData.verificationCode"
                  name="verificationCode"></el-input>
        <verify-code ref="verifyCode" :click-change="true" :height="30" :validCodeClass="validCodeClass"
                     background-color="rgb(240, 240, 240)"></verify-code>
      </el-form-item>
      <el-form-item>
        <el-checkbox v-model="formData.rememberMe" @change="rememberFn">记住密码</el-checkbox>
        <a class="fr forgetPassword" @click="forgetPassword" title="点击重置密码">忘记密码?</a>
      </el-form-item>
    </el-form>
    <button class="loginBtn" @click="doLogin" style="font-size: 18px">登&nbsp;&nbsp;&nbsp;&nbsp;录</button>
    <el-alert
      v-if="errorMassage"
      class="alert-wrapper"
      :title="errorMassage"
      type="error"
      show-icon>
    </el-alert>
  </div>
  </div>
</template>

<script>
  import { checkAccount} from '../utils/validate/validateRules.js'
  import DES from 'utils/security/DESUtil'
  import VerifyCode from '@/components/verify-code.vue'
    export default {
      name: "login",
      components: { VerifyCode },
      data(){
        const validCodeCheck = (rule, value, callback) => {
          if (!value) {
            callback(new Error('请输入验证码'))
          } else if (!this.$refs['verifyCode'].validate(value)) {
            callback(new Error('验证码错误，请重新输入验证码'))
          }
          callback()
        }
          return{
            showVerifyCode: this.$project.showVerifyCode,
            validCodeClass: 'valid-code-class',
            errorMassage: '',
            formData:{
              //初始化用户信息
              loginName:localStorage.getItem('loginName'),
              password:localStorage.getItem('passwd'),
              rememberMe:localStorage.getItem('rememberFlag') === 'true'
            },
            formDataRules: {
              loginName: [
                { validator: checkAccount, trigger: 'blur' }
              ],
              password: [],
              verificationCode: [
                { validator: validCodeCheck, trigger: 'blur' }
              ]
            }
          }
      },
      methods:{
        doLogin(){
          if (this.formData.rememberMe) { // 是否记住用户名
            localStorage.setItem('loginName', this.formData.loginName)
            localStorage.setItem('passwd', this.formData.password)
          } else {
            localStorage.removeItem('loginName')
            localStorage.removeItem('passwd')
          }
          this.$refs.formDataForm.validate(valid =>{
            if(valid){
              let loginParams = JSON.parse(JSON.stringify(this.formData))
              loginParams.password = DES.encrypt(this.formData.password)
              //this.$store.dispatch()//dispatch：含有异步操作，数据提交至 actions ，可用于向后台提交数据
              this.$store.dispatch('auth/login', loginParams).then(resp => {
                if (resp.data.code === '1000') {
                  this.$notify({
                    // title: '错误',
                    message: resp.data.message,
                    type: 'error',
                    offset: 50
                  })
                  return
                }
                window.top.location.href = this.$project.indexPage
              }).catch(error =>{
                // 根据后台接口返回错误信息情况进一步处理
                var errMessage
                if (error.response && error.response.code == '1000') {
                  if (error.response.data && error.response.data.message) {
                    errMessage = error.response.data.message
                  } else if (error.message) {
                    errMessage = error.message
                  } else {
                    errMessage = '登录名或密码错误！'
                  }
                  //  刷新验证码
                  this.changeIdentify()
                } else if (!error.request && !error.response && error.name == 'TypeError') {
                  // 提示错误信息
                  errMessage = '服务器链接错误！'
                } else {
                  // 提示错误信息
                  errMessage = error.message || error
                  //  刷新验证码
                  this.changeIdentify()
                }
                this.errorMassage = errMessage
              })
            }

          })
        },
        changeIdentify(){
          this.$refs['verifyCode'].refresh()
          this.formData.verificationCode = ''
        },
        keydownFn(event){
          if (event.keyCode === 13) {
            this.doLogin()
          }
        },
        //是否记住用户信息
        rememberFn(){
          localStorage.setItem('rememberFlag', val)
        },
        forgetPassword(){
          let path = '/index.html#/resetPassword'
          window.open(path,'_self')
        }
      },
      computed:{
        loginName () {
          return this.formData.loginName
        }
      },
      watch:{
        loginName (newVal, oldVal) {
          if (this.formData.rememberMe) {
            if (newVal !== localStorage.getItem('loginName')) {
              this.formData.password = ''
            } else {
              this.formData.password = localStorage.getItem('passwd')
            }
          }
        }
      }
    }
</script>

<style lang="stylus" scoped>
  .login {
    position relative
    background-color transparent
    width 100%
    height 100%
    &::before {
      content: ''
      background-color #e6f8fa
      position absolute
      width 100%
      left 0px
      top 0px
      /*bottom 25%*/
      bottom 0px
      z-index -1
    }
    &::after {
      content: ''
      background-color #ffffff
      position absolute
      width 100%
      height 25%
      left 0px
      bottom 0px
      z-index -2
    }
    .drawer {
      position absolute
      z-index 0
      width 1038px
      height 574px
      bottom calc(25% - 10px)
      left calc(15% - 250px)
      background-image url("../assets/img/login/drawer.png")
      background-repeat no-repeat
    }
    .cloud {
      position absolute
      width 139px
      height 87px
      left 7%
      top calc(19% - 60px)
      z-index 0
      background-image url("../assets/img/login/cloud.png")
      background-repeat no-repeat
    }
    .cloud1 {
      position absolute
      width 92px
      height 56px
      left 25%
      top 5%
      z-index 0
      background-image url("../assets/img/login/cloud1.png")
      background-repeat no-repeat
    }
    .cloud2 {
      position absolute
      width 65px
      height 40px
      left calc(55% - 200px)
      top calc(19% - 40px)
      z-index 0
      background-image url("../assets/img/login/cloud1.png")
      background-repeat no-repeat
      background-size cover
    }
    .cloud3 {
      position absolute
      width 139px
      height 87px
      right calc(45% - 150px)
      top calc(45% - 150px)
      z-index 0
      background-image url("../assets/img/login/cloud.png")
      background-repeat no-repeat
    }
    .cloud4 {
      position absolute
      width 145px
      height 85px
      right 150px
      top calc(45% - 300px)
      z-index 0
      background-image url("../assets/img/login/cloud2.png")
      background-repeat no-repeat
    }

    .formContainer {
      position absolute
      width 450px
      height 420px
      top calc(45% - 150px)
      right calc(30% - 320px)
      padding 20px 40px
      background-color white
      border-radius 10px
      box-sizing border-box
      box-shadow 0px 0px 20px 0px rgba(152, 149, 149, 0.18)
      .title {
        height 50px
        color #333333
        font-size 20px
        line-height 50px
        margin-bottom 30px
        background-image url("../assets/img/login/login-title.png")
        background-repeat no-repeat
        background-position center
      }

      .alert-wrapper {
        width: 360px;
        margin-top 10px
        line-height: 23px;
      }
      .valid-code-class {
        position: relative;
        float: right;
        margin: -35px 18px;
      }
      .loginBtn {
        padding 10px 20px
        width 100%
        background-color rgba(64, 158, 255, 0.92)
        border-radius 5px
        border none
        outline none
        color #ffffff
        cursor pointer
        &:hover {
          background-color #3389ff
        }
      }
      .forgetPassword {
        color #c1c1c1
        &:hover {
          color #409EFF
        }
      }
    }
  }
</style>
<style lang="stylus">
  .login {
    .formContainer {
      .el-input__inner {
        height 50px
        border 2px solid
        border-radius 8px
        padding-left 60px
        border-color #94b3ff
      }
      .el-form-item.is-success .el-input__inner, .el-form-item.is-success .el-input__inner:focus, .el-form-item.is-success .el-textarea__inner, .el-form-item.is-success .el-textarea__inner:focus {
        border-color #94b3ff
      }
      .iconfont {
        font-size 22px
        color #94b3ff
        font-weight bolder
      }
      span.el-input__prefix {
        margin-right 10px
        margin-left 10px
        &:after {
          content ''
          position absolute
          height 30px
          width 1px
          right -10px
          top 10px
          background-color #999999
        }
      }
    }
  }

</style>
