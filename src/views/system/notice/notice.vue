<!--
    /**
     * 公告管理
     */
-->
<template>
  <div>
    <table-filter-form
      :search-show='searchShow'
      :search-fields='searchFields'
      :form-inline='queryCondition'
      @filter-table='filterTable'>
    </table-filter-form>
    <el-row :gutter="10" class="optBar">
      <el-button icon="el-icon-plus" type="primary" size="mini"
                 v-if="hasPagePerm" @click="addHandle">新增</el-button>
      <el-button icon="el-icon-delete" plain type="primary" size="mini" @click="batchDelete"
                 v-hasPerm="'PLATFORM_NOTICE_BATCHDEL_B'"
                 :disabled="selectionData.length === 0">批量删除</el-button>
      <el-button-group style="float: right">
        <el-button icon="iconfont icon-chaxun" :title="searchShow ? '关闭查询': '打开查询'" size="mini" @click="searchShow = !searchShow"></el-button>
        <el-button icon="iconfont icon-shuaxin2" size="mini" title="刷新" @click="getTableData"></el-button>
        <!--<el-button icon="iconfont icon-ai-list" size="mini" title="选择列"></el-button>-->
      </el-button-group>
    </el-row>
    <div>
      <el-table
        :header-cell-style="getHeaderStyle"
        :data="tableData"
        @sort-change="sortChange"
        @selection-change="selectionChange">
        <el-table-column
          width="55"
          type="selection">
        </el-table-column>
        <el-table-column
          prop="noticeTitle"
          label="公告标题"
          :show-overflow-tooltip="true">
          <template slot-scope="scope">
            <a @click="toDetail(scope.row)">{{scope.row.noticeTitle}}</a>
          </template>
        </el-table-column>
        <!--<el-table-column-->
        <!--prop="noticeOrigin"-->
        <!--label="来源"-->
        <!--width="250"-->
        <!--:show-overflow-tooltip="true">-->
        <!--</el-table-column>-->
        <el-table-column
          prop="noticeCreateTime"
          label="发布时间"
          width="240"
          :show-overflow-tooltip="true">
        </el-table-column>
        <el-table-column
          label="操作"
          width="100"
          prop="id">
          <template slot-scope="scope">
            <div>
              <el-button size="mini" plain type="danger"
                         v-hasPerm="'PLATFORM_NOTICE_DELETE_B'" @click="deleteHandle(scope.row.noticeId)">删除</el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <!--翻页组件-->
      <el-pagination style="margin-top: 15px;"
                     :align="pagination.align"
                     :background="pagination.background"
                     @size-change="handleSizeChange"
                     @current-change="handleCurrentChange"
                     :current-page="pagination.current"
                     :page-sizes="pagination.pageSizes"
                     :page-size="pagination.size"
                     :layout="pagination.layout"
                     :total="pagination.totalCount">
      </el-pagination>
    </div>
  </div>
</template>

<script>
  import TableFilterForm from 'components/table-filter-form/table-filter-form.vue'
  import pagination from 'mixins/pagination.js'
  import { GetNoticeList, DeleteNotice, DeleteNoticeBatch } from 'request/services/notice.js'
  import basePage from 'mixins/base-page.js'

  export default {
    name: 'sys_notice',
    mixins: [pagination, basePage],
    components: { TableFilterForm },
    props: {},
    data () {
      return {
        searchShow: true,
        // 检索条件
        queryCondition: {
          noticeTitle: ''
        },
        searchFields: [
          { type: 'input', label: '公告标题', fieldName: 'noticeTitle', placeholder: '请输入公告标题查询' }
        ],
        // 排序条件
        sortParam: {
          orderDesc: ['noticeCreateTime'],
          orderAsc: []
        },
        selectionData: [],
        selectionDataIds: [],
        tableData: [],
        hasPagePerm: null
      }
    },
    created () {
      this.hasPagePerm = this.$store.getters['permission/hasPagePerm']('sys_notice_add')
      this.getTableData()
    },
    activated (){
      this.getTableData()
    },
    methods: {
      // 查询
      filterTable (val) {
        this.queryCondition = val
        this.resetCurrentPage()
        this.getTableData()
      },
      getHeaderStyle: function ({ row, rowIndex }) {
        return {
          background: '#F0F2F5'
        }
      },
      getTableData: function () {
        var condition = Object.assign({}, this.paginationParams, this.sortParam, this.queryCondition)
        GetNoticeList(condition).then(res => {
          this.tableData = res.data.data.list
          this.pagination.totalCount = res.data.data.totalCount
        })
      },
      getPageData () {
        this.getTableData()
      },
      // 当表格的排序条件发生变化的时候会触发该事件
      sortChange (val) {
        if (!val.prop) {
          return
        }
        this.sortParam.orderDesc = []
        this.sortParam.orderAsc = []
        if (val.order === 'descending') {
          this.sortParam.orderDesc.push(val.prop)
        } else {
          this.sortParam.orderAsc.push(val.prop)
        }
        this.resetCurrentPage()
        this.getTableData()
      },
      deleteHandle: function (id) {
        this.$confirm('请确认是否删除该公告？', '提示', {
          confirmButtonText: '确 定',
          cancelButtonText: '取 消',
          closeOnClickModal: false,
          type: 'warning'
        }).then(() => {
          DeleteNotice(id).then(res => {
            if (this.tableData.length < this.pagination.size) {
              this.pagination.totalCount--
              var index = this.tableData.findIndex(item => item.noticeId === id)
              this.tableData.splice(index, 1)
            } else {
              this.getTableData()
            }
            this.$notify({
              title: '成功',
              message: '删除成功',
              type: 'success'
            })
          })
        }).catch(() => {
        })
      },
      selectionChange: function (selections) {
        this.selectionData = selections
        this.selectionDataIds = this.selectionData.map(item => {
          return item.noticeId
        })
      },
      // 批量删除
      batchDelete: function () {
        this.$confirm('请确认是否删除当前选中的公告？', '提示', {
          confirmButtonText: '确 定',
          cancelButtonText: '取 消',
          closeOnClickModal: false,
          type: 'warning'
        }).then(() => {
          DeleteNoticeBatch(this.selectionDataIds).then(res => {
            this.$notify({
              title: '成功',
              message: '批量删除成功',
              type: 'success'
            })
            this.getTableData()
          })
        }).catch(() => {
        })
      },
      // 新增操作
      addHandle () {
        this.$router.push({ name: 'sys_notice_add' })
      },
      toDetail (row) {
        let path = '/index.html#/newsNoticeDetail?noticeId=' + row.noticeId
        window.open(path, '_blank')
      }
    }
  }
</script>

<style scoped>

</style>
