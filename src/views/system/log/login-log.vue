<!--
    /**
     * 登录日志管理页面
     * 调用示例：
     * <login-log></login-log>
     */
-->
<template>
  <div>
    <transition name="el-zoom-in-top">
      <el-form v-show="searchShow" v-model="queryCondition" :inline="true" size="mini">
        <el-form-item label="登录名" class="filter-item-margin">
          <el-input clearable v-model="queryCondition.loginName"
                    placeholder="请输入登录名查询" @input="conditionInput"></el-input>
        </el-form-item>
        <el-form-item label="状态" class="filter-item-margin">
          <dict-select :dict-type="statusOptions"
                       v-model="queryCondition.status"
                       filterable clearable
                       @change="conditionInput">
          </dict-select>
        </el-form-item>
        <el-form-item label="日期" class="filter-item-margin">
          <el-date-picker
            v-model="queryCondition.loginTime"
            type="daterange"
            align="right"
            unlink-panels
            :default-time="['00:00:00', '23:59:59']"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :picker-options="pickerOptions"
            @change="conditionInput">
          </el-date-picker>
        </el-form-item>
      </el-form>
    </transition>
    <el-row :gutter="10" class="optBar">
      <el-button icon="el-icon-delete" plain type="primary" size="mini" @click="batchDelete"
                 v-hasPerm="'LOG_LOGIN_BATCHDEL_B'"
                 :disabled="selectionData.length === 0">批量删除</el-button>
      <el-button icon="el-icon-download" plain type="primary" size="mini" @click="loginExport">批量导出</el-button>
      <el-button-group style="float: right">
        <el-button icon="iconfont icon-chaxun" :title="searchShow ? '关闭查询': '打开查询'" size="mini" @click="searchShow = !searchShow"></el-button>
        <el-button icon="iconfont icon-shuaxin2" size="mini" title="刷新" @click="getTableData"></el-button>
        <!--<el-button icon="iconfont icon-ai-list" size="mini" title="选择列"></el-button>-->
      </el-button-group>
    </el-row>
    <div>
      <!--<div>已选择<span>{{selectionData.length}}</span>条数据</div>-->
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
          prop="loginName"
          label="登录名"
          :show-overflow-tooltip="true"
          min-width="80">
        </el-table-column>
        <el-table-column
          prop="ipaddr"
          label="登录IP"
          :show-overflow-tooltip="true"
          min-width="100">
        </el-table-column>
        <!--<el-table-column-->
        <!--prop="loginLocation"-->
        <!--label="登录地点"-->
        <!--:show-overflow-tooltip="true"-->
        <!--min-width="100">-->
        <!--</el-table-column>-->
        <el-table-column
          prop="browser"
          label="浏览器类型"
          :show-overflow-tooltip="true">
        </el-table-column>
        <el-table-column
          prop="os"
          label="操作系统"
          :show-overflow-tooltip="true">
        </el-table-column>
        <el-table-column
          prop="status"
          label="登录状态">
          <template slot-scope="scope">
            <el-tag :type="scope.row.status == '0'? 'success' : 'info'" size="mini">{{scope.row.status|dictFilter('sys_log_status')}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          prop="msg"
          label="登录结果"
          :show-overflow-tooltip="true"
          min-width="120">
        </el-table-column>
        <el-table-column
          prop="loginTime"
          label="登录时间"
          :show-overflow-tooltip="true"
          sortable="custom"
          min-width="134">
        </el-table-column>
        <el-table-column
          min-width="80"
          label="操作"
          prop="id">
          <template slot-scope="scope">
            <div>
              <el-button
                size="mini"
                plain
                type="danger"
                v-hasPerm="'LOG_LOGIN_DELETE_B'"
                @click="deleteHandle(scope.row.infoId)">
                删除
              </el-button>
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
  import pagination from 'mixins/pagination.js'
  import DictSelect from 'components/form-input/dict-select'
  import { GetLoginLogs, DeleteLoginLog, DeleteLoginLogBatch, DownloadLoginList } from 'request/services/log.js'
  import basePage from 'mixins/base-page.js'
  import debounce from 'utils/debounce.js'
  import dataFormatFnList from 'utils/dateFormat.js'
  import { exportFile } from 'request/services/download.js'

  export default {
    name: 'sys_login_log',
    mixins: [pagination, basePage],
    components: { DictSelect },
    props: {},
    data () {
      return {
        statusOptions: 'sys_log_status',
        pickerOptions: {
          shortcuts: [{
            text: '最近一周',
            onClick (picker) {
              const end = dataFormatFnList.getPresentTime()
              const start = new Date()
              start.setTime(end.getTime() - 3600 * 1000 * 24 * 6)
              end.setTime(end.getTime() + 3600 * 1000 * 24  - 1000)
              picker.$emit('pick', [start, end])
            }
          }, {
            text: '最近一个月',
            onClick (picker) {
              const end = dataFormatFnList.getPresentTime()
              const start = new Date()
              start.setTime(end.getTime() - 3600 * 1000 * 24 * 29)
              end.setTime(end.getTime() + 3600 * 1000 * 24  - 1000)
              picker.$emit('pick', [start, end])
            }
          }, {
            text: '最近三个月',
            onClick (picker) {
              const end = dataFormatFnList.getPresentTime()
              const start = new Date()
              start.setTime(end.getTime() - 3600 * 1000 * 24 * 89)
              end.setTime(end.getTime() + 3600 * 1000 * 24  - 1000)
              picker.$emit('pick', [start, end])
            }
          }]
        },
        searchShow: true,
        // 检索条件
        queryCondition: {
          loginName: '',
          status: '',
          loginTime: []
        },
        // 排序条件
        sortParam: {
          orderDesc: ['loginTime'],
          orderAsc: []
        },
        selectionData: [],
        selectionDataIds: [],
        tableData: []
      }
    },
    methods: {
      getHeaderStyle: function ({ row, rowIndex }) {
        return {
          background: '#F0F2F5'
        }
      },
      getTableData: function () {
        var condition = Object.assign({}, this.paginationParams, this.sortParam, this.queryCondition)
        GetLoginLogs(condition).then(res => {
          this.tableData = res.data.list
          this.pagination.totalCount = res.data.totalCount
        })
      },
      getPageData () {
        this.getTableData()
      },
      // 查询
      conditionInput: function () {
        if (this.queryCondition.loginTime && this.queryCondition.loginTime.length > 0) {
          this.queryCondition.loginTime[0] = dataFormatFnList.timeFormat(this.queryCondition.loginTime[0])
          this.queryCondition.loginTime[1] = dataFormatFnList.timeFormat(this.queryCondition.loginTime[1])
        }
        var that = this
        // 防止每次输入都会触发查询事件
        debounce(function () {
          that.resetCurrentPage()
          that.getTableData()
        }, 500)()
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
        this.$confirm('请确认是否删除该日志？', '提示', {
          confirmButtonText: '确 定',
          cancelButtonText: '取 消',
          closeOnClickModal: false,
          type: 'warning'
        }).then(() => {
          DeleteLoginLog(id).then(res => {
            this.$notify({
              title: '成功',
              message: '删除成功',
              type: 'success'
            })
            this.getTableData()
          })
        }).catch(() => {
        })
      },
      selectionChange: function (selections) {
        this.selectionData = selections
        this.selectionDataIds = this.selectionData.map(item => {
          return item.infoId
        })
      },
      // 批量删除
      batchDelete: function () {
        this.$confirm('请确认是否删除当前选中的日志？', '提示', {
          confirmButtonText: '确 定',
          cancelButtonText: '取 消',
          closeOnClickModal: false,
          type: 'warning'
        }).then(() => {
          DeleteLoginLogBatch(this.selectionDataIds).then(res => {
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
      //批量导出
      loginExport(){
        var data = Object.assign({}, this.queryCondition);
        DownloadLoginList(data).then (res => {
          exportFile(res, 'xls', '登录日志导出列表');
        })
      }
    },
    mounted: function () {
      this.getTableData()
    }
  }
</script>

<style scoped>

</style>
