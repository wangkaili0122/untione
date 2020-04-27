<!--
    /**
     * 字典数据管理页面
     * 调用示例：
     * <dict-value></dict-value>
     */
-->
<template>
  <div>
    <transition name="el-zoom-in-top">
      <el-form v-show="searchShow" v-model="queryCondition" :inline="true" size="mini">
        <el-form-item label="字典标签" class="filter-item-margin">
          <el-input clearable v-model="queryCondition.dictLabel"
                    placeholder="请输入字典标签查询" @input="conditionInput"></el-input>
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
      <el-button icon="el-icon-plus" type="primary" size="mini"
                 v-hasPerm="'SYS_DIC_DATA_ADD_B'" @click="addHandle">新增</el-button>
      <el-button icon="el-icon-delete" plain type="primary" size="mini" @click="batchDelete"
                 v-hasPerm="'SYS_DIC_DATA_BATCHDEL_B'"
                 :disabled="selectionData.length === 0">批量删除</el-button>
      <el-button icon="el-icon-back" size="mini" @click="goBack">返回</el-button>
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
          prop="dictLabel"
          label="字典标签"
          :show-overflow-tooltip="true">
        </el-table-column>
        <el-table-column
          prop="dictType"
          label="字典类型"
          :show-overflow-tooltip="true">
        </el-table-column>
        <el-table-column
          prop="dictValue"
          label="字典键值"
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
          prop="isDefault"
          label="是否默认">
          <template slot-scope="scope">
            <el-tag :type="scope.row.isDefault == 'Y' ? '' : 'info'" size="mini">{{scope.row.isDefault|dictFilter('sys_yes_no')}}</el-tag>
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
                         v-hasPerm="'SYS_DIC_DATA_UPDATE_B'" @click="updateHandle(scope.row)">编辑</el-button>
              <el-button size="mini" plain type="danger"
                         v-hasPerm="'SYS_DIC_DATA_DELETE_B'" @click="deleteHandle(scope.row.dictCode)">删除</el-button>
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
        <el-form-item label="字典标签：" prop="dictLabel">
          <el-input size="small" v-model="dialogFormData.dictLabel" placeholder="请输入字典标签" class="dialog-input-width" clearable></el-input>
        </el-form-item>
        <el-form-item label="字典类型：" prop="dictType">
          <el-input size="small" v-model="dialogFormData.dictType" placeholder="请选择字典类型" class="dialog-input-width" clearable disabled></el-input>
        </el-form-item>
        <el-form-item label="字典键值：" prop="dictValue">
          <el-input size="small" v-model="dialogFormData.dictValue" placeholder="请输入字典键值" class="dialog-input-width" clearable></el-input>
        </el-form-item>
        <el-form-item v-if="dialogTitle==='编辑字典数据'" label="状态：" prop="status">
          <dict-select :dict-type="statusOptions"
                       v-model="dialogFormData.status"
                       filterable clearable size="small">
          </dict-select>
        </el-form-item>
        <el-form-item v-if="dialogTitle==='编辑字典数据'" label="是否默认：" prop="isDefault">
          <dict-select :dict-type="defaultOptions"
                       v-model="dialogFormData.isDefault"
                       filterable clearable size="small">
          </dict-select>
        </el-form-item>
        <el-form-item label="排序值：" prop="dictSort">
          <el-input-number size="small" v-model.number="dialogFormData.dictSort"
                           controls-position="right" style="width: 150px;"
                           :min="0" :max="10000" placeholder="请输入排序值">
          </el-input-number>
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
  import { GetDicDatas, AddDicData, UpdateDicData, DeleteDicData, DeleteDicDataBatch, RepeatDicValue, DefaultDicType } from 'request/services/dict.js'
  import basePage from 'mixins/base-page.js'
  import debounce from 'utils/debounce.js'

  export default {
    name: 'sys_dict_value',
    mixins: [pagination, basePage],
    components: { DictSelect },
    props: {},
    data () {
      var checkDictLabel = (rule, value, callback) => {
        let checkStruct = RegExp(/^[\u4E00-\u9FA5A-Za-z0-9_]+$/).test(value)
        if (!checkStruct) {
          callback(new Error('字典标签只能包含中英文、数字和下划线'))
        } else {
          callback()
        }
      }
      var checkDictValue = (rule, value, callback) => {
        let checkStruct = RegExp(/^[\u4E00-\u9FA5A-Za-z0-9_]+$/).test(value)
        if (!checkStruct) {
          callback(new Error('字典键值只能包含中英文、数字和下划线'))
        } else {
          if (this.dialogTitle === '编辑字典数据' && this.repeatDictValue === value) {
            callback()
          } else {
            var data = {}
            data.dictType = this.$route.params.dictType
            data.dictValue = value
            debounce(function () {
              RepeatDicValue(data).then(res => {
                if (res.data.data) {
                  callback()
                } else {
                  callback(new Error('此字典键值已存在'))
                }
              })
            }, 500)()
          }
        }
      }
      var checkIsDefault = (rule, value, callback) => {
        if (value === 'Y') {
          if (this.dialogTitle === '编辑字典数据' && this.DefaultDictType === value) {
            callback()
          } else {
            var dictType = this.$route.params.dictType
            debounce(function () {
              DefaultDicType(dictType).then(res => {
                if (res.data.data) {
                  callback()
                } else {
                  callback(new Error('已存在默认值'))
                }
              })
            }, 500)()
          }
        } else {
          callback()
        }
      }
      return {
        statusOptions: 'sys_dic_status',
        defaultOptions: 'sys_yes_no',
        searchShow: true,
        // 检索条件
        queryCondition: {
          dictLabel: '',
          dictType: '',
          status: ''
        },
        // 排序条件
        sortParam: {
          orderDesc: [],
          orderAsc: ['dictSort']
        },
        selectionData: [],
        selectionDataIds: [],
        tableData: [],
        dialogVisible: false,
        dialogTitle: '',
        dialogFormData: {
          dictSort: 0
        },
        repeatDictValue: '',
        DefaultDictType: '',
        rules: {
          dictLabel: [
            { required: true, message: '请输入字典标签', trigger: 'blur' },
            { max: 30, message: '字典标签不能超过30个字符', trigger: 'blur' },
            { validator: checkDictLabel, trigger: 'blur' }
          ],
          dictType: [
            { required: true, message: '请输入字典类型', trigger: 'blur' }
          ],
          dictValue: [
            { required: true, message: '请输入字典键值', trigger: 'blur' },
            { max: 30, message: '字典键值不能超过30个字符', trigger: 'blur' },
            { validator: checkDictValue, trigger: 'blur' }
          ],
          isDefault: [
            { required: true, message: '请选择', trigger: 'change' },
            { validator: checkIsDefault, trigger: 'change' }
          ],
          dictSort: [
            { required: true, message: '请输入排序值(0-10000的整数)', trigger: 'blur' }
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
    mounted: function () {
      this.queryCondition.dictType = this.$route.params.dictType
      this.getTableData()
    },
    activated (){
      this.queryCondition.dictType = this.$route.params.dictType
      this.getTableData()
    },
    methods: {
      getHeaderStyle: function ({ row, rowIndex }) {
        return {
          background: '#F0F2F5'
        }
      },
      getTableData: function () {
        var condition = Object.assign({}, this.paginationParams, this.sortParam, this.queryCondition)
        GetDicDatas(condition).then(res => {
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
        this.$confirm('请确认是否删除该字典数据？', '提示', {
          confirmButtonText: '确 定',
          cancelButtonText: '取 消',
          closeOnClickModal: false,
          type: 'warning'
        }).then(() => {
          DeleteDicData(id).then(res => {
            if (this.tableData.length < this.pagination.size) {
              this.pagination.totalCount--
              var index = this.tableData.findIndex(item => item.dictCode === id)
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
          return item.dictCode
        })
      },
      // 批量删除
      batchDelete: function () {
        this.$confirm('请确认是否删除当前选中的字典数据？', '提示', {
          confirmButtonText: '确 定',
          cancelButtonText: '取 消',
          closeOnClickModal: false,
          type: 'warning'
        }).then(() => {
          DeleteDicDataBatch(this.selectionDataIds).then(res => {
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
        this.dialogFormData = {
          dictSort: 0
        }
        this.dialogFormData.dictType = this.$route.params.dictType
        this.dialogTitle = '新增字典数据'
        this.dialogVisible = true
      },
      // 编辑操作
      updateHandle (val) {
        this.dialogFormData = Object.assign({}, val)
        this.dialogFormData.dictType = this.$route.params.dictType
        this.repeatDictValue = this.dialogFormData.dictValue
        this.DefaultDictType = this.dialogFormData.isDefault
        this.dialogTitle = '编辑字典数据'
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
            if (val === '新增字典数据') {
              this.doAdd()
            } else {
              this.doEdit()
            }
          }
        })
      },
      doAdd () {
        AddDicData(this.dialogFormData).then(res => {
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
        UpdateDicData(this.dialogFormData).then(res => {
          // var index = this.tableData.findIndex(item => item.dictCode === this.dialogFormData.dictCode)
          // this.tableData.splice(index, 1, JSON.parse(JSON.stringify(this.dialogFormData)))
          this.getTableData()
          this.dialogClose()
          this.$notify({
            title: '成功',
            message: '编辑成功',
            type: 'success'
          })
        })
      },
      goBack () {
        this.$router.push({ name: 'sys_dict_type' })
      }
    }
  }
</script>

<style scoped>

</style>
