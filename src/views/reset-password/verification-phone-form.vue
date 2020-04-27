<!--
     /**
      * 通过向手机发送验证码验证身份
      * @desc 组件描述
      * @example 调用示例
      *  <verificationPhoneForm></verificationPhoneForm>
      */
       -->
<template>
  <div class="verification-form">
    <el-form ref="phoneForm" :model="phoneModel" :rules="rules" @validate="phoneFormValidate" label-width="0px">
      <el-form-item prop="phone" class="from-item">
        <el-input v-model="phoneModel.phone" placeholder="手机号码">
          <i slot="prefix" class="iconfont icon-shouji input-verification-icon"></i>
        </el-input>
      </el-form-item>
      <el-form-item prop="code" class="from-item">
        <el-input v-model="phoneModel.code" placeholder="验证码">
          <i slot="prefix" class="iconfont icon-Verification_code input-code-icon"></i>
          <el-button slot="append" :disabled="!vaildCodeBtnEnable" @click="sendVaildCode" class="sendBtn">
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
  // import {SendRessetEmailCode, ValidateEmailByCode} from 'src/rest-api/services/register';

  export default {
    name: 'verification-phone-form',
    props:{
      userName:{
        default(){
          return ''
        }
      }
    },
    data () {
      var checkPhone = (rule, value, callback) => {
        let matchPhone = RegExp(/^((13[0-9])|(14[5-9])|(15([0-3]|[5-9]))|(16[5-6])|(17[0,1,3,4,5,6,7,8])|(18[0-9])|(19[1,8,9]))\d{8}$/im).test(value);
        if (!matchPhone) {
          callback(new Error('请输入11位的手机号码'))
        } else {
          callback()
        }
      };
      return {
        phoneModel: {
          phoneValidate: false
        },
        vaildCodeBtnName: '发送验证码',
        rules: {
          phone: [
            {required: true, message: '请输入您的手机号码', trigger: 'blur'},
            {validator: checkPhone, trigger: 'blur'}
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
        this.$refs['phoneForm'].resetFields();
        this.$emit('chooseMode', mode);
      },
      // 验证码成功后触发nextStep事件并把手机号码传递给父组件
      next () {
        this.$refs['phoneForm'].validate((valid) => {
          if (valid) {
            let em = JSON.parse(JSON.stringify(this.phoneModel));
            this.$emit('next', {
              step: 'verificationPhone',
              phone: em.phone,
              code: em.code
            });
            // ValidateEmailByCode(this.phoneModel).then(resp => {
            //   let em = JSON.parse(JSON.stringify(this.phoneModel));
            //   this.$emit('next', {
            //     step: 'verificationPhone',
            //     phone: em.phone,
            //     code: em.code,
            //   });
            // });
          }
        });
      },
      sendVaildCode () {
        var validateResult = this.phoneModel.phoneValidate;
        if (validateResult) {
          this.countSeconds();
          // this.$alert('验证码已发送到您的邮箱，请登陆邮箱查看验证码！', '提示', {type: 'success'});
          // SendRessetEmailCode(this.phoneModel.phone).then(resp => {
          // }).catch(resp => {
          //   //  发送验证码失败，就停止倒计时
          //   this.stopCount();
          // });
        } else {
          // this.$alert('请正确填写邮箱地址','提示')
          if (!(this.phoneModel.phone && this.phoneModel.phone.length > 0)) {
            // 单独验证邮箱格式是否符合要求以及邮箱是否已被使用
            this.$refs['phoneForm'].validateField('phone', (message) => {

            });
          }
        }
      },
      phoneFormValidate (prop, result, message) {
        if (prop === 'phone') {
          this.phoneModel.phoneValidate = result;
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
<style lang="stylus">
  .verification-form{
    .el-input__inner{
      padding-left: 54px;
    }
    .input-verification-icon{
      font-size: 18px;
    }
    .input-code-icon{
      font-size: 18px;
      position: relative;
      top: 10px;
    }
    span.el-input__prefix{
      margin-right: 8px;
      margin-left: 8px;
      &:after{
        content: '';
        position: absolute;
        height: 20px;
        width: 1px;
        right: -10px;
        top: 10px;
        background-color: #ccc;
      }
    }
  }
</style>
