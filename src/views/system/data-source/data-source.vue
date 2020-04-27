<!--
     /**
      * 用户信息抽取的数据源配置
      * @desc 组件描述
      * @example 调用示例
      *  <data-source></data-source>
      */
       -->
<template>
  <div class="content-wrapper">
    <!--<table-filter-form-->
    <!--:search-show='searchShow'-->
    <!--:search-fields='searchFields'-->
    <!--@filter-table='filterTable'>-->
    <!--</table-filter-form>-->
    <!-- 操作按钮和控制按钮(控制列的显示和隐藏) -->
    <el-row :gutter="10" class="optBar">
      <el-button icon="el-icon-plus" type="primary" size="mini" @click="addHandle">新增</el-button>
      <el-button icon="el-icon-delete" type="danger" size="mini" @click="deleteBatchHandle">批量删除</el-button>
      <el-button-group style="float: right">
        <!--        <el-button icon="iconfont icon-chaxun" :title="searchShow ? '关闭查询': '打开查询'" size="mini"
                           @click="searchShow = !searchShow"></el-button>-->
        <el-button icon="iconfont icon-shuaxin2" size="mini" title="刷新" @click="getTableData"></el-button>
        <!--<el-button icon="iconfont icon-ai-list" size="mini" title="选择列"></el-button>-->
      </el-button-group>
    </el-row>
    <!-- 数据列表 -->
    <el-table ref="table" align="center"
              size="small"
              :data="dataSourceList"
              @selection-change="handleSelectionChange">
      <el-table-column
        width="55"
        type="selection">
      </el-table-column>
      <el-table-column
        prop="dataSourceName"
        label="数据源名称"
        :show-overflow-tooltip="true"
        min-width="80">
      </el-table-column>
      <el-table-column
        prop="dataSourceType"
        label="数据源引擎"
        :show-overflow-tooltip="true"
        min-width="80">
      </el-table-column>
      <el-table-column
        prop="dataSourceUrl"
        label="URL"
        :show-overflow-tooltip="true"
        min-width="80">
      </el-table-column>
      <el-table-column
        prop="dataSourceTableName"
        label="数据表"
        :show-overflow-tooltip="true"
        min-width="80">
      </el-table-column>
      <el-table-column
        label="操作"
        align="right">
        <template slot-scope="scope">
          <el-button @click="viewHandle(scope.row)" plain type="success" size="mini">详情</el-button>
          <el-button @click="updateHandle(scope.row)" plain type="primary" size="mini">
            编辑
          </el-button>
          <el-button @click="deleteHandle(scope.row)" plain type="danger" size="mini">
            删除
          </el-button>
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

    <el-dialog :visible.sync="dialogShow" width="700px" :close-on-click-modal="false">
      <data-source-form ref="form" :model="formData" :opt-type="optType"></data-source-form>
      <template slot="footer">
        <el-button @click="cancel" size="small">取消</el-button>
        <el-button @click="testLink" type="warning" size="small">测试链接</el-button>
        <el-button @click="saveHandle" type="primary" size="small">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script>
  import pagination from 'mixins/pagination'
  import TableFilterForm from 'components/table-filter-form/table-filter-form.vue'
  import DataSourceForm from './data-source-form'
  import {
    AddDataSource,
    UpdateDataSource,
    DeleteDataSource,
    DeleteDataSourceBatch,
    TestDataSource,
    GetDataSources
  } from 'request/services/dataSource'

  export default {
    name: 'data-source',
    mixins: [pagination],
    components: {  DataSourceForm },
    data () {
      return {
        searchShow: true,
        searchFields: [
          { type: 'input', label: '消息主题', fieldName: 'msgTitle', placeholder: '请输入消息主题查询' }
        ],
        formInline: true,
        dataSourceList: [],
        dialogShow: false,
        formData: {},
        optType: 'view',
        selectionData: [],
        selectionDataIds: []
      }
    },
    created () {
      this.getTableData()
    },
    methods: {
      getDataModel () {
        return {
          connectName: '',
          ip: '',
          port: '',
          userName: '',
          password: '',
          database: '',
          datatable: '',
          databaseType: ''
        }
      },
      testLink () {
        this.$refs['form'].validate(result => {
          if (result) {
            TestDataSource(this.$refs['form'].getFormData()).then(resp => {
              this.$alert('链接成功！', '提示', { type: 'success' })
            }).catch(error => {
              console.error('test', error)
              this.$alert('链接失败，请检查表单输入项！', '错误', { type: 'error' })
            })
          } else {
            this.$alert('请填写表单必填项！', '提示', { type: 'warning' })
          }
        })
      },
      filterTable () {
        this.getTableData({})
      },
      getTableData () {
        var condition = Object.assign({}, this.paginationParams)
        GetDataSources(condition).then(resp => {
          this.dataSourceList = resp.data.list
          this.pagination.totalCount=resp.data.totalCount
          console.log('datasource', resp)
        })
      },
      getPageData () {
        this.getTableData()
      },
      handleSelectionChange (selections) {
        this.selectionData = selections
        this.selectionDataIds = this.selectionData.map(item => {
          return item.id
        })
      },
      closeDialog () {
        this.dialogShow = false
      },
      cancel () {
        this.closeDialog()
      },
      addHandle () {
        this.dialogShow = true
        this.optType = 'add'
      },
      viewHandle (row) {
        this.formData = row
        this.optType = 'view'
        this.dialogShow = true
      },
      updateHandle (row) {
        this.formData = row
        this.optType = 'update'
        this.dialogShow = true
      },
      deleteHandle (row) {
        this.$confirm('请确认是否删除该数据源？', '提示', {
          confirmButtonText: '确 定',
          cancelButtonText: '取 消',
          closeOnClickModal: false,
          type: 'warning'
        }).then(() => {
          DeleteDataSource(row.id).then(resp => {
            this.resetCurrentPage()
            this.getPageData()
            this.$notify({ title: '提示', message: '删除成功！', type: 'success' })
          })
        })
      },
      deleteBatchHandle () {
        this.$confirm('请确认是否删除所选数据源？', '提示', {
          confirmButtonText: '确 定',
          cancelButtonText: '取 消',
          closeOnClickModal: false,
          type: 'warning'
        }).then(() => {
          DeleteDataSourceBatch(this.selectionDataIds).then(resp => {
            this.resetCurrentPage()
            this.getPageData()
            this.$notify({ title: '提示', message: '删除成功！', type: 'success' })

          })
        })
      },
      saveHandle () {
        if (this.optType === 'view') {
          this.closeDialog()
          return
        }

        this.$refs['form'].validate(valid => {
          if (valid) {
            // TestDataSource(this.$refs['form'].getFormData()).then(resp => {
            //   if (this.optType === 'add') {
            //     this.add()
            //   } else if (this.optType === 'update') {
            //     this.update()
            //   }
            // }).catch(error => {
            //   console.error('test', error)
            //   this.$alert('链接失败，请检查表单输入项！', '错误', { type: 'error' })
            // })
            if (this.optType === 'add') {
              this.add()
            } else if (this.optType === 'update') {
              this.update()
            }
          }
        })
      },
      add () {
        AddDataSource(this.$refs['form'].getFormData()).then(resp => {
          this.getPageData()
          this.closeDialog()
          this.$notify({
            title: '提示',
            message: '添加成功！',
            type: 'success',
          })
        })
      },
      update () {
        UpdateDataSource(this.$refs['form'].getFormData()).then(resp => {
          this.getPageData()
          this.closeDialog()
          this.$notify({
            title: '提示',
            message: '编辑成功！',
            type: 'success',
          })
        })
      }
    },
    watch: {
      'dialogShow' (nv) {
        if (!nv) {
          this.$refs['form'].clearValidate()
          this.$refs['form'].resetFields()
          this.formData = this.getDataModel()
        }
      }
    }
  }
</script>

<style scoped>

</style>
