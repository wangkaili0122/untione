<!--
     /**
      * 岗位管理
      * @desc 组件描述
      * @example 调用示例
      *  <post></post>
      */
       -->
<template>
  <div class="content-wrapper">
    <table-filter-form
      :search-show='searchShow'
      :search-fields='searchFields'
      :form-inline='formInlineData'
      @filter-table='filterTable'>
    </table-filter-form>
    <!-- 操作按钮和控制按钮(控制列的显示和隐藏) -->
    <el-row :gutter="10" class="optBar">
      <el-button icon="el-icon-plus" type="primary" size="mini" v-hasPerm="'SYS_POST_ADD_B'" @click="addHandle">新增</el-button>
      <el-button icon="el-icon-delete" plain type="primary" size="mini" v-hasPerm="'SYS_POST_BATCHDEL_B'" :disabled="multipleSelection.length===0" @click="batchDeteteHandle">批量删除</el-button>
      <el-button-group style="float: right">
        <el-button icon="iconfont icon-chaxun" :title="searchShow ? '关闭查询': '打开查询'" size="mini" @click="searchShow = !searchShow"></el-button>
        <el-button icon="iconfont icon-shuaxin2" size="mini" title="刷新" @click="getTableData"></el-button>
        <!--<el-button icon="iconfont icon-ai-list" size="mini" title="选择列"></el-button>-->
      </el-button-group>
    </el-row>
    <!-- 数据列表 -->
    <el-table :empty-text="emptyText"
              ref="post-table"
              :header-cell-style="getHeaderStyle"
              :data="postDataList"
              @sort-change="sortChange"
              @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55">
      </el-table-column>
      <el-table-column
        label="岗位名称"
        :show-overflow-tooltip="true"
        prop="postName">
      </el-table-column>
      <el-table-column
        label="岗位编码"
        :show-overflow-tooltip="true"
        prop="postCode">
      </el-table-column>
      <!--<el-table-column-->
      <!--label="状态"-->
      <!--prop="status">-->
      <!--<template slot-scope="scope">-->
      <!--<el-tag :type="scope.row.status == '0'? 'success' : 'info'" size="mini">{{scope.row.status|dictFilter('sys_post_status')}}</el-tag>-->
      <!--</template>-->
      <!--</el-table-column>-->
      <el-table-column
        label="备注"
        :show-overflow-tooltip="true">
        <template slot-scope="scope">
          {{scope.row.remark || '--'}}
        </template>
      </el-table-column>
      <!--<el-table-column
        label="更新时间"
        sortable
        :show-overflow-tooltip="true"
         prop="updateTime">
        <template slot-scope="scope">
          {{scope.row.updateTime || '&#45;&#45;'}}
        </template>
      </el-table-column>-->
      <!-- 操作列 -->
      <el-table-column width="200px" align="left" label="操作">
        <template slot-scope="scope">
          <!--<el-button v-if="scope.row.status == '1'" @click="enableHandle(scope.row)" plain type="success" size="mini">启用</el-button>-->
          <!--<el-button v-if="scope.row.status == '0'" @click="disableHandle(scope.row)" plain type="info" size="mini">禁用</el-button>-->
          <el-button @click="updateHandle(scope.row)" plain type="primary" size="mini" v-hasPerm="'SYS_POST_UPDATE_B'">编辑</el-button>
          <el-button @click="deleteHandle(scope.row)" plain type="danger" size="mini" v-hasPerm="'SYS_POST_DELETE_B'">删除</el-button>
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
    <!-- 弹框 -->
    <el-dialog :visible.sync="addDialogVisible"
               :title="dialogTitle"
               width="40%"
               :before-close="dialogClose"
               :close-on-click-modal="false">
      <el-form ref="add-post-form-ref" :model="tempPost" label-width="120px" :rules="rules" label-position="right">
        <el-form-item label="岗位名称：" prop="postName">
          <el-input size="small" v-model="tempPost.postName" placeholder="请输入岗位名称" class="dialog-input-width" clearable></el-input>
        </el-form-item>
        <el-form-item label="岗位编码：" prop="postCode">
          <el-input size="small" v-model="tempPost.postCode" placeholder="请输入岗位编码" class="dialog-input-width" clearable :disabled="dialogTitle==='编辑岗位'"></el-input>
        </el-form-item>
        <el-form-item label="排序值：" prop="postSort">
          <el-input-number size="small" v-model.number="tempPost.postSort"
                           controls-position="right"
                           :min="0"  :max="10000" placeholder="请输入排序值">
          </el-input-number>
        </el-form-item>
        <!--<el-form-item v-if="dialogTitle==='编辑岗位'" label="状态：" prop="status">-->
        <!--<dict-select-->
        <!--dict-type="sys_post_status"-->
        <!--v-model="tempPost.status"-->
        <!--placeholder="请选择状态"-->
        <!--filterable clearable  size="small">-->
        <!--</dict-select>-->
        <!--</el-form-item>-->
        <el-form-item label="备注：" prop="remark">
          <el-input size="small" type="textarea" v-model="tempPost.remark" placeholder="请输入备注" class="dialog-input-width"></el-input>
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
  import basePage from 'mixins/base-page.js'
  import pagination from 'mixins/pagination.js'
  import { GetPosts, GetPost, AddPost, UpdatePost, DeletePost, DeletePosts, CheckPostName, PostUserCount, PostBatchDisable, PostBatchEnable } from 'request/services/post.js'
  import { checkSortNum} from 'utils/validate/validateRules.js'
  import TableFilterForm from '@/components/table-filter-form/table-filter-form';
  import DictSelect from "@/components/form-input/dict-select";
  import debounce from 'utils/debounce.js'
  export default {
    name: 'sys_post',
    components: {DictSelect, TableFilterForm},
    mixins: [basePage, pagination],
    mounted () {
      this.getTableData();
    },
    watch: {
      addDialogVisible: function (val) {
        if (!val)
          this.dialogClose();
      },
      'pagination.current': function (newVal, oldVal) {
        this.getTableData();
      },
      'pagination.size': function (newVal, oldVal) {
        this.getTableData();
      }
    },
    data: function () {
      var checkPostName = (rule, value, callback) => {
        let checkStruct = RegExp(/^[\u4E00-\u9FA5A-Za-z0-9_]+[\u4E00-\u9FA5A-Za-z0-9_]*$/).test(value)
        if (!checkStruct) {
          callback(new Error('岗位名称只能包含中英文、数字和下划线'))
        } else {
          if (this.dialogTitle === '编辑岗位' && this.repeatPostName === value) {
            callback()
          } else {
            debounce(function () {
              CheckPostName(value).then(res => {
                if (res.data.data) {
                  callback()
                } else {
                  callback(new Error('此岗位名称已存在'))
                }
              })
            }, 500)()
          }
        }
      }
      var checkPostCode = (rule, value, callback) => {
        let checkStruct = RegExp(/^[A-Za-z_-]+$/).test(value)
        if (!checkStruct) {
          callback(new Error('岗位编码只能包含英文、短横线和下划线'))
        } else {
          callback()
        }
      }
      return {
        searchShow: true,
        searchFields: [
          { type: 'input', label: '岗位名称', fieldName: 'postName', placeholder: '请输入岗位名称'},
          // { type: 'dictSelect', label: '状态', fieldName: 'status', placeholder: '请选择', dictType: 'sys_post_status'}
        ],
        // 检索条件
        formInlineData: {
          postName: '',
          status: ''
        },
        // 排序条件
        sortParam: {
          orderDesc: [],
          orderAsc: ['postSort']
        },
        multipleSelection: [],//当前选中的行数据
        emptyText: '加载中...',
        statusOptions: [
          { value: '0', name: '正常' },
          { value: '1', name: '停用' }
        ],
        postDataList: [],
        dialogTitle: '',
        addDialogVisible: false,
        tempPost: {
          postSort: 0
        },
        repeatPostName: '',
        rules: {
          postName: [
            {required: true, message: '请输入岗位名称', trigger: 'blur'},
            {max: 64, message: '最多输入64个字符', trigger: 'blur'},
            {validator: checkPostName, trigger: 'blur'}
          ],
          postCode: [
            {required: true, message: '请输入岗位编码', trigger: 'blur'},
            {max: 64, message: '最多输入64个字符', trigger: 'blur'},
            {validator: checkPostCode, trigger: 'blur'}
          ],
          postSort: [
            {required: true, message: '请输入排序值(0-10000的整数)', trigger: 'blur'},
            { type: 'number', message: '排序值必须为0-10000整数'},
            {validator: checkSortNum, trigger: 'blur'}
          ],
          remark:[
            {max: 150, message: '最多输入150个字符', trigger: 'blur'},
          ],
          // status: [
          //   { required: true, message: '请选择状态', trigger: 'change' }
          // ],
        }
      }
    },
    methods: {
      getTableData () {
        var data = Object.assign({}, this.paginationParams, this.sortParam, this.formInlineData);
        GetPosts(data).then(resp => {
          this.postDataList = resp.data.list;
          // 更新翻页数据 ，如：total
          this.setPagination({
            totalCount: resp.data.totalCount,
            current: resp.data.currPage,
            size: resp.data.pageSize
          });
          this.emptyText = '暂无数据'
        }).catch(error => {
          this.emptyText = '暂无数据'
          console.log(error)
        })
      },
      filterTable (val) {
        this.formInlineData = Object.assign({}, this.formInlineData,{postName: val.postName})
        this.resetCurrentPage();
        this.getTableData()
      },
      handleSelectionChange (val) {
        this.multipleSelection = val
      },
      // 当表格的排序条件发生变化的时候会触发该事件
      sortChange (val) {
        if (!val.prop) {
          return;
        }
        this.sortParam.orderDesc = [];
        this.sortParam.orderAsc = [];
        if (val.order === 'descending') {
          this.sortParam.orderDesc.push(val.prop)
        } else {
          this.sortParam.orderAsc.push(val.prop)
        }
        this.resetCurrentPage();
        this.getTableData();
      },
      // 新增操作
      addHandle () {
        this.tempPost = {
          postSort: 0
        };
        this.dialogTitle = '新增岗位'
        this.addDialogVisible = true;
      },
      // 编辑操作
      updateHandle (val) {
        this.repeatPostName = val.postName
        this.tempPost = Object.assign({}, val);
        this.dialogTitle = '编辑岗位'
        this.addDialogVisible = true;
      },
      // 删除操作
      async deleteHandle (row) {
        try {
          let response = await PostUserCount([row.postId])
          if (response.data && response.data.data>=0) {
            this.$confirm('该岗位下存在 '+'<strong style="color: red">'+response.data.data +'</strong> 位用户，确定删除该岗位吗?', '提示', {
              dangerouslyUseHTMLString: true,
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              closeOnClickModal: false,
              type: 'warning'
            }).then(() => {
              DeletePost(row.postId).then(resp => {
                this.$notify({
                  title: '成功',
                  message: '岗位删除成功',
                  type: 'success'
                });
                this.$refs['post-table'].clearSelection();
                this.getTableData();
              })
            })
          }
        } catch (e) {
          console.log(e)
        }
      },
      // 批量删除操作
      async batchDeteteHandle () {
        var params  = this.multipleSelection.map(item => {
          return item.postId
        })
        try {
          let response = await PostUserCount(params)
          if(response.data && response.data.data>=0) {
            this.$confirm('被选中岗位下存在 '+'<strong style="color: red">'+response.data.data +'</strong> 位用户，确定删除被选中岗位吗?', '提示', {
              dangerouslyUseHTMLString: true,
              confirmButtonText: '确定',
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              closeOnClickModal: false,
              type: 'warning'
            }).then(() => {
              DeletePosts(params).then(resp => {
                this.$notify({
                  title: '成功',
                  message: '岗位批量删除成功',
                  type: 'success'
                });
                this.$refs['post-table'].clearSelection();
                this.getTableData();
              })
            })
          }
        } catch (e) {
          console.log(e)
        }
      },
      enableHandle(row) {
        this.$confirm('确定启用该岗位?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          closeOnClickModal: false,
          type: 'warning'
        }).then(() => {
          PostBatchEnable(row.postId).then(res => {
            this.$refs['post-table'].clearSelection();
            this.getTableData();
          })
        })
      },
      async disableHandle(row) {
        try {
          let response = await PostUserCount(row.postId)
          if (response.data && response.data.data>=0) {
            this.$confirm('该岗位下存在 '+'<strong style="color: red">'+response.data.data +'</strong> 位用户，确定禁用该岗位吗?', '提示', {
              dangerouslyUseHTMLString: true,
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              closeOnClickModal: false,
              type: 'warning'
            }).then(() => {
              PostBatchDisable(row.postId).then(res => {
                this.$refs['post-table'].clearSelection();
                this.getTableData();
              })
            })
          }
        } catch (e) {
          console.log(e)
        }
      },
      confirmClick (val) {
        this.$refs['add-post-form-ref'].validate( valid => {
          if (valid){
            if (val === '新增岗位') {
              this.doAdd();
            } else {
              this.doEdit();
            }
          }
        })
      },
      doAdd () {
        AddPost(this.tempPost).then(res => {
          this.$notify({
            title: '成功',
            message: '岗位新增成功',
            type: 'success'
          });
          this.dialogClose();
          this.getTableData();
        })
      },
      doEdit () {
        UpdatePost(this.tempPost).then(res => {
          this.$notify({
            title: '成功',
            message: '岗位编辑成功',
            type: 'success'
          });
          this.dialogClose();
          this.getTableData();
        })
      },
      getHeaderStyle () {
        return {
          background: '#F0F2F5'
        }
      },
      dialogClose () {
        this.tempPost = {};
        this.addDialogVisible = false;
        this.$refs['add-post-form-ref'].resetFields();
      }
    }
  }
</script>

<style lang="stylus" scoped>
  /* div.content-wrapper{
      !*表格过滤条件区域过滤项的边距*!
     .filter-item-margin {
       margin-right 20px
       margin-bottom: 0px;
     }
     !*表格操作按钮区域的内边距*!
     .optBar {
       padding: 10px 5px;
     }
     !*弹框输入框长度*!
     .dialog-input-width {
       width: 90%
     }
   }*/
</style>

