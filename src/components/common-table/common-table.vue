<!--
/**
* 通用列表，通过配置项可以实现简单列表的增删改查功能
* 对于复杂的列表和表单结构，可以复制本页代码然后直接在里面修改
* todo 考虑操作列的权限控制  可以添加btns属性，传递数组[{type:'update',perms:'sys_user_add,sys_hello'},{type:'custom',perms:'',name:'',position:'row/bar',event:'',callback:function(e,rowData){}}]
*/
-->
<template>
  <div class="commonTable">
    <transition name="el-zoom-in-top">
      <el-form v-show="searchShow" v-if="searchFields.length>0" :inline="true" :model="formInlineData" class="form-inline" size="mini">
        <el-row>
          <el-form-item v-for="item in searchFields"  :label="item.label" class="filter-item-margin">
            <el-input v-if="item.type === 'input'"
                      v-model="formInlineData[item.fieldName]"
                      :placeholder="item.placeholder"
                      clearable
                      :prefix-icon="item.prefixIcon"
                      :suffix-icon="item.suffixIcon"
                      @input="handleInputChange" ></el-input>
            <el-select v-if="item.type === 'select'" v-model="formInlineData[item.fieldName]"
                       :placeholder="item.placeholder"
                       filterable clearable  size="mini"
                       @change="handleSelectChange"
            >
              <el-option
                v-for="option in item.options"
                :key="option.value"
                :label="option.name"
                :value="option.value">
              </el-option>
            </el-select>
            <el-date-picker
              v-if="item.type === 'date'"
              v-model="formInlineData[item.fieldName]"
              type="datetimerange"
              align="right"
              unlink-panels clearable
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              :picker-options="item.options"
              size="mini"
              @change="handleDateChange"
            >
            </el-date-picker>
          </el-form-item>
        </el-row>
      </el-form>
    </transition>
    <!-- 操作按钮和控制按钮(控制列的显示和隐藏) -->
    <el-row :gutter="10" class="optBar">
      <el-button icon="el-icon-plus" type="primary" size="mini" @click="addHandle">新增</el-button>
      <el-button icon="el-icon-delete" plain type="primary" size="mini" :disabled="multipleSelection.length===0" @click="batchDeteteHandle">批量删除</el-button>
      <el-button-group style="float: right">
        <el-button icon="iconfont icon-chaxun" size="mini" title="查询" @click="searchShow = !searchShow"></el-button>
        <el-button icon="iconfont icon-shuaxin2" size="mini" title="刷新" @click="getTableData"></el-button>
        <el-button icon="iconfont icon-ai-list" size="mini" title="选择列"></el-button>
      </el-button-group>
    </el-row>
    <!-- 数据列表 -->
    <el-table :empty-text="emptyText"
              ref="commonTable"
              :header-cell-style="getHeaderStyle"
              :data="dataList"
              v-bind="$attrs"
              @sort-change="sortChange"
              @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" v-if="checkable">
      </el-table-column>
      <template v-for="(column,index) in tableColumns">
        <el-table-column :key="index" :prop="column.prop" :label="column.label"
                         :width="column.width" :sortable="column.sortable"
                         :show-overflow-tooltip="column.overflow ? column.overflow : true"
                         :formatter="column.formatter ? clumnsRender[column.formatter] : null"
        >
        </el-table-column>
      </template>
      <slot name="cloumn"></slot>
      <!-- 操作列 -->
      <el-table-column label="操作" :width="operateWidth">
        <template slot-scope="scope">
          <el-button @click="viewHandle(scope.row)" plain type="success" size="mini">详情</el-button>
          <el-button @click="updateHandle(scope.row)" plain type="primary" size="mini">编辑</el-button>
          <el-button @click="deleteHandle(scope.row)" plain type="danger" size="mini">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--翻页组件-->
    <!--todo 传递翻页的参数-->
    <el-pagination v-if="paginationVisible"
                   style="margin-top: 15px;"
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

    <!-- 表单对话框 -->
    <el-dialog :visible.sync="formVisible" :title="dialogTitle" :close-on-click-modal="false" :before-close="cancelFormHandle">
      <!-- 如果表单结构比较复杂，需要自己写表单布局和内部代码，可以把下面的slot替换为自己的表单结构 -->
      <slot name="form"></slot>
      <span slot="footer" class="dialog-footer" v-if="dialogTitle!=='详情'">
        <el-button size="small" @click="cancelFormHandle">取 消</el-button>
        <el-button type="primary" size="small" @click="submitFormHandle">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
  // todo 添加自定义按钮和检索的功能
  import CommonTableMixins from 'mixins/common-table.js'
  import clumnsRender from './clumns-render'

  export default {
    name: 'common-table',
    components: {},
    mixins: [CommonTableMixins],
    props: {
      columns: {
        type: Array,
        default () {
          return []
        }
      },
      data: {
        type: Array,
        default () {
          return []
        }
      },
      model: {}, // 允许传递自定义的数据model，避免数据多级嵌套的时候vue报错，
      checkable: {
        type: Boolean,
        default () {
          return true
        }
      },
      operateWidth: {
        type: Number,
        default () {
          return 240
        }
      },
      paginationVisible: {
        type: Boolean,
        default () {
          return true
        }
      },
      paginationParam: {
        type: Object,
        default () {
          return {}
        }
      },
      btns: [{
        name: ''
      }]
    },
    data () {
      return {
        searchShow: true,
        formVisible: false,
        formOpt: 'update', // 允许值 update/add
        dialogTitle: '编辑',
        tableColumns: this.columns,
        dataList: this.data,
        pagination: this.paginationParam,
        dataModel: this.model || {}, // 允许传递自定义的数据model，避免数据多级嵌套的时候vue报错，
        // 比如：model={department:{deptId:'',deptName}},如果只让model={}表单中调用deptId会报错
        multipleSelection: [], // 当前选中的行数据
        emptyText: '加载中...',
        sortParam: {
          orderDesc: '',
          orderAsc: ''
        },
        clumnsRender
      }
    },
    provide () {
      return { formOpt: this.tableFormOpt }
    },
    beforeCreate () {
    },
    created () {
      //  请求数据
      this.getTableData()
    },
    mounted () {
      // todo 刚进来页面应该显示加载中，获取数据请求成功后如果仍没有数据就显示暂无数据
      this.emptyText = '暂无数据'
    },
    methods: {
      getTableData () {
        if (this.services && Object.keys(this.services).length > 0) {
          if (this.services.hasOwnProperty('get')) {
            // 如果有分页，初始请求接口
            this.get()
          } else if (this.services.hasOwnProperty('getAll')) {
            // 获取所有数据，不需要分页就直接请求该接口
            this.getAll()
          }
        } else if (this.urls && Object.keys(this.urls).length > 0) {
          if (this.urls.hasOwnProperty('getUrl')) {
            // 如果有分页，初始请求接口
            this.get()
          } else if (this.urls.hasOwnProperty('getAllUrl')) {
            // 获取所有数据，不需要分页就直接请求该接口
            this.getAll()
          }
        }
      },
      getHeaderStyle: function ({ row, rowIndex }) {
        return {
          background: '#F0F2F5'
        }
      },
      addHandle () {
        this.formOpt = 'add'
        this.dialogTitle = '新增'
        this.currentEdit = {}
        this.formVisible = true
        // 在nextTick里面调用是为了防止setFormData调用时form尚未渲染完毕导致formInstance为null
        this.$nextTick(() => {
          this.formInstance.setFormData(this.currentEdit)
        })
        this.$emit('add', this.formOpt)
      },
      viewHandle (row) {
        this.formOpt = 'view'
        this.dialogTitle = '详情'
        this.currentEdit = JSON.parse(JSON.stringify(row))
        // 判断是否需要调查询接口，如果不需调接口直接从表格中取本行数据
        if (this.services.hasOwnProperty('view')) {
          this.view()
        } else {
          this.setViewData()
        }
      },
      setViewData () {
        this.formVisible = true
        this.formOpt = 'view'
        this.$nextTick(() => {
          this.formInstance.setFormData(this.currentEdit)
        })
        this.$emit('view', this.formOpt, this.currentEdit)
      },
      updateHandle (row) {
        this.dialogTitle = '编辑'
        this.currentEdit = JSON.parse(JSON.stringify(row))
        this.formVisible = true
        this.formOpt = 'update'
        // 在nextTick里面调用是为了防止setFormData调用时form尚未渲染完毕导致formInstance为null
        this.$nextTick(() => {
          this.formInstance ? this.formInstance.setFormData(this.currentEdit) : console.warn('没有commonForm实例，请检查代码！')
        })
        this.$emit('update', this.formOpt, this.currentEdit)
      },
      deleteHandle (row) {
        this.currentEdit = JSON.parse(JSON.stringify(row))
        this.$confirm('是否删除本条数据?', '提示', {
          confirmButtonText: '确 定',
          cancelButtonText: '取 消',
          closeOnClickModal: false,
          type: 'warning'
        }).then(() => {
          this.delete()
        })
      },
      batchDeteteHandle () {
        this.$confirm('是否批量删除被选中的数据?', '提示', {
          confirmButtonText: '确 定',
          cancelButtonText: '取 消',
          closeOnClickModal: false,
          type: 'warning'
        }).then(() => {
          this.deleteBatch()
        })
      },
      cancelFormHandle () {
        // 清空数据和表单验证结果
        if (this.formInstance) {
          this.formInstance.resetFields()
        }
        this.formVisible = false
      },
      submitFormHandle () {
        if (!this.formInstance) {
          console.warn('没有commonForm实例，请检查代码！')
          return
        }
        this.formInstance.validate((valid) => {
          if (valid) {
            this.currentEdit = this.formInstance.getFormData()
            this.formOpt === 'add' ? this.add() : (this.formOpt === 'view' ? this.cancelFormHandle() : this.update())
          } else {
            console.log('invalid')
          }
        })
      },
      handleSelectionChange (val) {
        this.multipleSelection = val
      },
      // 排序
      sortChange (val) {
        if (!val.prop) {
          return
        }
        this.sortParam.orderDesc = ''
        this.sortParam.orderAsc = ''
        if (val.order === 'descending') {
          this.sortParam.orderDesc = val.prop
        } else {
          this.sortParam.orderAsc = val.prop
        }
        this.resetCurrentPage()
        this.get()
      }
    },
    computed: {
      /**
       * 获取slot传递进来的form表单组件
       */
      formInstance () {
        try {
          if (this.$slots.form[0].componentInstance) {
            return this.$slots.form[0].componentInstance
          }
        } catch (e) {
          console.error('请检查是否传入commonForm实例', e)
          return null
        }
      },
      tableFormOpt(){
        return this.formOpt
      }
    },
    watch: {
      // 'pagination.current': function (newValue, oldValue) {
      //   this.get()
      // },
      // 'pagination.size': function (newValue, oldValue) {
      //   this.get()
      // }
    }
  }

</script>
<style lang="stylus" scoped>
  /*div.commonTable {
    .form-inline {
      margin-bottom: -15px;
    }
    .optBar {
      padding: 0 5px 10px;
    }
  }*/

</style>
