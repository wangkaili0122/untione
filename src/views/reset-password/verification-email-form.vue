<!--
     /**
      * 通过向邮箱发送验证码验证邮箱
      * @desc 组件描述
      * @example 调用示例
      *  <verificationEmailForm></verificationEmailForm>
      */
       -->
<template>
  <div class="verification-form">
    <el-form ref="emailForm" :model="emailModel" :rules="rules" @validate="emailFormValidate" label-width="0px">
      <el-form-item prop="email" class="from-item">
        <el-input v-model="emailModel.email" placeholder="邮箱">
          <i slot="prefix" class="iconfont icon-youxiang input-verification-icon"></i>
        </el-input>
      </el-form-item>
      <el-form-item prop="code" class="from-item">
        <el-input v-model="emailModel.code" placeholder="验证码">
          <i slot="prefix" class="iconfont icon-Verification_code input-code-icon"></i>
          <el-button slot="append" :disabled="!vaildCodeBtnEnable" @click="sendVaildCode">
            {{vaildCodeBtnName}}
          </el-button>
        </el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="next">下一步</el-button>
        <p class="form_tips">
          <a href="javascript:void(0)" class="change_other" @click="verification('mode')">更换其他验证方式</a>
        </p>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  import {SendResetEmailCode, ValidateEmailByCode} from 'src/request/services/user.js';

  export default {
    name: 'verification-email-form',
    props:{
      userName:{
        default(){
          return ''
        }
      }
    },
    data () {
      var checkEmail = (rule, value, callback) => {
        const checkEmail = RegExp(/^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/im).test(value);
        if (!value || value === '') {
          callback(new Error('请输入您的邮箱'))
        } else if (value && value.length > 100) {
          callback(new Error('邮箱长度限制为1-100个字符'))
        } else if (!checkEmail) {
          callback(new Error('请输入正确的邮箱格式：example@h3c.com'))
        }else {
          callback()
        }
      };
      return {
        emailModel: {
          emailValidate: false
        },
        vaildCodeBtnName: '发送验证码',
        rules: {
          email: [
            {required: true, validator: checkEmail, trigger: 'blur'}
          ],
          code: [
            {required: true, message: '请填写验证码', trigger: 'blur'},
            {min: 6, max: 6, message: '验证码长度为6位，请正确填写验证码', trigger: 'blur'}
          ]
        },
        countTimeOut: null,
        second: 0
      };
    },
    created(){

    },
    methods: {
      verification (mode) {
        this.$refs['emailForm'].resetFields();
        this.$emit('chooseMode', mode);
      },
      // 验证码成功后触发nextStep事件并把邮箱号传递给父组件
      next () {
        this.$refs['emailForm'].validate((valid) => {
          if (valid) {
            ValidateEmailByCode(this.emailModel).then(resp => {
              let em = JSON.parse(JSON.stringify(this.emailModel));
              this.$emit('next', {
                step: 'verificationEmail',
                email: em.email,
                code: em.code
              });
            });
          }
        });
      },
      sendVaildCode () {
        var validateResult = this.emailModel.emailValidate;
        if (validateResult) {
          this.countSeconds();
          // this.$alert('验证码已发送到您的邮箱，请登陆邮箱查看验证码！', '提示', {type: 'success'});
          SendResetEmailCode({email:this.emailModel.email,loginName:this.userName}).then(resp => {
          }).catch(resp => {
            //  发送验证码失败，就停止倒计时
            this.stopCount();
          });
        } else {
          // this.$alert('请正确填写邮箱地址','提示')
          if (!(this.emailModel.email && this.emailModel.email.length > 0)) {
            // 单独验证邮箱格式是否符合要求以及邮箱是否已被使用
            this.$refs['emailForm'].validateField('email', (message) => {

            });
          }
        }
      },
      emailFormValidate (prop, result, message) {
        if (prop === 'email') {
          this.emailModel.emailValidate = result;
        }
      },
      // 发送验证码后开始倒计时60s
      countSeconds () {
        this.vaildCodeBtnName = '重新发送(90s)';
        this.second = 90;
        this.count();
      },
      count () {
        if (this.second === 0) {
          this.stopCount();
        } else {
          this.countTimeOut = setTimeout(() => {
            this.second = this.second - 1;
            this.vaildCodeBtnName = '重新发送(' + this.second + 's)';
            this.count();
          }, 1000);
        }
      },
      stopCount () {
        this.second = 0;
        clearTimeout(this.countTimeOut);
        this.countTimeOut = null;
        this.vaildCodeBtnName = '重新发送';
      }
    },
    computed: {
      vaildCodeBtnEnable () {
        return this.vaildCodeBtnName === '发送验证码' || this.vaildCodeBtnName === '重新发送';
      }
    }
  };
</script>

<style lang="stylus" scoped>
  .verification-form{
    width: 50%;
    margin: 0 auto;
    text-align: center;
    .from-item {
      padding-bottom: 8px;
    }
    .form_tips{
      font-size: 12px;
      line-height: 40px;
    }
    .change_other{
      margin: 0 3px;
      color: #2f86f6;
    }
  }
</style>
