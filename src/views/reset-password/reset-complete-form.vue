<!--
     /**
      * 组件名称
      * @desc 组件描述
      * @author ljj-17773
      * @date 2018/11/9
      * @example 调用示例
      *  <reset-complete></reset-complete>
      */
       -->
<template>
  <div class="resetSuccess">
    <div>
      <span class="iconfont icon-success success-icon"></span>
    </div>
    <div class="successText">
      修改密码成功
    </div>
    <div>
      <a href="#" @click="next" class="to-login">点击跳转到登录页</a>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'reset-complete-form',
    data () {
      return {};
    },
    methods: {
      next () {
        this.$emit('nextStep', { step: 'resetComplete' });
      }
    }
  };
</script>

<style lang="stylus" scoped>
  .resetSuccess {
    text-align: center;
    margin-bottom: 50px;
    .success-icon{
      font-size: 50px;
      color: #67C23A;
    }
    .successText {
      font-size: 18px;
      padding: 20px;
      font-family: '微软雅黑';
    }
    .to-login{
      color: #2f86f6;
    }
  }
</style>
