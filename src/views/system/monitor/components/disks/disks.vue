<!--
 /**
  * 服务监控-磁盘状态
  * @desc 组件描述
  * @example 调用示例
  */
-->
<template>
  <div :class="className" :style="{height:height,width:width}">
    <div class="content-left">
      <disks-chart v-if="disksInfoData.length > 0" :height="height" :chart-option-data="disksInfoData"></disks-chart>
      <div v-else class="no-data"></div>
    </div>
    <div class="table-content-right">
      <div class="divider"></div>
      <div class="table-content">
        <el-table :data="disksInfoData" :max-height="height" style="overflow-y: auto">
          <el-table-column
            prop="dirName"
            label="盘符路径"
            :show-overflow-tooltip="true">
          </el-table-column>
          <el-table-column
            prop="typeName"
            label="文件系统"
            min-width="160"
            :show-overflow-tooltip="true">
          </el-table-column>
          <el-table-column
            prop="sysTypeName"
            label="盘符类型"
            :show-overflow-tooltip="true"
          >
          </el-table-column>
          <el-table-column
            prop="total"
            label="总大小"
            :show-overflow-tooltip="true"
          >
          </el-table-column>
          <el-table-column
            prop="free"
            label="可用大小"
            :show-overflow-tooltip="true"
          >
          </el-table-column>
          <el-table-column
            prop="used"
            label="已用大小"
            :show-overflow-tooltip="true"
          >
          </el-table-column>
          <el-table-column
            prop="usage"
            label="已用百分比"
            :show-overflow-tooltip="true">
          </el-table-column>
        </el-table>
        <!--<p><span class="content-item">总大小：</span><span class="content-value">{{disksInfoData.total}}</span></p>-->
        <!--<p><span class="content-item">可用大小：</span><span class="content-value">{{disksInfoData.free}}</span></p>-->
        <!--<p><span class="content-item">已用大小：</span><span class="content-value">{{disksInfoData.used}}</span></p>-->
        <!--<p><span class="content-item">已用百分比：</span><span class="content-value">{{disksInfoData.usage}}</span></p>-->
      </div>
      <!--<div class="content">-->
      <!--<p><span class="content-item">盘符路径：</span><span class="content-value">{{disksInfoData.dirName}}</span></p>-->
      <!--<p><span class="content-item">文件系统：</span><span class="content-value">{{disksInfoData.typeName}}</span></p>-->
      <!--<p><span class="content-item">盘符类型：</span><span class="content-value">{{disksInfoData.sysTypeName}}</span></p>-->
      <!--</div>-->
    </div>
  </div>
</template>

<script>
  import { GetServerDisks } from 'request/services/monitor.js'
  const DisksChart = () => import('./disks-chart')
  export default {
    name: 'server-disks',
    components: { DisksChart },
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
        disksInfoData: [],
        timeId: null
      }
    },
    mounted() {
      this.getDisksInfoData();
      var that = this;
      this.timeId = setInterval(function(){
        that.getDisksInfoData();
      },30000);
    },
    beforeDestroy () {
      var that = this;
      clearInterval(that.timeId);
    },
    methods: {
      getDisksInfoData () {
        GetServerDisks().then(res => {
          this.disksInfoData = res.data.data
          // const aa = [
          //   {
          //     dirName: "C:",
          //     free: "65.8 GB",
          //     sysTypeName: "NTFS",
          //     total: "146.4 GB",
          //     typeName: "Local Fixed Disk (C:)",
          //     usage: 95.03,
          //     used: "80.6 GB",
          //   },
          //   {
          //     dirName: "C:",
          //     free: "65.8 GB",
          //     sysTypeName: "NTFS",
          //     total: "146.4 GB",
          //     typeName: "Local Fixed Disk (C:)",
          //     usage: 75.03,
          //     used: "80.6 GB",
          //   },
          //   {
          //     dirName: "C:",
          //     free: "65.8 GB",
          //     sysTypeName: "NTFS",
          //     total: "146.4 GB",
          //     typeName: "Local Fixed Disk (C:)",
          //     usage: 95.03,
          //     used: "80.6 GB",
          //   },
          //   {
          //     dirName: "C:",
          //     free: "65.8 GB",
          //     sysTypeName: "NTFS",
          //     total: "146.4 GB",
          //     typeName: "Local Fixed Disk (C:)",
          //     usage: 95.03,
          //     used: "80.6 GB",
          //   },
          //   {
          //     dirName: "C:",
          //     free: "65.8 GB",
          //     sysTypeName: "NTFS",
          //     total: "146.4 GB",
          //     typeName: "Local Fixed Disk (C:)",
          //     usage: 95.03,
          //     used: "80.6 GB",
          //   },
          //   {
          //     dirName: "C:",
          //     free: "65.8 GB",
          //     sysTypeName: "NTFS",
          //     total: "146.4 GB",
          //     typeName: "Local Fixed Disk (C:)",
          //     usage: 95.03,
          //     used: "80.6 GB",
          //   }
          //   ]
          // this.disksInfoData = this.disksInfoData.concat(aa)
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
      position relative
      .chart {
        width 100%
        height 100%
      }
      .no-data {
        width 100px
        height 100px
        text-align: center;
        font-weight: bold;
        line-height: 140px;
        color: #666;
        background-size 100% 100%
        background-image: url("~@/assets/img/nodata.png")
        background-repeat no-repeat
        position absolute
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
      }
    }
    .table-content-right {
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
      .table-content {
        width: calc(100% - 1px);
        width: -webkit-calc(100% - 1px);
        flex-grow 1
        /*margin:0 auto*/
        padding: 0 0 0 20px
        font-size 14px
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
