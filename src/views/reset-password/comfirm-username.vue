<!--
     /**
      * 组件名称
      * @desc 组件描述
      * @example 调用示例
      *  <reset-password-form></reset-password-form>
      */
       -->
<template>
  <div class="verification-form">
    <el-form ref="userNameForm" :model="passwordObj" :rules="rules" label-width="0px">
      <el-form-item prop="userName">
        <el-input v-model="passwordObj.userName"  type="input" placeholder="请填写登录名">
          <i slot="prefix" class="iconfont icon-icon input-verification-icon"></i>
        </el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="next">下一步</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  import regexpRules from 'utils/validate/validateRegex';
  import { CheckUserLoginName } from 'request/services/user.js';
  import debounce from 'utils/debounce.js';
  export default {
    name: 'reset-password-form',
    data () {
      var checkLoginName = (rule, value, callback) => {
        if (value === ''){
          callback(new Error('请输入您的登录名'));
        }else if (!regexpRules.account(value)) {
          callback(new Error('登录名只能包含数字和字母，且必须包含字母,长度为1-20位'))
        } else {
          debounce(function () {
            CheckUserLoginName(value).then(res => {
              if (res.data.data) {
                callback(new Error('此登录名不存在'))
              } else {
                callback()
              }
            })
          }, 500)()
        }
      };
      return {
        passwordObj: {userName: ''},
        rules: {
          userName: [
            {required: true, validator: checkLoginName, trigger: 'blur'}
          ]
        }
      };
    },
    methods: {
      next () {
        this.$refs['userNameForm'].validate((valid) => {
          if (valid) {
            this.$emit('nextStep', {
              step: 'confirmUserName',
              userName: this.passwordObj.userName
            });
          }
        });
      }
    }
  };
</script>

<style scoped>
  .verification-form{
    width: 50%;
    margin: 0 auto;
    text-align: center;
  }
</style>
