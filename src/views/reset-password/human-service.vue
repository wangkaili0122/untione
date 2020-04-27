<template>
  <div class="human-service">
    <div class="human-phone">
      <span class="iconfont icon-dianhua phone-icon"></span>
      <span class="phone-text">人工服务电话：{{$project.humanServicePhone}}</span>
    </div>
    <div class="service-time">
      <p>人工服务时间工作日</p>
      <span>上午：8:30-12:00</span>
      <span class="span-time">下午：2:00-17:30</span>
    </div>
    <div>
      <p class="form_tips">
        <a href="javascript:void(0)" class="change_other" @click="verification('mode')">更换其他验证方式</a>
      </p>
    </div>
  </div>
</template>

<script>
  import { GetConfigValue } from 'request/services/config.js';
  export default {
    name: "human-service",
    data () {
      return {
        humanPhone: '暂无'
      };
    },
    mounted () {
      // this.getHumanPhone();
    },
    methods: {
      verification (mode) {
        this.$emit('chooseMode', mode);
      },
      getHumanPhone () {
        GetConfigValue('human-service-phone').then(res => {
          this.humanPhone = res.data.data;
        });
      }
    }
  }
</script>

<style lang="stylus" scoped>
  .human-service{
    margin: 10px 30px;
    text-align: center;
    .human-phone{
      padding: 10px 0;
      .phone-icon{
        font-size: 32px;
        color: #409eff;
        position: relative;
        top: 6px;
      }
      .phone-text{
        height: 40px;
        font-size: 22px;
        line-height: 40px;
        padding-left: 2px;
      }
    }
    .service-time{
      padding: 10px 0;
      line-height: 30px;
      .span-time{
        padding-left: 10px;
      }
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
