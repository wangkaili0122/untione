<!--
    /**
     * 链接管理页面
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
                 v-hasPerm="'PLATFORM_LINK_ADD_B'" @click="addHandle">新增
      </el-button>
      <el-button icon="el-icon-delete" plain type="primary" size="mini" @click="batchDelete"
                 v-hasPerm="'PLATFORM_LINK_BATCHDEL_B'"
                 :disabled="selectionData.length === 0">批量删除
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
          prop="linkName"
          label="链接名称"
          min-width="150"
          :show-overflow-tooltip="true">
        </el-table-column>
        <el-table-column
          prop="linkUrl"
          label="URL"
          min-width="180"
          :show-overflow-tooltip="true">
          <template slot-scope="scope">
            <a @click="toURL(scope.row.linkUrl)">{{scope.row.linkUrl}}</a>
          </template>
        </el-table-column>
        <el-table-column
          prop="linkIcon"
          label="图标"
          min-width="50"
          :show-overflow-tooltip="true">
          <template slot-scope="scope">
            <img
              :src="scope.row.linkIcon ? (scope.row.linkIcon.indexOf('base64')>=0?scope.row.linkIcon:( $project.serverUrl +'/'+ scope.row.linkIcon)) : ''"
              alt="" class="linkIcon">
          </template>
        </el-table-column>
        <el-table-column
          prop="remark"
          label="备注"
          :show-overflow-tooltip="true">
        </el-table-column>
        <el-table-column
          label="操作"
          width="200"
          prop="id">
          <template slot-scope="scope">
            <div>
              <el-button size="mini" plain type="primary"
                         v-hasPerm="'PLATFORM_LINK_UPDATE_B'" @click="updateHandle(scope.row)">编辑
              </el-button>
              <el-button size="mini" plain type="danger"
                         v-hasPerm="'PLATFORM_LINK_DELETE_B'" @click="deleteHandle(scope.row.linkId)">删除
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
    <el-dialog :visible.sync="dialogVisible"
               :title="dialogTitle"
               width="40%"
               :before-close="dialogClose"
               :close-on-click-modal="false">
      <el-form ref="dialog-form" :model="dialogFormData" label-width="120px" :rules="rules" label-position="right">
        <el-form-item label="链接名称：" prop="linkName">
          <el-input size="small" v-model="dialogFormData.linkName" placeholder="请输入链接名称" class="dialog-input-width"
                    clearable></el-input>
        </el-form-item>
        <el-form-item label="URL：" prop="linkUrl">
          <el-input size="small" v-model="dialogFormData.linkUrl" placeholder="请输入URL" class="dialog-input-width"
                    clearable></el-input>
        </el-form-item>
        <el-form-item label="图标：" prop="linkIcon">
          <pic-select v-model="dialogFormData.linkIcon" @change="iconChange"></pic-select>
        </el-form-item>
        <el-form-item label="排序值：" prop="linkSort">
          <el-input-number size="small" v-model.number="dialogFormData.linkSort"
                           controls-position="right" style="width: 150px;"
                           :min="0" :max="10000" placeholder="请输入排序值">
          </el-input-number>
        </el-form-item>
        <el-form-item label="备注：" prop="remark">
          <el-input size="small"
                    type="textarea"
                    v-model="dialogFormData.remark"
                    placeholder="请输入0-100个文字的描述"
                    class="dialog-input-width"
                    :maxlength="100"
                    show-word-limit></el-input>
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
  import PicSelect from 'components/form-input/pic-select'
  import { GetLinkAll, AddLink, UpdateLink, DeleteLink, DeleteLinkBatch } from 'request/services/link.js'
  import basePage from 'mixins/base-page.js'

  export default {
    name: 'sys_link',
    mixins: [pagination, basePage],
    components: { TableFilterForm, PicSelect },
    props: {},
    data () {
      var checkUrl = (rule, value, callback) => {
        let checkStruct = RegExp(/^((https|http|ftp|rtsp|mms)?:\/\/)+[A-Za-z0-9]+\.[A-Za-z0-9]+[\/=\?%\-&_~`@[\]\':+!]*([^<>\"\"])*$/im).test(value)
        if (value === '') {
          callback(new Error('请输入URL'))
        } else if (!checkStruct) {
          callback(new Error('请输入正确的URL'))
        } else {
          callback()
        }
      }
      return {
        searchShow: true,
        // 检索条件
        queryCondition: {
          linkName: ''
        },
        searchFields: [
          { type: 'input', label: '链接名称', fieldName: 'linkName', placeholder: '请输入链接名称查询' }
        ],
        // 排序条件
        sortParam: {
          orderDesc: [],
          orderAsc: ['linkSort']
        },
        selectionData: [],
        selectionDataIds: [],
        tableData: [],
        dialogVisible: false,
        dialogTitle: '',
        dialogFormData: {
          linkSort: 0
        },
        rules: {
          linkName: [
            { required: true, message: '请输入链接名称', trigger: 'blur' },
            { max: 30, message: '链接名称不能超过30个字符', trigger: 'blur' }
          ],
          linkUrl: [
            { required: true, validator: checkUrl, trigger: 'blur' }
          ],
          linkIcon: [
            { required: true, message: '请上传图标', trigger: 'change' }
          ],
          linkSort: [
            { required: true, message: '请输入排序值(0-10000的整数)', trigger: 'blur' }
          ],
          remark: [
            { required: false,max:100,message:'请输入0-100个文字的描述',trigger:'blur' }
          ]
        }
      }
    },
    methods: {
      toURL (data) {
        window.open(data)
      },
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
        GetLinkAll(condition).then(res => {
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
        this.$confirm('请确认是否删除该链接？', '提示', {
          confirmButtonText: '确 定',
          cancelButtonText: '取 消',
          closeOnClickModal: false,
          type: 'warning'
        }).then(() => {
          DeleteLink(id).then(res => {
            if (this.tableData.length < this.pagination.size) {
              this.pagination.totalCount--
              var index = this.tableData.findIndex(item => item.linkId === id)
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
          return item.linkId
        })
      },
      // 批量删除
      batchDelete: function () {
        this.$confirm('请确认是否删除当前选中的链接？', '提示', {
          confirmButtonText: '确 定',
          cancelButtonText: '取 消',
          closeOnClickModal: false,
          type: 'warning'
        }).then(() => {
          DeleteLinkBatch(this.selectionDataIds).then(res => {
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
          linkSort: 0
        }
        this.dialogTitle = '新增链接'
        this.dialogVisible = true
      },
      // 编辑操作
      updateHandle (val) {
        this.dialogFormData = Object.assign({}, val)
        this.dialogTitle = '编辑链接'
        this.dialogVisible = true
      },
      dialogClose () {
        this.dialogFormData = {}
        this.dialogVisible = false
        this.$refs['dialog-form'].resetFields()
      },
      // 上传图片
      iconChange (val) {
        if (val) {
          this.$refs['dialog-form'].validateField('linkIcon')
        }
      },
      confirmClick (val) {
        this.$refs['dialog-form'].validate(valid => {
          if (valid) {
            if (val === '新增链接') {
              this.doAdd()
            } else {
              this.doEdit()
            }
          }
        })
      },
      doAdd () {
        AddLink(this.dialogFormData).then(res => {
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
        var data = JSON.parse(JSON.stringify(this.dialogFormData))
        if (data.linkIcon && data.linkIcon.indexOf('base64,') < 0 || data.linkIcon.indexOf('image/') < 0) {
          delete data.linkIcon
        }
        UpdateLink(data).then(res => {
          this.getTableData()
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
  .linkIcon {
    width: 28px;
    height: 28px;
    vertical-align: bottom;
  }
</style>
