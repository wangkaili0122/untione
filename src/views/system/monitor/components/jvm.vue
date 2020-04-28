<template>
  <div :class="className" :style="{height:height,width:width}">
    <lengthways-table :columns="columns" :tableData="tableData"></lengthways-table>
  </div>
</template>
<script>
  import LengthwaysTable from 'components/lengthway-table/lengthwaysTable'
  import { GetServerJvm } from 'request/services/monitor.js'
  export default {
    name: 'server-jvm',
    components: { LengthwaysTable },
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
        columns: [
          {
            name: 'Java名称',
            key: 'name'
          },
          {
            name: '启动时间',
            key: 'startTime'
          },
          {
            name: '安装路径',
            key: 'home'
          },
          // {
          //   name: '项目路径',
          //   key: ''
          // },
          {
            name: 'Java版本',
            key: 'version'
          },
          {
            name: '运行时长',
            key: 'runTime'
          },
          {
            name: '内存总量',
            key: 'total'
          },
          {
            name: '最大内存量',
            key: 'max'
          },
          {
            name: '空闲内存量',
            key: 'free'
          },
          {
            name: '已使用',
            key: 'used'
          },
          {
            name: '内存利用率',
            key: 'usage'
          },
        ],
        tableData:{},
        timeId: null
      }
    },
    mounted() {
      this.getJvmData()
      var that = this;
      this.timeId = setInterval(function(){
        that.getJvmData();
      },30000);
    },
    beforeDestroy () {
      var that = this;
      clearInterval(that.timeId);
    },
    methods: {
      getJvmData() {
        GetServerJvm().then(res => {
          // free: 343.04
          // home: "D:\ruanjian\java\jdk\jre"
          // max: 1796
          // name: "Java HotSpot(TM) 64-Bit Server VM"
          // runTime: "0天2小时7分钟"
          // startTime: "2019-03-22 15:17:03"
          // total: 498.5
          // usage: 31.19
          // used: 155.46
          // version: "1.8.0_161"
          this.tableData = res.data.data
        })
      }
    }
  }
</script>
<style lang="stylus" scoped>
  .content-container{
    width: 100%
    height 250px
  }
</style>
