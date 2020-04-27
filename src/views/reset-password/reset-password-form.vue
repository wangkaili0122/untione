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
    <el-form ref="passwordForm" :model="passwordObj" :rules="rules" label-width="0px">
      <el-form-item prop="password">
        <el-input v-model="passwordObj.password" type="password" placeholder="设置密码">
          <i slot="prefix" class="iconfont icon-mima input-verification-icon"></i>
        </el-input>
      </el-form-item>
      <el-form-item prop="confirmPassword">
        <el-input v-model="passwordObj.confirmPassword" type="password" placeholder="重复密码">
          <i slot="prefix" class="iconfont icon-mima input-verification-icon"></i>
        </el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="next">下一步</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  import { ValidatePassword } from 'request/services/user.js'
  import debounce from 'utils/debounce.js'
  import DES from 'utils/security/DESUtil'

  export default {
    name: 'reset-password-form',
    props: {
      userName: {
        require: true,
        default () {
          return ''
        }
      }
    },
    data () {
      var that = this
      var checkNewPassword = (rule, value, callback) => {
        let reg = /^(?![a-zA-Z]+$)(?![A-Z0-9]+$)(?![A-Z\W_!@#$%^&*`~()-+=]+$)(?![a-z0-9]+$)(?![a-z\W_!@#$%^&*`~()-+=]+$)(?![0-9\W_!@#$%^&*`~()-+=]+$)[a-zA-Z0-9\W_!@#$%^&*`~()-+=]{6,30}$/;
        let matchRes = RegExp(reg).test(value)
        if (value === '') {
          callback(new Error('请输入您的新密码'))
        }
        setTimeout(() => {
          if (!matchRes || value.length < 6 || value.length > 30) {
            callback(new Error('新密码需由6-30位的字母、数字和至少一个特殊符号组成'))
          } else {
            debounce(function () {
              var data = {
                loginName: that.userName,
                password: value
              }
              ValidatePassword(data).then(res => {
                if (res.data.data) {
                  callback()
                } else {
                  callback(new Error('新密码与原密码相同'))
                }
              })
            }, 500)()
          }
        }, 200)
      }
      var checkConfirmPassword = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请再次输入您设置的新密码'))
        } else if (value !== this.passwordObj.password) {
          callback(new Error('两次输入密码不一致'))
        } else {
          callback()
        }
      }

      return {
        passwordObj: { confirmPassword: '', password: '' },
        rules: {
          password: [
            { required: true, validator: checkNewPassword, trigger: 'blur' }
          ],
          confirmPassword: [
            { required: true, validator: checkConfirmPassword, trigger: 'blur' }
          ]
        }
      }
    },
    methods: {
      next () {
        this.$refs['passwordForm'].validate((valid) => {
          if (valid) {
            let encodePassword = DES.encrypt(this.passwordObj.password)
            this.$emit('nextStep', {
              step: 'resetPassword',
              password: encodePassword
            })
          }
        })
      }
    }
  }
</script>

<style scoped>
  .verification-form {
    width: 50%;
    margin: 0 auto;
    text-align: center;
  }
</style>
