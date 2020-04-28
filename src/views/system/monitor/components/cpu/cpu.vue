<!--
 /**
  * 服务监控-CPU利用率
  * @desc 组件描述
  * @example 调用示例
  */
-->
<template>
  <div :class="className" :style="{height:height,width:width}">
    <div class="content-left">
      <cpu-chart :height="height" :chart-option-data="cpuInfoData"></cpu-chart>
    </div>
    <div class="content-right">
      <div class="divider"></div>
      <div class="content">
        <p><span class="content-item">核心数：</span><span class="content-value">{{cpuInfoData.cpuNum}}</span></p>
        <p><span class="content-item">用户使用率：</span><span class="content-value">{{cpuInfoData.used}}%</span></p>
        <p><span class="content-item">系统使用率：</span><span class="content-value">{{cpuInfoData.sys}}%</span></p>
        <p><span class="content-item">当前空闲率：</span><span class="content-value">{{cpuInfoData.free}}%</span></p>
      </div>
    </div>
  </div>
</template>

<script>
  import { GetServerCpu } from 'request/services/monitor.js'
  const CpuChart = () => import ('./cpu-chart')
  export default {
    name: 'server-cpu',
    components: { CpuChart },
    props: {
      className: {
        type: String,
        default: 'content-container'
      },
      width: {
        type: String,
        default: '100%'
      },
      height: {
        type: String,
        default: '400px'
      }
    },
    data() {
      return {
        cpuInfoData: {},
        timeId: null
      }
    },
    mounted() {
      this.getCpuInfoData();
      var that = this;
      this.timeId = setInterval(function(){
        that.getCpuInfoData();
      },30000);
    },
    beforeDestroy () {
      var that = this;
      clearInterval(that.timeId);
    },
    methods: {
      getCpuInfoData () {
        GetServerCpu().then(res => {
          this.cpuInfoData = res.data.data
        }).catch(error => {
          console.log(error);
        })
      },
    }
  }
</script>
<style lang="stylus" scoped>
  .content-container{
    width: 100%
    height 250px
    display inline-block
    .content-left{
      float left
      width 50%
      height 100%
      .chart {
        width 100%
        height 100%
      }
    }
    .content-right {
      float right
      width 50%
      height 100%
      display: flex;
      display: -webkit-flex;
      align-items: center;
      .divider {
        float left
        height: 70%
        border-left 1px solid rgba(85,88,90,0.3)
      }
      .content {
        /*text-align:center;*/
        margin:0 auto;
        padding 10px
        font-size 14px
        color #666
        font-family 'Microsoft YaHei'
        p{
          padding: 8px;
          .content-item{
            width 120px
            text-align left
          }
          .content-value{
            margin-left 10px
            width 120px
            text-align right
          }
        }
      }
    }
  }
</style>
