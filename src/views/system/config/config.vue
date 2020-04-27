<!--
    /**
     * 参数管理页面
     * 调用示例：
     * <config></config>
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
                 v-hasPerm="'SYS_CONFIG_ADD_B'" @click="addHandle">新增</el-button>
      <el-button icon="el-icon-delete" plain type="primary" size="mini" @click="batchDelete"
                 v-hasPerm="'SYS_CONFIG_BATCHDEL_B'"
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
          prop="configName"
          label="参数名称"
          :show-overflow-tooltip="true">
        </el-table-column>
        <el-table-column
          prop="configKey"
          label="参数键名"
          :show-overflow-tooltip="true">
        </el-table-column>
        <el-table-column
          prop="configValue"
          label="参数键值"
          :show-overflow-tooltip="true">
        </el-table-column>
        <el-table-column
          prop="configType"
          label="系统内置">
          <template slot-scope="scope">
            <el-tag :type="scope.row.configType == 'Y' ? '' : 'info'" size="mini">{{scope.row.configType|dictFilter('sys_yes_no')}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          prop="remark"
          label="备注"
          :show-overflow-tooltip="true">
        </el-table-column>
        <el-table-column
          label="操作"
          prop="id">
          <template slot-scope="scope">
            <div>
              <el-button size="mini" plain type="primary"
                         v-hasPerm="'SYS_CONFIG_UPDATE_B'" @click="updateHandle(scope.row)">编辑</el-button>
              <el-button size="mini" plain type="danger"
                         v-hasPerm="'SYS_CONFIG_DELETE_B'" @click="deleteHandle(scope.row.configId)">删除</el-button>
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
    <el-dialog :visible.sync="dialogVisible"
               :title="dialogTitle"
               width="40%"
               :before-close="dialogClose"
               :close-on-click-modal="false">
      <el-form ref="dialog-form" :model="dialogFormData" label-width="120px" :rules="rules" label-position="right">
        <el-form-item label="参数名称：" prop="configName">
          <el-input size="small" v-model="dialogFormData.configName" placeholder="请输入参数名称" class="dialog-input-width" clearable></el-input>
        </el-form-item>
        <el-form-item label="参数键名：" prop="configKey">
          <el-input size="small" v-model="dialogFormData.configKey" placeholder="请输入参数键名" class="dialog-input-width" clearable :disabled="optType=='update'"></el-input>
        </el-form-item>
        <el-form-item label="参数键值：" prop="configValue">
          <el-input size="small" v-model="dialogFormData.configValue" placeholder="请输入参数键值" class="dialog-input-width" clearable></el-input>
        </el-form-item>
        <el-form-item label="系统内置：" prop="configType">
          <dict-select :dict-type="configTypeOptions"
                       v-model="dialogFormData.configType"
                       filterable clearable size="small">
          </dict-select>
        </el-form-item>
        <el-form-item label="备注：">
          <el-input size="small" type="textarea" v-model="dialogFormData.remark" placeholder="请输入备注" class="dialog-input-width"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="form-button">
        <el-button size="small" @click="dialogClose">取 消</el-button>
        <el-button type="primary" size="small" @click="confirmClick(dialogTitle)">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import TableFilterForm from 'components/table-filter-form/table-filter-form.vue'
  import pagination from 'mixins/pagination.js'
  import DictSelect from 'components/form-input/dict-select'
  import { GetConfigAll, AddConfig, UpdateConfig, DeleteConfig, DeleteConfigBatch, CheckConfig } from 'request/services/config.js'
  import basePage from 'mixins/base-page.js'
  import debounce from 'utils/debounce.js'

  export default {
    name: 'sys_config',
    mixins: [pagination, basePage],
    components: { TableFilterForm, DictSelect },
    props: {},
    data () {
      var checkConfigName = (rule, value, callback) => {
        let checkStruct = RegExp(/^[\u4E00-\u9FA5A-Za-z0-9_]+$/).test(value)
        if (!checkStruct) {
          callback(new Error('只能包含中英文、数字和下划线'))
        } else {
          callback()
        }
      }
      var checkConfigKey = (rule, value, callback) => {
        let checkStruct = RegExp(/^[A-Za-z_-]+$/).test(value)
        if (!checkStruct) {
          callback(new Error('参数键名只能包含英文、短横线和下划线'))
        } else {
          if (this.dialogTitle === '编辑参数' && this.repeatConfigKey === value) {
            callback()
          } else {
            debounce(function () {
              CheckConfig(value).then(res => {
                if (res.data.data) {
                  callback()
                } else {
                  callback(new Error('此参数键名已存在'))
                }
              })
            }, 500)()
          }
        }
      }
      return {
        configTypeOptions: 'sys_yes_no',
        optType:'add',
        searchShow: true,
        // 检索条件
        queryCondition: {
          configName: ''
        },
        searchFields: [
          { type: 'input', label: '参数名称', fieldName: 'configName', placeholder: '请输入参数名称查询' }
        ],
        // 排序条件
        sortParam: {
          orderDesc: [],
          orderAsc: []
        },
        selectionData: [],
        selectionDataIds: [],
        tableData: [],
        dialogVisible: false,
        dialogTitle: '',
        dialogFormData: {},
        repeatConfigKey: '',
        rules: {
          configName: [
            { required: true, message: '请输入参数名称', trigger: 'blur' },
            { max: 30, message: '参数名称不能超过30个字符', trigger: 'blur' },
            { validator: checkConfigName, trigger: 'blur' }
          ],
          configKey: [
            { required: true, message: '请输入参数键名', trigger: 'blur' },
            { max: 30, message: '参数键名不能超过30个字符', trigger: 'blur' },
            { validator: checkConfigKey, trigger: 'blur' }
          ],
          configValue: [
            { required: true, message: '请输入参数键值', trigger: 'blur' },
            { max: 30, message: '参数键值不能超过30个字符', trigger: 'blur' },
            { validator: checkConfigName, trigger: 'blur' }
          ],
          remark: [
            { max: 150, min: 0, trigger: 'blur', message: '请输入0-150个文字的描述' }
          ]
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
        GetConfigAll(condition).then(res => {
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
        this.$confirm('请确认是否删除该参数？', '提示', {
          confirmButtonText: '确 定',
          cancelButtonText: '取 消',
          closeOnClickModal: false,
          type: 'warning'
        }).then(() => {
          DeleteConfig(id).then(res => {
            if (this.tableData.length < this.pagination.size) {
              this.pagination.totalCount--
              var index = this.tableData.findIndex(item => item.configId === id)
              this.tableData.splice(index, 1)
            } else {
              this.getTableData()
            }
            this.$notify({
              title: '成功',
              message: '删除成功',
              type: 'success',
            })
          })
        }).catch(() => {
        })
      },
      selectionChange: function (selections) {
        this.selectionData = selections
        this.selectionDataIds = this.selectionData.map(item => {
          return item.configId
        })
      },
      // 批量删除
      batchDelete: function () {
        this.$confirm('请确认是否删除当前选中的参数？', '提示', {
          confirmButtonText: '确 定',
          cancelButtonText: '取 消',
          closeOnClickModal: false,
          type: 'warning'
        }).then(() => {
          DeleteConfigBatch(this.selectionDataIds).then(res => {
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
        this.dialogFormData = {}
        this.optType='add'
        this.dialogTitle = '新增参数'
        this.dialogVisible = true
      },
      // 编辑操作
      updateHandle (val) {
        this.dialogFormData = Object.assign({}, val)
        this.repeatConfigKey = this.dialogFormData.configKey
        this.optType='update'
        this.dialogTitle = '编辑参数'
        this.dialogVisible = true
      },
      dialogClose () {
        this.dialogFormData = {}
        this.dialogVisible = false
        this.$refs['dialog-form'].resetFields()
      },
      confirmClick (val) {
        this.$refs['dialog-form'].validate(valid => {
          if (valid) {
            if (val === '新增参数') {
              this.doAdd()
            } else {
              this.doEdit()
            }
          }
        })
      },
      doAdd () {
        AddConfig(this.dialogFormData).then(res => {
          this.dialogClose()
          this.getTableData()
          this.$notify({
            title: '成功',
            message: '新增成功',
            type: 'success'
          })
        })
      },
      doEdit () {
        UpdateConfig(this.dialogFormData).then(res => {
          var index = this.tableData.findIndex(item => item.configId === this.dialogFormData.configId)
          this.tableData.splice(index, 1, JSON.parse(JSON.stringify(this.dialogFormData)))
          this.dialogClose()
          this.$notify({
            title: '成功',
            message: '编辑成功',
            type: 'success'
          })
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
