<template>
  <div :class="className" :style="{height:height,width:width}">
    <lengthways-table :columns="columns" :tableData="tableData"></lengthways-table>
  </div>
</template>
<script>
  import LengthwaysTable from 'components/lengthway-table/lengthwaysTable'
  import { GetServerSys } from 'request/services/monitor'
  export default {
    name: 'server-system',
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
            name: '服务器名称',
            key: 'computerName'
          },
          {
            name: '服务器IP',
            key: 'computerIp'
          },
          {
            name: '操作系统',
            key: 'osName'
          },
          {
            name: '系统架构',
            key: 'osArch'
          },
          {
            name: '用户目录',
            key: 'userDir'
          }
        ],
        tableData: {}
      }
    },
    mounted() {
      this.getSystemData()
    },
    methods: {
      getSystemData() {
        GetServerSys().then(res => {
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

