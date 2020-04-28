
<template>
  <div class="monitor-wrapper">
    <el-row :gutter="15">
      <el-col :xs="24" :sm="12" :lg="12">
        <div class="content-div">
          <div class="title">
            <i class="iconfont icon-yingyong2 title-icon"></i>
            <span>CPU信息</span>
          </div>
          <server-cpu height="200px"></server-cpu>
        </div>
      </el-col>
      <el-col :xs="24" :sm="12" :lg="12">
        <div class="content-div">
          <div class="title">
            <i class="iconfont icon-yingyong2 title-icon"></i>
            <span>内存信息</span>
          </div>
          <server-memory height="200px"></server-memory>
        </div>
      </el-col>
    </el-row>
    <div class="content-div">
      <div class="title">
        <i class="iconfont icon-yingyong2 title-icon"></i>
        <span>磁盘状态</span>
      </div>
      <server-disks height="200px"></server-disks>
    </div>
    <el-row :gutter="15">
      <el-col :xs="24" :sm="24" :lg="24">
        <div class="content-div">
          <div class="title">
            <i class="iconfont icon-yingyong2 title-icon"></i>
            <span>服务器信息</span>
          </div>
          <server-system className="serverClass" height="180px"></server-system>
        </div>
      </el-col>
      <!--<el-col :xs="24" :sm="12" :lg="12">-->
      <!--<div class="content-div">-->
      <!--<div class="title">-->
      <!--<i class="iconfont icon-yingyong2 title-icon"></i>-->
      <!--<span>JAVA虚拟机信息</span>-->
      <!--</div>-->
      <!--<server-jvm height="180px"></server-jvm>-->
      <!--</div>-->
      <!--</el-col>-->
    </el-row>
  </div>
</template>

<script>
  const ServerCpu = () => import('./components/cpu/cpu.vue')
  const ServerDisks = () => import('./components/disks/disks.vue')
  const ServerMemory = () => import('./components/memory/memory.vue')
  import ServerJvm from  './components/jvm.vue'
  import ServerSystem from './components/system.vue'
  export default {
    name: 'sys_monitor',
    components: { ServerCpu, ServerDisks, ServerMemory, ServerJvm, ServerSystem },
    data() {
      return {

      }
    }
  }
</script>

<style lang="stylus" scoped>
  .monitor-wrapper {
    .content-div {
      border: 1px solid #ccc
      border-radius: 4px
      margin-bottom: 15px
      padding: 0 20px 20px;
      overflow-y: auto;
      .title {
        width 100%
        height: 40px;
        line-height: 40px;
        font-size 16px;
        display: flex;
        display: -webkit-flex;
        justify-content: flex-start;
        /*border-bottom: 1px solid #ccc*/
        .title-icon{
          padding-right: 8px;
          color: #409EFF;
          font-size: 18px;
        }
      }
      .serverClass{
        box-sizing: border-box;
        width: 80%;
        padding: 20px 10%;
      }
    }
  }
</style>
