<!--
     /**
      * 部门页面
      * @desc 组件描述
      * @example 调用示例
      *  <department></department>
      */
       -->
<template>
  <div class="content-wrapper">
    <table-filter-form
      :search-show='searchShow'
      :search-fields='searchFields'
      :form-inline='formInline'
      @filter-table='filterTable'>
    </table-filter-form>
    <!-- 操作按钮和控制按钮(控制列的显示和隐藏) -->
    <el-row :gutter="10" class="optBar">
      <el-button icon="el-icon-plus" type="primary" size="mini" @click="addHandle" v-hasPerm="'SYS_DEPT_ADD_B'">新增
      </el-button>
      <el-button-group style="float: right">
        <el-button :icon="expandAll ? 'iconfont icon-shouqi1': 'iconfont icon-zhankai1'" size="mini"
                   :title="expandAll ? '收缩列表' :  '展开列表'" @click="expandAll = !expandAll"></el-button>
        <el-button icon="iconfont icon-chaxun" :title="searchShow ? '关闭查询': '打开查询'" size="mini"
                   @click="searchShow = !searchShow"></el-button>
        <el-button icon="iconfont icon-shuaxin2" size="mini" title="刷新" @click="getTableData"></el-button>
        <!--<el-button icon="iconfont icon-ai-list" size="mini" title="选择列"></el-button>-->
      </el-button-group>
    </el-row>
    <!-- 数据列表 -->
    <tree-table align="center"
                size="small"
                ref="DeptTable"
                style="font-size:14px;"
                :expand-on-row-click="true"
                :indent="indent"
                :data="deptList"
                :default-expand-all="expandAll"
                :columns="columns"
                :default-children="childrenKey"
                @selection-change="handleSelectionChange">
      <!--      <template slot="selection">-->
      <!--        <el-table-column type="selection" align="center" width="55"/>-->
      <!--      </template>-->
      <template slot="status" slot-scope="{scope}">
        <el-tag :type="scope.row.status == '0'? 'success' : 'info'" size="mini">
          {{scope.row.status|dictFilter('sys_dept_status')}}
        </el-tag>
      </template>
      <template slot="operation" slot-scope="{scope}">
        <!--<el-button v-if="scope.row.status == '1'" @click="enableHandle(scope.row)" plain type="success" size="mini">启用</el-button>-->
        <!--<el-button v-if="scope.row.status == '0'" @click="disableHandle(scope.row)" plain type="info" size="mini">禁用</el-button>-->
        <el-button @click="viewHandle(scope.row)" plain type="success" size="mini">详情</el-button>
        <el-button @click="updateHandle(scope.row)" plain type="primary" size="mini" v-hasPerm="'SYS_DEPT_UPDATE_B'">
          编辑
        </el-button>
        <el-button @click="deleteHandle(scope.row)" plain type="danger" size="mini" v-hasPerm="'SYS_DEPT_DELETE_B'">删除
        </el-button>
      </template>
    </tree-table>
    <!-- 弹框 -->
    <el-dialog :visible.sync="formVisible"
               :title="dialogTitle"
               width="40%"
               :before-close="dialogClose"
               :close-on-click-modal="false">
      <el-form ref="add-dept-form-ref" :model="tempDept" label-width="120px" :rules="rules" size="small"
               label-position="right" :disabled="dialogTitle==='查看详情'">
        <el-form-item label="父级部门：" prop="parentId" v-if="dialogTitle === '新增部门'">
          <tree-select :data="treeData"
                       :defaultProps="defaultProps"
                       v-model="tempDept.parentId"
                       placeholder="请选择父级部门"
                       :size="'small'"
                       clearable
                       :nodeKey="nodeKey">
          </tree-select>
        </el-form-item>
        <el-form-item label="部门名称：" prop="deptName">
          <el-input v-model="tempDept.deptName" placeholder="请输入部门名称" size="small" class="dialog-input-width"
                    clearable></el-input>
        </el-form-item>
        <el-form-item label="部门编码：" prop="deptCode">
          <el-input v-model="tempDept.deptCode" placeholder="请输入部门编码" size="small" class="dialog-input-width"
                    clearable></el-input>
        </el-form-item>
        <el-form-item label="部门类型：" prop="deptType">
          <dict-select dict-type="sys_dept_type"
                       v-model="tempDept.deptType"
                       placeholder="部门类型" class="dialog-input-width"
                       filterable clearable size="small">
          </dict-select>
          <!--<el-input v-model="tempDept.deptType"  size="small" class="dialog-input-width"
                    clearable></el-input>-->
        </el-form-item>
        <!--<el-form-item label="部门岗位：" prop="postIds">
          <el-select v-model="tempDept.postIds"
                     placeholder="请选择部门岗位"
                     size="small"
                     class="dialog-input-width"
                     multiple
                     filterable clearable
          >
            <el-option
              v-for="option in postIdsOptions"
              :key="option.value"
              :label="option.name"
              :value="option.value">
            </el-option>
          </el-select>
        </el-form-item>-->
        <el-form-item label="负责人：" prop="leader">
          <el-input v-model="tempDept.leader" size="small" class="dialog-input-width" clearable></el-input>
        </el-form-item>
        <el-form-item label="联系电话：" prop="phone">
          <el-input v-model="tempDept.phone" size="small" class="dialog-input-width" clearable></el-input>
        </el-form-item>
        <el-form-item label="邮箱：" prop="email">
          <el-input v-model="tempDept.email" size="small" class="dialog-input-width" clearable></el-input>
        </el-form-item>
        <el-form-item label="排序值：" prop="orderNum">
          <el-input-number size="small" v-model.number="tempDept.orderNum"
                           controls-position="right"  style="width: 150px;"
                           :min="0" :max="10000" placeholder="请输入排序值">
          </el-input-number>
        </el-form-item>
        <el-form-item label="备注：" prop="remark">
          <el-input size="small" type="textarea" v-model="tempDept.remark" :maxlength="150" placeholder="请输入备注"
                    class="dialog-input-width"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="form-button">
        <el-button size="small" @click="dialogClose">取 消</el-button>
        <el-button type="primary" size="small" @click="saveTempData(dialogTitle)">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 删除弹框，显示部门下用户信息-->
    <el-dialog title="该部门下的用户信息" width="60%" top="5vh"
               :visible.sync="deleteDialogVisible"
               :close-on-click-modal="false"
               :before-close="closeDeleteDialog">
      <dept-users :deptUsers = deptUsers>
      </dept-users>
      <div slot="footer" class="dialog-footer">
        <el-button @click="closeDeleteDialog" size="small">取 消</el-button>
        <el-button type="primary" @click="exportUsers" size="small">批量导出</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import basePage from 'mixins/base-page.js'
  import TableFilterForm from 'components/table-filter-form/table-filter-form.vue'
  import TreeTable from 'components/tree-table'
  import TreeSelect from 'components/tree-select.vue'
  import DictSelect from 'components/form-input/dict-select'
  import debounce from 'utils/debounce.js'
  import {
    GetDeptTree,
    AddDept,
    UpdateDept,
    DeleteDept,
    StopDeptBatch,
    StartDeptBatch,
    CheckDeptName,
    GetDeptUserCount,
    ExportDeptUsers,
    CheckDeptCode
  } from 'request/services/dept.js'
  import { checkSortNum, checkPhoneU, checkEmailU, checkCNameU } from 'utils/validate/validateRules.js'
  import DeptUsers from "./dept-users";
  import { exportFile } from 'request/services/download.js'

  export default {
    name: 'sys_dept',
    mixins: [basePage],
    components: {DeptUsers, TableFilterForm, TreeTable, TreeSelect, DictSelect },
    props: {},
    data () {
      var checkDeptName = (rule, value, callback) => {
        //let checkStruct = RegExp(/^[\u4E00-\u9FA5A-Za-z0-9_]+$/).test(value)
        let checkStruct = RegExp(/^[\u4E00-\u9FA5A-Za-z0-9_\(\)\（\）-]+[\u4E00-\u9FA5A-Za-z0-9_-]*$/).test(value)
        //let checkStruct = RegExp(/^[\u4E00-\u9FA5A-Za-z0-9_-]+[\s\u4E00-\u9FA5A-Za-z0-9_-]*$/).test(value)
        if (!checkStruct) {
          callback(new Error('部门名称只能包含中英文、数字、横线、小括号和下划线'))
        } else {
          if (this.optType === 'update' && this.repeatDeptName === value) {
            callback()
          } else if (this.tempDept.parentId != null && this.tempDept.parentId != undefined) {
            //如果部门名称变化，且父级部门已选择，就校验部门名称是否重名
            var data = {}
            data.parentId = this.tempDept.parentId
            data.deptName = value
            debounce(function () {
              CheckDeptName(data).then(res => {
                if (res.data.data) {
                  callback()
                } else {
                  callback(new Error('同一父级部门下此部门名称已存在'))
                }
              })
            }, 500)()
          } else {
            callback()
          }
        }
      }
      //校验部门编码
      var checkDeptCode = (rule, value, callback) => {

        let checkStruct = RegExp(/^[0-9]*$/).test(value)
        if (!checkStruct) {
          callback(new Error('部门编码只能是数字'))
        } else {
          if (this.optType === 'update' && this.deptCode === value) {
            callback()
          } else if (this.optType !== 'view') {
            //校验部门编号是重复
            var data = {}
            data.deptCode = value
            debounce(function () {
              CheckDeptCode(data).then(res => {
                if (res.data.data) {
                  callback()
                } else {
                  callback(new Error('部门编码已存在，请输入新的部门编码'))
                }
              })
            }, 500)()
          } else {
            callback()
          }
        }
      }

      return {
        searchShow: true,
        searchFields: [
          { type: 'input', label: '部门名称', fieldName: 'deptName', placeholder: '请输入部门名称' },
        ],
        formInline: {
          deptName: ''
        },
        deptList: [],
        childrenKey: 'childrenList',
        expandAll: true,
        indent: 20,
        columns: [

          {
            label: '部门名称',
            key: 'deptName',
            showOverflow: true,
            expand: true
          },
          {
            label: '部门编码',
            key: 'deptCode',
            showOverflow: true
          },

          // {
          //   text: '岗位',
          //   value: 'postIds',
          //   showOverflow: true
          // },
          {
            label: '负责人',
            key: 'leader',
            showOverflow: true
          },
          {
            label: '联系电话',
            key: 'phone',
            showOverflow: true
          },
          {
            label: '备注',
            key: 'remark',
            showOverflow: true
          },
          {
            label: '操作',
            key: 'operation',
            width: 250
          }
        ],
        multipleSelection: [],
        batchStart: false,
        batchStop: false,
        treeData: [],
        defaultProps: {
          children: 'childrenList',
          label: 'deptName'
        },
        nodeKey: 'deptId',
        tempDept: {
          orderNum: 0
        }, // 当前选中的部门数据
        postIdsOptions: [],
        dialogTitle: '',
        optType: 'add',
        formVisible: false,
        repeatDeptName: '',
        deptCode:'',
        deleteDialogVisible: false,
        deptUsers: [],
        deptId:'',
        rules: {
          parentId: [
            { required: true, message: '请选择父级部门', trigger: 'change' },
          ],
          deptName: [
            { required: true, message: '请输入部门名称', trigger: 'blur' },
            { max: 50, message: '最多输入50个字符', trigger: 'blur' },
            { validator: checkDeptName, trigger: 'blur' }
          ],
          remark: [
            { max: 150, message: '最多输入150个字符', trigger: 'blur' },
          ],
          orderNum: [
            { required: true, message: '请输入排序值(0-10000的整数)', trigger: 'blur' },
            { type: 'number', message: '排序值必须为0-10000整数' },
            { validator: checkSortNum, trigger: 'blur' }
          ],
          status: [
            { required: true, message: '请选择状态', trigger: 'change' }
          ],
          leader: [
            { validator: checkCNameU, trigger: 'blur' }
          ],
          phone: [
            { validator: checkPhoneU, trigger: 'blur' }
          ],
          email: [
            { max: 50, message: '最多输入50个字符', trigger: 'blur' },
            { validator: checkEmailU, trigger: 'blur' }
          ],

          deptType: [
            { required: true, message: '请输入部门类型', trigger: 'blur' },
            /* { max: 50, message: '最多输入50个字符', trigger: 'blur' },*/
          ],
          deptCode:[
            { required: true, message: '请输入部门编码', trigger: 'blur' },
            { max: 100, message: '最多输入100个字符', trigger: 'blur' },
            { validator: checkDeptCode, trigger: 'blur' }
          ]

        }
      }
    },
    created () {
    },
    mounted () {
      this.getTableData()
    },
    methods: {
      filterTable (val) {
        // let result = recursion.recursionTreeAll(this.deptList, 'childrenList', (node) => { return node.deptName === val.deptName})
        this.formInline = Object.assign({}, this.formInline, { deptName: val.deptName })
        this.getTableData()
      },
      getTableData () {
        var data = Object.assign({}, { isHide: 'false' }, this.formInline)
        if (this.formInline.deptName && this.formInline.deptName.length > 0) {
          this.expandAll = true
        }
        GetDeptTree(data).then(res => {
          this.deptList = res.data.data
          this.treeData = [{ childrenList: res.data.data, parentId: -1, status: '0', deptName: '根节点', deptId: 0 }]
        }).then(error => {
          this.emptyText = '暂无数据'
        })
      },
      addHandle () {
        this.dialogTitle = '新增部门'
        this.optType = 'add'
        this.tempDept = {
          orderNum: 0
        }
        this.$nextTick(() => {
          this.$refs['add-dept-form-ref'].clearValidate()
        })
        this.formVisible = true
      },
      // enableHandle(row) {
      //   var deptIds = []
      //   if(row._parent) {
      //     if (row._parent.status === '0') {
      //       deptIds = [row.deptId]
      //     } else {
      //       return this.$notify({
      //         title: '错误',
      //         type: 'error',
      //         message: '该部门暂不能启用，请先启用其父级部门'
      //       })
      //     }
      //   } else {
      //     deptIds = [row.deptId]
      //   }
      //   this.$confirm('确定启用被选中的部门?', '提示', {
      //     confirmButtonText: '确定',
      //     cancelButtonText: '取消',
      //     closeOnClickModal: false,
      //     type: 'warning'
      //   }).then(() => {
      //     // var params = {}
      //     // params.deptIds = this.multipleSelection.map(item => {
      //     //   return item.deptId
      //     // })
      //     StartDeptBatch(deptIds).then(res => {
      //       this.$refs.DeptTable.clearSelection();
      //       this.getTableData();
      //     })
      //   })
      // },
      // async disableHandle(row) {
      //   let deptIds = recursion.filterTreeData(row, 'childrenList', 'deptId')
      //   try {
      //     let response = await GetDeptUserCount(deptIds)
      //     if (response.data && response.data.data >= 0) {
      //       this.$confirm('被选中部门下存在 '+'<strong style="color: red">'+response.data.data +'</strong> 位用户，确定禁用被选中吗?', '提示', {
      //         dangerouslyUseHTMLString: true,
      //         confirmButtonText: '确定',
      //         cancelButtonText: '取消',
      //         closeOnClickModal: false,
      //         type: 'warning'
      //       }).then(() => {
      //         StopDeptBatch(deptIds).then(res => {
      //           this.$refs.DeptTable.clearSelection();
      //           this.getTableData();
      //         })
      //       })
      //     }
      //   } catch (e) {
      //     console.log(e)
      //   }
      // },
      viewHandle (row) {
        this.dialogTitle = '查看详情'
        this.optType = 'view'
        this.initDialogForm(row)
        this.formVisible = true
      },
      // 编辑当前选中的部门
      updateHandle (row) {
        this.dialogTitle = '编辑部门'
        this.optType = 'update'
        this.repeatDeptName = row.deptName
        this.deptCode = row.deptCode
        this.initDialogForm(row)
        this.formVisible = true
      },
      initDialogForm (row) {
        var temp = {
          parentId: '',
          deptId: '',
          deptName: '',
          orderNum: '',
          deptType:'',
          email: '',
          leader: '',
          phone: '',
          remark: '',
          status: '',
          deptCode:''
        }
        Object.keys(temp).forEach(key => {
          temp[key] = (row[key] || row[key] === 0) ? row[key] : ''
        })
        this.tempDept = temp
        this.$nextTick(() => {
          this.$refs['add-dept-form-ref'].clearValidate()
        })
      },
      // 删除操作
      deleteHandle (row) {
        if(row.childrenList){
          this.$notify.error({
            title: '失败',
            message: '该部门下存在子部门，不能删除'
          });
          return
        }
        this.deptId = row.deptId
        GetDeptUserCount(row.deptId).then(res => {
          this.deptUsers = res.data.data  //该部门下的用户信息
          if(res.data.data.length > 0){
            this.deleteDialogVisible = true
          }else{
            this.$confirm('该部门下暂无用户，确定删除该部门吗？', '提示', { //无用户直接删除
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              closeOnClickModal: false,
              type: 'warning'
            }).then(() => {
              this.deleteDept(row.deptId)
            })
          }
        }).then(error => {
        })
      },
      exportUsers(){
        var data = Object.assign({},{deptId:this.deptId.toString()})
        ExportDeptUsers(data).then(res => {
          exportFile(res, 'xls', '部门的用户信息表')
          //  提示是否确认删除
          this.$confirm('确定删除该部门吗？ 删除后用户将变为无部门状态。', '导出成功', {
            dangerouslyUseHTMLString: true,
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            closeOnClickModal: false,
            type: 'warning'
          }).then(() => {
            this.deleteDept(this.deptId)
          })
        }).then(error =>{
        })
      },
      deleteDept (deptId) {
        DeleteDept(deptId).then(res => {
          this.$notify({
            title: '成功',
            message: '删除部门成功',
            type: 'success'
          });
          this.closeDeleteDialog()
          this.getTableData()
        })
      },
      closeDeleteDialog(){
        this.deleteDialogVisible = false
        this.deptUsers = []
      },
      addDept (dept) {
        AddDept(dept).then(res => {
          this.$notify({
            title: '成功',
            message: '部门新增成功',
            type: 'success'
          })
          this.dialogClose()
          // TODO 将刷新列表变成插入数据
          this.getTableData()
        })
      },
      updateDept (dept) {
        UpdateDept(dept).then(res => {
          this.$notify({
            title: '成功',
            message: '部门编辑成功',
            type: 'success'
          })
          this.dialogClose()
          // TODO 将刷新列表变成插入修改数据
          this.getTableData()
        })
      },
      editDataTree (val, row) {
        if (!val) return
        var newData = (val, row) => {
          if (val.length <= 0) return
          val.map((item, index) => {
            if (item.menuId === row.menuId) {
              val.splice(index, 1, row)
            } else {
              if (item.childrenList) {
                newData(item.childrenList, row)
              }
            }
          })
          return val
        }
        return newData(val, row)
      },
      saveTempData () {
        if (this.dialogTitle === '查看详情') {
          this.dialogClose()
          return
        }
        this.$refs['add-dept-form-ref'].validate(valid => {
          if (valid) {
            if (this.dialogTitle === '新增部门') {
              this.addDept(this.tempDept)
            } else if (this.dialogTitle === '编辑部门') {
              this.updateDept(this.tempDept)
            }
          }
        })
      },
      dialogClose () {
        // this.defaultCheckedKeys = [];
        this.tempDept = {}
        this.formVisible = false
        this.$refs['add-dept-form-ref'].resetFields()
      },
      // 多选操作
      handleSelectionChange (val) {
        this.multipleSelection = val
        var batchStart = true
        var batchStop = true
        val.map(item => {
          batchStart = batchStart && (item.status === '1')
          batchStop = batchStop && (item.status === '0')
        })
        this.batchStart = val.length && batchStart
        this.batchStop = val.length && batchStop
      },
    },
    watch: {
      /**
       * 侦听父级部门ID变化，判断是否要重新验证部门名称重名
       * @param nv
       * @param ov
       */
      'tempDept.parentId': function (nv, ov) {
        if (nv && this.tempDept.deptName && this.tempDept.deptName.length > 0) {
          this.$refs['add-dept-form-ref'].validateField('deptName')
        }else if(!nv){
          this.$refs['add-dept-form-ref'].clearValidate('deptName')
        }
      }
    }
  }
</script>

<style lang="stylus" scoped>
  div.deptManage {
    width 100%
    height 100%
  }
</style>
