<!--
/**
  * 纵向表格
  * @desc 纵向表格基本功能，两列式
  * @desc 组件描述
  * @author 21086
  * @data 2020/4/26
  * @example 调用示例
  *  <mailTable :tableData="tableData" :tableStyle="{ width:'600px' }"></mailTable>
  */
-->
<template>
  <table class="mailTable" :style="styleObject" v-if="showRow">
    <tr v-for="index in rowCount" :key="index">
      <td class="column">{{ columns[index*2-2] ? columns[index*2-2].name : '' }}</td>
      <td>{{ (columns[index*2-2] && columns[index*2-2].key) ? tableData[columns[index*2-2].key] : ''}}</td>
      <td class="column">{{ columns[index*2-1] !== undefined ? columns[index*2-1].name : '' }}</td>
      <td>{{ (columns[index*2-1] && columns[index*2-1].key !== undefined) ? tableData[columns[index*2-1].key] : '' }}</td>
    </tr>
  </table>
  <table class="mailTable" :style="styleObject" v-else>
    <tr v-for="index in rowCount" :key="index">
      <td class="column">{{ columns[index-1] ? columns[index-1].name : ''}}</td>
      <td>{{ (columns[index-1] && columns[index-1].key) ? tableData[columns[index-1].key] : '' }}</td>
      <td class="column">{{ columns[rowCount+index-1] !== undefined ? columns[rowCount+index-1].name : '' }}</td>
      <td>{{ (columns[rowCount+index-1] && columns[rowCount+index-1].key !== undefined) ? tableData[columns[rowCount+index-1].key] : '' }}</td>
    </tr>
  </table>
</template>

<script>
  export default {
    data() {
      return {
        styleObject: {},
        showRow: true,
      };
    },
    props: {
      columns: {
        type: Array,
        default: () => []
      },
      tableData: {
        type: Object,
        required: true,
        default: () => {}
      },
      tableStyle: {
        type: Object,
        default: () => {}
      },
      showByRow: {
        type: Boolean,
        default: () => false
      }
    },
    computed: {
      rowCount: function () {
        return Math.ceil(this.columns.length / 2);
      }
    },
    created() {
      this.styleObject = this.tableStyle;
      if (this.showByRow !== undefined) {
        this.showRow = this.showByRow;
      }
    },
  }
</script>
<style  lang="stylus" scoped>
  .mailTable {
    border-collapse: collapse;
    margin: 0 auto;
    width: 100%;
    margin-top: 10px;
    font-size: 14px;
    color:#333;
    text-align: left;
    tr {
      height: 35px;
      td, th {
        border-bottom: 1px solid #ddd;
        color: #666;
        padding: 8px;
        display: table-cell;
        vertical-align: middle;
      }
      :nth-child(odd)
      {
        background: #fff;
      }
      :nth-child(even)
      {
        background: #fff;
      }
    }
  }
</style>
