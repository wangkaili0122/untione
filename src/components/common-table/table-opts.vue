<!--
/**
* 表格顶部的通用操作按钮
*/
-->
<template>
  <el-button-group style="float: right">
    <el-button icon="iconfont icon-chaxun" size="mini" title="查询" @click="searchShow = !searchShow"></el-button>
    <el-button icon="iconfont icon-shuaxin2" size="mini" title="刷新" @click="getTableData"></el-button>
    <el-button icon="iconfont icon-ai-list" size="mini" title="选择列"></el-button>
  </el-button-group>
</template>
<script>
  export default {
    name: 'table-opts',
    data() {
      return {}
    },
    created() {

    },
    methods: {}
  }
</script>
<style lang="stylus" scoped>
  .tableopt {

  }
</style>
