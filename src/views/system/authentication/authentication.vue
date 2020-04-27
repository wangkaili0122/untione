<!--
     /**
      * 接口认证管理
      * @desc 组件描述
      * @example 调用示例
      *  <post></post>
      */
       -->
<template>
  <div class="content-wrapper">
    <!--<table-filter-form-->
    <!--:search-show='searchShow'-->
    <!--:search-fields='searchFields'-->
    <!--:form-inline='formInlineData'-->
    <!--@filter-table='filterTable'>-->
    <!--</table-filter-form>-->
    <!-- 操作按钮和控制按钮(控制列的显示和隐藏) -->
    <el-row :gutter="10" class="optBar">
      <el-button icon="el-icon-plus" type="primary" size="mini" v-hasPerm="'ASYNC_KEY_CREATE_B'" @click="addHandle">新增</el-button>
      <el-button icon="el-icon-delete" plain type="primary" size="mini" v-hasPerm="'ASYNC_KEY_BATCHDEL_B'" :disabled="multipleSelection.length===0" @click="batchDeteteHandle">批量删除</el-button>
      <el-button-group style="float: right">
        <!--<el-button icon="iconfont icon-chaxun" :title="searchShow ? '关闭查询': '打开查询'" size="mini" @click="searchShow = !searchShow"></el-button>-->
        <el-button icon="iconfont icon-shuaxin2" size="mini" title="刷新" @click="getTableData"></el-button>
        <!--<el-button icon="iconfont icon-ai-list" size="mini" title="选择列"></el-button>-->
      </el-button-group>
    </el-row>
    <!-- 数据列表 -->
    <el-table :empty-text="emptyText"
              ref="authentication-table"
              :header-cell-style="getHeaderStyle"
              :data="authenticationList"
              @sort-change="sortChange"
              @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55">
      </el-table-column>
      <el-table-column
        label="应用名称"
        :show-overflow-tooltip="true"
        prop="appName">
      </el-table-column>
      <el-table-column
        label="应用证书"
        min-width="400px"
        prop="token">
      </el-table-column>
      <el-table-column
        label="超期时间"
        min-width="150px"
        :show-overflow-tooltip="true"
        prop="expireTime">
        <template slot-scope="scope">
          {{scope.row.expireTime || '--'}}
        </template>
      </el-table-column>
      <!--<el-table-column
        label="创建人"
        :show-overflow-tooltip="true"
        prop="createBy">
      </el-table-column>-->
      <el-table-column
        label="状态"
        prop="status">
        <template slot-scope="scope">
          <el-tag :type="scope.row.status == '0'? 'success' : 'info'" size="mini">{{scope.row.status|dictFilter('authentication_status')}}</el-tag>
        </template>
      </el-table-column>
      <!--<el-table-column-->
      <!--label="创建时间"-->
      <!--:show-overflow-tooltip="true"-->
      <!--prop="createTime">-->
      <!--</el-table-column>-->
      <el-table-column
        label="备注"
        :show-overflow-tooltip="true">
        <template slot-scope="scope">
          {{scope.row.remark || '--'}}
        </template>
      </el-table-column>
      <!-- 操作列 -->
      <el-table-column width="150px" align="left" label="操作">
        <template slot-scope="scope">
          <!--<el-button @click="viewHandle(scope.row)" plain type="success" size="mini">详情</el-button>-->
          <el-button @click="updateHandle(scope.row)" plain type="primary" size="mini" v-hasPerm="'ASYNC_KEY_UPDATE_B'">编辑</el-button>
          <el-button @click="deleteHandle(scope.row)" plain type="danger" size="mini" v-hasPerm="'ASYNC_KEY_DELETE_B'">删除</el-button>
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
      <el-form ref="authentication-form-ref" :model="tempPost" label-width="120px" :rules="rules" label-position="right">
        <el-form-item label="应用：" prop="appId" v-if="dialogTitle==='新增证书'">
          <el-select v-model="tempPost.appId"
                     placeholder="请选择应用"
                     filterable clearable
                     size="small"
                     :disabled="this.dialogTitle==='编辑证书'"
                     class="dialog-input-width">
            <el-option
              v-for="option in appOptions"
              :key="option.appId"
              :label="option.appName"
              :value="option.appId">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="应用：" prop="appName" v-if="dialogTitle==='编辑证书'">
          <el-input disabled size="small" v-model="tempPost.appName" class="dialog-input-width"></el-input>
        </el-form-item>
        <el-form-item label="超期时间：" prop="expireTime">
          <el-date-picker
            size="small"
            v-model="tempPost.expireTime"
            :picker-options="pickerOptions"
            type="datetime"
            placeholder="选择日期时间"
            clearable>
          </el-date-picker>
        </el-form-item>
        <el-form-item label="备注：">
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
  import { GetAuthenticationAsync, CreateToken, UpdateToken, DeleteAuthAsync, BatchDeleteAuthAsync, GetSyncApplications } from 'request/services/authentication.js'
  // import { GetApps } from 'request/services/app.js'
  import dataFormatFnList from 'utils/dateFormat.js'
  export default {
    name: 'sys_authentication',
    components: {},
    mixins: [basePage, pagination],
    mounted () {
      this.getTableData();
      this.getApps()
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
      return {
        searchShow: true,
        // searchFields: [
        //   { type: 'input', label: '应用证书', fieldName: 'postName', placeholder: '请输入应用证书'},
        //   { type: 'dictSelect', label: '状态', fieldName: 'status', placeholder: '请选择', dictType: 'sys_post_status'}
        // ],
        // 检索条件
        // formInlineData: {
        //   postName: '',
        //   status: ''
        // },
        // 排序条件
        sortParam: {
          orderDesc: [],
          orderAsc: []
        },
        multipleSelection: [],//当前选中的行数据
        emptyText: '加载中...',
        appOptions: [],
        authenticationList: [],
        dialogTitle: '',
        addDialogVisible: false,
        tempPost: {
          expireTime: this.setExpireTimeTime()
        },
        rules: {
          appId: [
            {required: true, message: '请输入应用证书', trigger: 'change'},
          ],
          remark: [
            { max: 150, min: 0, trigger: 'blur', message: '请输入0-150个文字的描述' }
          ]
        },
        pickerOptions: {
          disabledDate(time) {
            // return time.getTime() < Date.now() - 8.64e7;//8.64e7=1000*60*60*24一天
            return time.getTime() < new Date(new Date().toLocaleDateString()).getTime();
          }
        }
      }
    },
    methods: {
      getTableData () {
        var data = Object.assign({}, this.paginationParams, this.sortParam);
        GetAuthenticationAsync(data).then(resp => {
          this.authenticationList = resp.data.data.list;
          if(this.authenticationList && this.authenticationList.length==0) {
            this.emptyText = '暂无数据'
          }
          // 更新翻页数据 ，如：total
          this.setPagination({
            totalCount: resp.data.data.totalCount,
            current: resp.data.data.currPage,
            size: resp.data.data.pageSize
          });
        }).catch(error => {
          this.emptyText = '暂无数据'
          console.log(error)
        })
      },
      getApps () {
        GetSyncApplications().then(resp => {
          this.appOptions = resp.data.data
        })
      },
      setExpireTimeTime() {
        var now = new Date()
        var time = new Date(now.getTime() + 1000*60*60*24)
        return time
      },
      // filterTable (val) {
      //   this.formInlineData = Object.assign({}, this.formInlineData,{postName: val.postName, status: val.status})
      //   this.resetCurrentPage();
      //   this.getTableData()
      // },
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
        this.dialogTitle = '新增证书'
        this.addDialogVisible = true;
      },
      // 编辑操作
      updateHandle (val) {
        this.tempPost = Object.assign({}, val);
        // this.$set(this.tempPost,'expireTime', new Date(this.tempPost.expireTime))
        this.dialogTitle = '编辑证书'
        this.addDialogVisible = true;
      },
      // 删除操作
      deleteHandle (row) {
        this.$confirm('确定删除该证书?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          closeOnClickModal: false,
          type: 'warning'
        }).then(() => {
          DeleteAuthAsync(row.keyId).then(resp => {
            this.$notify({
              title: '成功',
              message: '接口证书删除成功！',
              type: 'success'
            })
            this.$refs['authentication-table'].clearSelection();
            this.resetCurrentPage();
            this.getTableData();
            this.getApps()
          })
        })
      },
      // 批量删除操作
      batchDeteteHandle () {
        this.$confirm('确定删除被选中证书?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          closeOnClickModal: false,
          type: 'warning'
        }).then(() => {
          var params  = this.multipleSelection.map(item => {
            return item.keyId
          })
          BatchDeleteAuthAsync(params).then(resp => {
            this.$notify({
              title: '成功',
              message: '接口证书批量删除成功！',
              type: 'success'
            })
            this.$refs['authentication-table'].clearSelection();
            this.resetCurrentPage();
            this.getTableData();
            this.getApps()
          })
        })
      },
      confirmClick (val) {
        this.$refs['authentication-form-ref'].validate( valid => {
          if (valid){
            if (val === '新增证书') {
              this.doAdd();
            } else {
              this.doEdit();
            }
          }
        })
      },
      doAdd () {
        CreateToken(this.tempPost).then(res => {
          this.$notify({
            title: '成功',
            message: '接口证书新增成功！',
            type: 'success'
          })
          this.dialogClose();
          this.resetCurrentPage();
          this.getTableData();
          this.getApps()
        })
      },
      doEdit () {
        this.tempPost.expireTime = dataFormatFnList.timeFormat(this.tempPost.expireTime);
        UpdateToken(this.tempPost).then(res => {
          this.$notify({
            title: '成功',
            message: '接口证书编辑成功！',
            type: 'success'
          })
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
        this.tempPost = {
          expireTime: this.setExpireTimeTime()
        };
        this.addDialogVisible = false;
        this.$refs['authentication-form-ref'].resetFields();
      }
    },
    // computed: {
    //   appOptionsList () {
    //     let authentedApps = this.allAuthenticationList.map(item => {return item.appName})
    //     let newList = this.appOptions.filter(item => authentedApps.indexOf(item.appName) < 0)
    //     return newList
    //   }
    // }
  }
</script>

<style lang="stylus" scoped>
</style>

