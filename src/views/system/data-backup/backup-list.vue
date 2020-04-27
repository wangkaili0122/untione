<!--
     /**
      * 本地服务器数据备份
      * @desc 组件描述
      * @example 调用示例
      */
       -->
<template>
  <div>
    <backup-setting @getTableData="getTableData" :serverInfo="serverInfo"></backup-setting>
    <backup-table :getTable="getTable" @over="over" :serverInfo="serverInfo"></backup-table>
  </div>
</template>

<script>
  import BackupSetting from "./components/backup-setting";
  import BackupTable from "./components/backup-table";
  import basePage from 'mixins/base-page.js'
  export default {
    name: 'backup-list',
    components: {BackupTable, BackupSetting},
    mixins: [basePage],
    data() {
      return {
        getTable:false,
        serverInfo:{}
      }
    },
    created() {
    },
    methods: {
      getTableData(){
        this.getTable = true
      },
      over(){
        this.getTable = false
      }
    },
    mounted(){
      this.serverInfo = JSON.parse(this.$route.query.serverInfo);
    }
  }
</script>

<style scoped>

</style>
