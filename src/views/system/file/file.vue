<!--
    /**
     * 文件管理
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

      <el-upload
        style="display: inline-block;text-align: center"
        :show-file-list="false"
        :multiple="false"
        :limit="1"
        :action="uploadUrl"
        :headers="headers"
        :file-list="fileList"
        name="file"
        :data="fileType"
        :before-upload="beforeUpload"
        :on-exceed="handleExceed"
        :on-success="handleSuccess"
        :on-error="uploadError">
        <el-button slot="trigger" icon="el-icon-plus" type="primary" size="mini"
                   v-hasPerm="'PLATFORM_FILE_ADD_B'">新增
        </el-button>
      </el-upload>

      <el-button icon="el-icon-delete" plain type="primary" size="mini" @click="batchDelete"
                 v-hasPerm="'PLATFORM_FILE_BATCHDEL_B'"
                 :disabled="selectionData.length === 0" style="margin-left: 10px">批量删除
      </el-button>

      <el-button-group style="float: right">
        <el-button icon="iconfont icon-chaxun" :title="searchShow ? '关闭查询': '打开查询'" size="mini"
                   @click="searchShow = !searchShow"></el-button>
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
          prop="fileName"
          label="文件名称"
          :show-overflow-tooltip="true">
          <template slot-scope="scope">
            <a @click="fileDownload(scope.row)">{{scope.row.fileName}}</a>
          </template>
        </el-table-column>
        <el-table-column
          prop="fileTime"
          label="创建时间"
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
                         v-hasPerm="'PLATFORM_FILE_DELETE_B'" @click="deleteHandle(scope.row.fileId)">删除
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
  import TableFilterForm from 'components/table-filter-form/table-filter-form.vue'
  import pagination from 'mixins/pagination.js'
  import { GetFileList, DeleteFile, DeleteFileBatch, FileDownload } from 'request/services/file.js'
  import { downloadFile } from 'request/services/download.js'
  import API from 'request/api/file.js'
  import basePage from 'mixins/base-page.js'
  import Auth from 'utils/auth'

  export default {
    name: 'sys_file',
    mixins: [pagination, basePage],
    components: { TableFilterForm },
    props: {},
    data () {
      return {
        searchShow: true,
        // 检索条件
        queryCondition: {
          fileName: ''
        },
        searchFields: [
          { type: 'input', label: '文件名称', fieldName: 'fileName', placeholder: '请输入文件名称查询' }
        ],
        uploadUrl: this.$project.serverUrl + API.FILE_ADD,
        headers: {
          'X-Requested-With': 'XMLHttpRequest',
          'access-token': this.$store.getters['auth/getToken']()
        },
        fileList: [],
        // 排序条件
        sortParam: {
          orderDesc: ['fileTime'],
          orderAsc: []
        },
        selectionData: [],
        selectionDataIds: [],
        tableData: [],
        fileType: {
          fileType: '0'
        }
      }
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
        GetFileList(condition).then(res => {
          this.tableData = res.data.list
          this.pagination.totalCount = res.data.totalCount
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
        this.$confirm('请确认是否删除该文件？', '提示', {
          confirmButtonText: '确 定',
          cancelButtonText: '取 消',
          closeOnClickModal: false,
          type: 'warning'
        }).then(() => {
          DeleteFile(id).then(res => {
            if (this.tableData.length < this.pagination.size) {
              this.pagination.totalCount--
              var index = this.tableData.findIndex(item => item.fileId === id)
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
          return item.fileId
        })
      },
      // 批量删除
      batchDelete: function () {
        this.$confirm('请确认是否删除当前选中的文件？', '提示', {
          confirmButtonText: '确 定',
          cancelButtonText: '取 消',
          closeOnClickModal: false,
          type: 'warning'
        }).then(() => {
          DeleteFileBatch(this.selectionDataIds).then(res => {
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
      fileDownload (file) {
        return FileDownload(file.fileId).then(res => {
          downloadFile(file.fileName, res, (errorMsg) => {
            this.$notify({
              title: '错误',
              message: errorMsg,
              type: 'error'
            })
          })
          return this
        })
      },
      // 上传文件超过限制个数
      handleExceed (file, fileList) {
        if (file.length > 1) {
          this.$notify({
            title: '提示',
            message: '一次只能上传一个文件，请重新上传',
            type: 'warning'
          })
        } else {
          this.$notify({
            title: '提示',
            message: '您已添加了一个文件，如需替换，请先删除已添加文件',
            type: 'warning'
          })
        }
      },
      // 附件上传成功
      handleSuccess (res, file, fileList) {
        this.fileList = []
        if (res.code === '0') {
          this.getTableData()
          this.$notify({
            title: '成功',
            message: '文件上传成功',
            type: 'success'
          })
        } else {
          this.$notify({
            title: '错误',
            message: res.message,
            type: 'error'
          })
        }
      },
      beforeUpload (file) {
        //判断文件大小
        if (file.size <= 10247180) {
          return true
        } else {
          this.$notify({
            title: '错误',
            message: '文件大小超出限制，请上传小于10M的文件！',
            type: 'error'
          })
          return false
        }
      },
      // 文件上传失败
      uploadError (res, file, fileList) {
        this.fileList = []
        this.$notify({
          title: '错误',
          message: res.message,
          type: 'error'
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
