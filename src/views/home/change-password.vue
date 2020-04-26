<!--
    /**
     * 第三方系统调的修改密码页面
     */
-->
<template>
  <div class="accountSetting">
    <div class="account-wrapper">
      <div class="accont-title">
        <span class="title-font"><i class="line-icon"></i> 修改密码</span>
      </div>
      <div class="account-form">
        <el-form ref="accontForm" :model="accontModel" :rules="rules" label-width="120px" label-position="right"
                 size="small">
          <el-form-item label="登录名：">
            <el-input v-model="accontModel.loginName" class="dialog-input-width" disabled></el-input>
          </el-form-item>
          <el-form-item label="姓名：">
            <el-input v-model="accontModel.userName" :readonly="true" class="dialog-input-width" disabled></el-input>
          </el-form-item>
          <el-form-item label="原密码：" prop="password">
            <el-input :type="passwordType" v-model="accontModel.password" placeholder="请输入原密码"
                      class="dialog-input-width">
              <i
                :class="passwordType === 'text' ? 'iconfont icon-password-view focus-color  ': 'iconfont icon-password-unview '"
                slot="suffix"
                @mousedown="passwordType='text'"
                @mouseup="passwordType='password'">
              </i>
            </el-input>
          </el-form-item>
          <el-form-item label="新密码：" prop="newPassword">
            <el-input :type="newPasswordType" v-model="accontModel.newPassword"
                      placeholder="请输入新密码，由6-30位的字母、数字和至少一个特殊符号组成" class="dialog-input-width">
              <i
                :class="newPasswordType === 'text' ? 'iconfont icon-password-view focus-color  ': 'iconfont icon-password-unview '"
                slot="suffix"
                @mousedown="newPasswordType='text'"
                @mouseup="newPasswordType='password'">
              </i>
            </el-input>
          </el-form-item>
          <el-form-item label="确认密码：" prop="newPasswordAgain">
            <el-input :type="newPasswordAgainType" v-model="accontModel.newPasswordAgain" placeholder="请确认密码"
                      class="dialog-input-width">
              <i
                :class="newPasswordAgainType === 'text' ? 'iconfont icon-password-view focus-color  ': 'iconfont icon-password-unview '"
                slot="suffix"
                @mousedown="newPasswordAgainType='text'"
                @mouseup="newPasswordAgainType='password'">
              </i>
            </el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="form-button button-float">
          <el-button size="small" @click="resetForm">重 置</el-button>
          <el-button type="primary" size="small" @click="commit" class="button">确 定</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import { updateUserPassword } from 'request/services/user'
  import DESUtil from 'utils/security/DESUtil'

  export default {
    name: 'account-setting',
    data () {
      var checkNewPassword = (rule, value, callback) => {
        let reg = /^(?![a-zA-Z]+$)(?![A-Z0-9]+$)(?![A-Z\W_!@#$%^&*`~()-+=]+$)(?![a-z0-9]+$)(?![a-z\W_!@#$%^&*`~()-+=]+$)(?![0-9\W_!@#$%^&*`~()-+=]+$)[a-zA-Z0-9\W_!@#$%^&*`~()-+=]{6,30}$/;
        let matchRes = RegExp(reg).test(value)
        if (value === '') {
          callback(new Error('请输入您的新密码'))
        } else if (value === this.accontModel.password) {
          callback(new Error('新密码不能与原密码相同'))
        }
        setTimeout(() => {
          if (!matchRes || value.length < 6 || value.length > 30) {
            callback(new Error('请输入您的新密码，由6-30位的字母、数字和至少一个特殊符号组成'))
          } else {
            callback()
          }
        }, 200)
      }
      var checkConfirmPassword = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请再次输入您设置的新密码'))
        } else if (value !== this.accontModel.newPassword) {
          callback(new Error('两次输入密码不一致'))
        } else {
          callback()
        }
      }
      return {
        passwordType: 'password',
        newPasswordType: 'password',
        newPasswordAgainType: 'password',
        accontModel: {
          loginName: this.$store.state.user.loginName,
          userName: this.$store.state.user.userName,
          password: '',
          newPassword: '',
          newPasswordAgain: '',
        },
        rules: {
          password: [
            { required: true, message: '请输入您当前的登录密码', trigger: 'blur' }
          ],
          newPassword: [
            { required: true, validator: checkNewPassword, trigger: 'blur' }
          ],
          newPasswordAgain: [
            { required: true, validator: checkConfirmPassword, trigger: 'blur' }
          ]
        }
      }
    },
    methods: {
      resetForm () {
        this.$refs['accontForm'].resetFields()
      },
      commit () {
        this.$refs['accontForm'].validate(valid => {
          if (valid) {
            this.$confirm('确认修改密码?', '修改密码', {
              confirmButtonText: '确 定',
              cancelButtonText: '取 消',
              closeOnClickModal: false,
              type: 'warning'
            }).then(() => {
              let encryptPassword = DESUtil.encrypt(this.accontModel.newPassword)
              let orginPassword = DESUtil.encrypt(this.accontModel.password)
              let submitParams = Object.assign({}, this.accontModel)

              submitParams.newPassword = encryptPassword
              submitParams.newPasswordAgain = encryptPassword
              submitParams.password = orginPassword
              // this.updatePassword(this.accontModel)
              this.updatePassword(submitParams)
            })
          }
        })
      },
      updatePassword (val) {
        updateUserPassword(val).then(res => {
          this.$confirm('密码修改成功，请重新登录！', '成功', {
            confirmButtonText: '确定',
            showCancelButton: false,
            closeOnClickModal: false,
            type: 'success'
          }).then(() => {
            this.resetForm()
            this.logoutFn()
          }).catch(() => {
            this.resetForm()
            this.logoutFn()
          })
        }).catch(res => {
          this.resetForm()
        })
      },
      logoutFn () {
        // this.$logout()
        this.$store.commit('CLEAR');
        window.top.location.href = this.$project.eipCasLogoutUrl;
      }
    }
  }
</script>

<style scoped lang="stylus">
  .accountSetting {
    width: 80%;
    margin: 100px auto 0;
    height: 100%;
    border-radius 4px;
    /*背景色设置移动到皮肤里面*/
    /*background: #fff;*/
    .account-wrapper {
      padding: 20px;
      .accont-title {
        width: 100%;
        font-size: 16px;
        font-weight: bold;
        float: left;
        margin-bottom: 20px;
        .title-font {
          float: left
          line-height: 40px;
          .line-icon {
            border-left 3px solid #409EFF
            margin-right: 10px
          }
        }
      }
      .account-form {
        width: 60%;
        margin: 0 auto;
      }
    }
    .focus-color {
      color: #409EFF;
    }
    .button-float {
      /*float: left;*/
      margin-left: 120px;
      .button {
        margin-left 20px
      }
    }
  }
</style>
