<!--
    /**
     * 字典类型管理页面
     * 调用示例：
     * <dict-type></dict-type>
     */
-->
<template>
  <div>
    <transition name="el-zoom-in-top">
      <el-form v-show="searchShow" v-model="queryCondition" :inline="true" size="mini">
        <el-form-item label="字典名称" class="filter-item-margin">
          <el-input clearable v-model="queryCondition.dictName"
                    placeholder="请输入字典名称查询" @input="conditionInput"></el-input>
        </el-form-item>
        <el-form-item label="状态" class="filter-item-margin">
          <dict-select :dict-type="statusOptions"
                       v-model="queryCondition.status"
                       filterable clearable
                       @change="conditionInput">
          </dict-select>
        </el-form-item>
      </el-form>
    </transition>
    <el-row :gutter="10" class="optBar">
      <el-button icon="el-icon-plus" type="primary" size="mini" v-hasPerm="'SYS_DIC_TYPE_ADD_B'" @click="addHandle">新增</el-button>
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
        @sort-change="sortChange">
        <el-table-column
          prop="dictName"
          label="字典名称"
          :show-overflow-tooltip="true">
          <template slot-scope="scope">
            <a @click="todicValue(scope.row)">{{scope.row.dictName}}</a>
          </template>
        </el-table-column>
        <el-table-column
          prop="dictType"
          label="字典类型"
          :show-overflow-tooltip="true">
        </el-table-column>
        <el-table-column
          prop="status"
          label="状态">
          <template slot-scope="scope">
            <el-tag :type="scope.row.status == '0' ? 'success' : 'info'" size="mini">{{scope.row.status|dictFilter('sys_dic_status')}}</el-tag>
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
                         v-hasPerm="'SYS_DIC_TYPE_UPDATE_B'" @click="updateHandle(scope.row)">编辑</el-button>
              <el-button size="mini" plain type="danger"
                         v-hasPerm="'SYS_DIC_TYPE_DELETE_B'" @click="deleteHandle(scope.row.dictId)">删除</el-button>
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
        <el-form-item label="字典名称：" prop="dictName">
          <el-input size="small" v-model="dialogFormData.dictName" placeholder="请输入字典名称" class="dialog-input-width" clearable></el-input>
        </el-form-item>
        <el-form-item label="字典类型：" prop="dictType">
          <el-input size="small" v-model="dialogFormData.dictType" placeholder="请输入字典类型" class="dialog-input-width" clearable :disabled="dialogTitle==='编辑字典类型'"></el-input>
        </el-form-item>
        <el-form-item v-if="dialogTitle==='编辑字典类型'" label="状态：" prop="status">
          <dict-select :dict-type="statusOptions"
                       v-model="dialogFormData.status"
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
  import pagination from 'mixins/pagination.js'
  import DictSelect from 'components/form-input/dict-select'
  import { GetDicTypes, AddDicType, UpdateDicType, DeleteDicType, RepeatDicType } from 'request/services/dict.js'
  import basePage from 'mixins/base-page.js'
  import debounce from 'utils/debounce.js'

  export default {
    name: 'sys_dict_type',
    mixins: [pagination, basePage],
    components: { DictSelect },
    props: {},
    data () {
      var checkDictName = (rule, value, callback) => {
        let checkStruct = RegExp(/^[\u4E00-\u9FA5A-Za-z0-9_]+$/).test(value)
        if (!checkStruct) {
          callback(new Error('字典名称只能包含中英文、数字和下划线'))
        } else {
          callback()
        }
      }
      var checkDictType = (rule, value, callback) => {
        let checkStruct = RegExp(/^[A-Za-z_-]+$/).test(value)
        if (!checkStruct) {
          callback(new Error('字典类型只能包含英文、短横线和下划线'))
        } else {
          if (this.dialogTitle === '编辑字典类型' && this.repeatDictType === value) {
            callback()
          } else {
            debounce(function () {
              RepeatDicType(value).then(res => {
                if (res.data.data) {
                  callback()
                } else {
                  callback(new Error('此字典类型已存在'))
                }
              })
            }, 500)()
          }
        }
      }
      return {
        statusOptions: 'sys_dic_status',
        searchShow: true,
        // 检索条件
        queryCondition: {
          dictName: '',
          status: ''
        },
        // 排序条件
        sortParam: {
          orderDesc: [],
          orderAsc: []
        },
        tableData: [],
        dialogVisible: false,
        dialogTitle: '',
        dialogFormData: {
          dictName: '',
          dictType: '',
          status: '',
          remark: ''
        },
        repeatDictType: '',
        rules: {
          dictName: [
            { required: true, message: '请输入字典名称', trigger: 'blur' },
            { max: 30, message: '字典名称不能超过30个字符', trigger: 'blur' },
            { validator: checkDictName, trigger: 'blur' }
          ],
          dictType: [
            { required: true, message: '请输入字典类型', trigger: 'blur' },
            { max: 30, message: '字典类型不能超过30个字符', trigger: 'blur' },
            { validator: checkDictType, trigger: 'blur' }
          ],
          status: [
            { required: true, message: '请选择状态', trigger: 'change' }
          ],
          remark: [
            { max: 150, min: 0, trigger: 'blur', message: '请输入0-150个文字的描述' }
          ]
        }
      }
    },
    methods: {
      getHeaderStyle: function ({ row, rowIndex }) {
        return {
          background: '#F0F2F5'
        }
      },
      todicValue (data) {
        this.$router.push({ name: 'sys_dict_value', params: { dictType: data.dictType } })
      },
      getTableData: function () {
        var condition = Object.assign({}, this.paginationParams, this.sortParam, this.queryCondition)
        GetDicTypes(condition).then(res => {
          this.tableData = res.data.list
          this.pagination.totalCount = res.data.totalCount
        })
      },
      getPageData () {
        this.getTableData()
      },
      // 查询
      conditionInput: function () {
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
        this.$confirm('请确认是否删除该字典类型？', '提示', {
          confirmButtonText: '确 定',
          cancelButtonText: '取 消',
          closeOnClickModal: false,
          type: 'warning'
        }).then(() => {
          DeleteDicType(id).then(res => {
            if (this.tableData.length < this.pagination.size) {
              this.pagination.totalCount--
              var index = this.tableData.findIndex(item => item.dictId === id)
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
      // 新增操作
      addHandle () {
        this.dialogFormData = {}
        this.dialogTitle = '新增字典类型'
        this.dialogVisible = true
      },
      // 编辑操作
      updateHandle (val) {
        this.dialogFormData = Object.assign({}, val)
        this.repeatDictType = this.dialogFormData.dictType
        this.dialogTitle = '编辑字典类型'
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
            if (val === '新增字典类型') {
              this.doAdd()
            } else {
              this.doEdit()
            }
          }
        })
      },
      doAdd () {
        AddDicType(this.dialogFormData).then(res => {
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
        UpdateDicType(this.dialogFormData).then(res => {
          var index = this.tableData.findIndex(item => item.dictId === this.dialogFormData.dictId)
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
