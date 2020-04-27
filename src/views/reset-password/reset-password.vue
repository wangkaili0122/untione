<!--
     /**
      * 组件名称
      * @desc 组件描述
      * @example 调用示例
      *  <reset-password></reset-password>
      */
       -->
<template>
  <div class="reset-password-container">
    <div class="reset-title">
      <h1>重置密码</h1>
    </div>
    <div class="flow-step">
      <el-steps :active="currentFlow" align-center process-status="finish" finish-status="success">
        <el-step title="填写账号"></el-step>
        <el-step title="身份验证"></el-step>
        <el-step title="重置密码"></el-step>
        <el-step title="设置成功"></el-step>
      </el-steps>
    </div>
    <div class="flow-current">
      <component :is="currentForm" @nextStep="nextStep" :userName="resetPasswordModel.userName"></component>
    </div>
  </div>
</template>

<script>
  import ConfirmUsername from './confirm-username.vue'
  import IdentityVerification from './identity-verification';
  import ResetPasswordForm from './reset-password-form';
  import ResetComplete from './reset-complete-form';
  import {ResetPasswordByEmail} from 'src/request/services/user.js';

  export default {
    name: 'reset-password',
    components: {ConfirmUsername,IdentityVerification, ResetPasswordForm, ResetComplete},
    data () {
      return {
        currentFlow: 0,
        forms: ['confirm-username','identity-verification', 'reset-password-form', 'reset-complete'],
        resetPasswordModel: {userName:'',phone: '', email: '', code: '', password: ''}
      };
    },
    created(){
      if(this.$route.query.userName){
        this.resetPasswordModel.userName=this.$route.query.userName
        this.currentFlow++
      }
    },
    methods: {
      nextStep (param) {
        this.currentFlow++;
        if(param.step === 'confirmUserName'){
          this.resetPasswordModel.userName = param.userName;
        }else if (param.step === 'verificationPhone') {
          this.resetPasswordModel.phone = param.phone;
          this.resetPasswordModel.code = param.code;
        } else if (param.step === 'verificationEmail') {
          this.resetPasswordModel.email = param.email;
          this.resetPasswordModel.code = param.code;
        } else if (param.step === 'resetPassword') {
          this.resetPasswordModel.password = param.password;
          this.resetPassword();
        } else if (param.step === 'resetComplete') {
          // 跳转到登录页
          // this.$login();
          window.history.back();
        }
      },
      resetPassword () {
        var data = JSON.parse(JSON.stringify(this.resetPasswordModel));
        ResetPasswordByEmail(data).then(resp => {});
      }
    },
    computed: {
      currentForm () {
        return this.forms[this.currentFlow];
      }
    }
  };
</script>

<style lang="stylus" scoped>
  .reset-password-container {
    width: 800px;
    margin: 0 auto;
    background-color: #ffffff;
    box-shadow: 1px 1px 20px #7d7a7a;
    .reset-title {
      font-size: 26px;
      text-align: center;
      border-bottom: 1px solid #cdcdcd;
      padding: 20px;
    }
    .flow-step{
      padding: 30px;
    }
    .flow-current{
      padding: 30px 50px;
    }
  }
</style>
<style lang="stylus">
  .reset-password-container{
    .flow-step{
      .is-success{
        color: #409EFF;
        border-color: #409EFF;
        .el-step__line{
          background-color: #409EFF;
        }
      }
      .is-finish{
        .el-step__line{
          background: -webkit-linear-gradient(left, #409EFF, #C0C4CC); /* Safari 5.1 - 6.0 */
          background: -o-linear-gradient(right, #409EFF, #C0C4CC); /* Opera 11.1 - 12.0 */
          background: -moz-linear-gradient(right, #409EFF, #C0C4CC); /* Firefox 3.6 - 15 */
          background: linear-gradient(to right, #409EFF, #C0C4CC); /* 标准的语法 */
        }
      }
    }
  }
</style>
