<!--
    /**
     * 登录提示修改密码页面
     */
-->
<template>
  <div class="first-reset-password">
    <div class="tip">提示：您当前登录密码为初始登录密码，请修改您的登录密码，否则将影响您正常使用该系统！</div>
    <personal-reset-password></personal-reset-password>
  </div>
</template>

<script>
  import PersonalResetPassword from './components/personalCenter/account-setting.vue'
  export default {
    name: 'first-reset-password',
    components: { PersonalResetPassword }
  }
</script>

<style scoped lang="stylus">
  .first-reset-password{
    width: 80%;
    margin: 100px auto 0;
    .tip{
      font-size: 18px;
      line-height: 40px;
      color: #ff2f17;
    }
  }
</style>
