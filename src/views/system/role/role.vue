<!--
    /**
     * 角色管理页面
     * 调用示例：
     * <role></role>
     */
-->
<template>
  <el-container class="main-container">
    <el-main class="right-wrapper">
      <table-filter-form
        :search-show='searchShow'
        :search-fields='searchFields'
        :form-inline='queryCondition'
        @filter-table='filterTable'>
      </table-filter-form>
      <!-- 操作按钮和控制按钮(控制列的显示和隐藏) -->
      <el-row :gutter="10" class="optBar">
        <el-button icon="el-icon-plus" type="primary" size="mini" v-hasPerm="'SYS_ROLE_ADD_B'" @click="addHandle">新增</el-button>
        <!--<el-button icon="iconfont-mini icon-jiaosexiugai" type="primary" plain size="mini" v-hasPerm="'SYS_ROLE_BINDING_DEFAULT_B'" @click="dialogVisible = true"> 默认角色</el-button>-->
        <el-button icon="el-icon-delete" type="primary" plain size="mini" v-hasPerm="'SYS_ROLE_BATCHDEL_B'" :disabled="selectedRows.length===0" @click="deleteBatchHandle">批量删除</el-button>
        <el-button-group style="float: right">
          <el-button icon="iconfont icon-chaxun" :title="searchShow ? '关闭查询': '打开查询'" size="mini" @click="searchShow = !searchShow"></el-button>
          <el-button icon="iconfont icon-shuaxin2" size="mini" title="刷新" @click="getRoles"></el-button>
          <!--<el-button icon="iconfont icon-ai-list" size="mini" title="选择列"></el-button>-->
        </el-button-group>
      </el-row>
      <el-table :data="roles" @selection-change="handleSelectionChange" style="width: 100%">
        <el-table-column
          type="selection"
          width="55">
        </el-table-column>
        <el-table-column
          prop="roleName"
          label="角色名称"
          width="180">
        </el-table-column>
        <el-table-column
          prop="roleKey"
          label="角色标识"
          width="180">
        </el-table-column>
        <el-table-column
          prop="status"
          label="角色状态"
          width="180">
          <template slot-scope="scope">
            <el-tag size="mini" :type="scope.row.status==='0'?'success':'info'">
              {{scope.row.status|dictFilter('sys_role_status')}}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column
          prop="remark"
          label="角色描述">
          <template slot-scope="scope">
            {{scope.row.remark ||  '--'}}
          </template>
        </el-table-column>
        <el-table-column
          fixed="right"
          label="操作"
          width="300">
          <template slot-scope="scope">
            <el-button
              @click="viewHandle(scope.row)"
              plain
              type="success"
              size="mini">
              详情
            </el-button>
            <el-button
              @click="updateHandle(scope.row)"
              v-hasPerm="'SYS_ROLE_EDIT_B'"
              plain type="primary" size="mini">
              编辑
            </el-button>
            <el-button v-if="scope.row.status == '1'" @click="enableHandle(scope.row)" plain type="success" size="mini">启用</el-button>
            <el-button v-if="scope.row.status == '0'" @click="disableHandle(scope.row)" plain type="info" size="mini">禁用</el-button>
            <el-button
              @click="deleteHandle(scope.row)"
              v-hasPerm="'SYS_ROLE_DELETE_B'"
              plain type="danger" size="mini">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
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
    </el-main>

    <!--编辑对话框-->
    <el-dialog title="角色管理" :visible.sync="formVisible" top="3%" :close-on-click-modal="false">
      <role-form ref="form" :model="currentEdit" :opt-type="optType" :roleTypes="roleTypes"></role-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelFormHandle" size="small">取 消</el-button>
        <el-button type="primary" @click="submit" size="small">确 定</el-button>
      </div>
    </el-dialog>

    <set-default-role :dialogVisible="dialogVisible" @close="closeHandle"></set-default-role>

  </el-container>
</template>
<script>
  import TableFilterForm from 'components/table-filter-form/table-filter-form.vue'
  import basePage from 'mixins/base-page.js'
  import { GetRoles, AddRole, UpdateRole, DeleteRole, DeleteRoleBatch, GetRole, GetRoleType, RoleUserCount, RoleBatchDisable, RoleBatchEnable } from 'request/services/role.js'
  import pagination from 'mixins/pagination'
  import roleForm from './role-form'
  import SetDefaultRole from './set-default-role.vue'

  export default {
    name: 'sys_role',
    mixins: [pagination, basePage],
    components: { TableFilterForm, roleForm, SetDefaultRole },
    props: {},
    data () {
      return {
        searchShow: true,
        // 排序条件
        sortParam: {
          orderDesc: [],
          orderAsc: ['roleSort']
        },
        // 检索条件
        queryCondition: {
          roleName: ''
        },
        searchFields: [
          { type: 'input', label: '角色名称', fieldName: 'roleName', placeholder: '请输入角色名称查询' }
        ],
        roles: [],
        currentEdit: {
          roleSort: 0
        },
        optType: 'add',
        roleTypes: [],
        formVisible: false,
        selectedRows: [],
        dialogVisible: false,
      }
    },
    created () {
      this.getRoleType()
      this.getRoles()
    },
    mounted () {

    },
    methods: {
      // 查询
      filterTable (val) {
        this.queryCondition = val
        this.resetCurrentPage()
        this.getRoles()
      },
      handleSelectionChange (val) {
        this.selectedRows = val
      },
      // 返回角色的model，里面可以设置新增的默认值
      getRoleModel () {
        return { deptIds: [], status: 0, roleSort: 0, appDetailsArr: [] }
      },
      getRoleType () {
        GetRoleType().then(resp => {
          var allRoleTypes = [
            {
              dictValue: '0',
              dictLabel: '开发超级管理员'
            },
            {
              dictValue: '1',
              dictLabel: '用户超级管理员'
            },
            {
              dictValue: '2',
              dictLabel: '普通角色'
            }
          ]
          this.roleTypes = resp.data.data
          var dict = { dictType: 'sys_role_type' }
          dict.dictValues = this.roleTypes.map(typeItem => {
            var index = allRoleTypes.findIndex(item => item.dictValue === typeItem)
            return allRoleTypes[index]
          })
          this.$store.commit('dict/ADD_DICT', dict)
        })
      },
      addHandle () {
        this.formVisible = true
        this.optType = 'add'
        this.$nextTick(() => {
          this.currentEdit = this.getRoleModel()
          this.$refs['form'].clearValidate()
          this.$refs['form'].resetFields()
        })
      },
      updateHandle (data) {
        this.formVisible = true
        this.optType = 'update'
        this.$nextTick(() => {
          this.currentEdit = JSON.parse(JSON.stringify(data))
          this.$set(this.currentEdit, 'appDetailsArr', data.appDetails.map(item => item.appId))
          this.$refs['form'].clearValidate()
          this.$refs['form'].resetFields()
        })
      },
      async deleteHandle (data) {
        try {
          let response = await RoleUserCount([data.roleId])
          if (response.data && response.data.data>=0) {
            this.$confirm('该角色下存在 '+'<strong style="color: red">'+ response.data.data +'</strong> 位用户，您确定删除当前数据么？', '提示', {
              dangerouslyUseHTMLString: true,
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              closeOnClickModal: false,
              type: 'warning'
            }).then(() => {
              this.deleteRole(data)
            })
          }
        } catch (e) {
          console.log(e)
        }
      },
      async deleteBatchHandle () {
        if (this.selectedRows.length == 0) {
          this.$alert('请选择要删除的数据！', '提示', {
            type: 'warning'
          })
          return
        }
        let roleIds = this.selectedRows.map(item => item.roleId)
        try {
          let response = await RoleUserCount(roleIds)
          if (response.data && response.data.data>=0) {
            this.$confirm('被选中角色下存在 '+'<strong style="color: red">'+ response.data.data +'</strong> 位用户，您确定删除当前数据么？', '提示', {
              dangerouslyUseHTMLString: true,
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              closeOnClickModal: false,
              type: 'warning'
            }).then(() => {
              this.deleteRoleBatch(roleIds)
            })
          }
        } catch (e) {
          console.log(e)
        }
      },
      enableHandle(row) {
        RoleBatchEnable([row.roleId]).then(res => {
          this.getRoles()
        })
      },
      async disableHandle(row) {
        try {
          let response = await RoleUserCount([row.roleId])
          if (response.data && response.data.data>=0) {
            this.$confirm('该角色下存在 '+'<strong style="color: red">'+ response.data.data +'</strong> 位用户，确定禁用该角色吗?', '提示', {
              dangerouslyUseHTMLString: true,
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              closeOnClickModal: false,
              type: 'warning'
            }).then(() => {
              RoleBatchDisable([row.roleId]).then(res => {
                this.getRoles()
              })
            })
          }
        } catch (e) {
          console.log(e)
        }
      },
      viewHandle (data) {
        this.formVisible = true
        this.$nextTick(() => {
          this.currentEdit = JSON.parse(JSON.stringify(data))
          this.$set(this.currentEdit, 'appDetailsArr', data.appDetails.map(item => item.appId))
          this.$refs['form'].clearValidate()
          this.$refs['form'].resetFields()
        })
        this.optType = 'view'
      },
      cancelFormHandle () {
        this.formVisible = false
        this.$refs['form'].clearValidate()
        this.$refs['form'].resetFields()
        this.currentEdit = this.getRoleModel()
      },
      submit () {
        if(this.optType === 'view'){
          this.cancelFormHandle();
          return
        }
        this.$refs['form'].validate((valid) => {
          if (valid) {
            switch (this.optType) {
              case 'add':
                this.addRole(this.$refs['form'].getFormData())
                break
              case 'update':
                this.updateRole(this.$refs['form'].getFormData())
                break
              case 'delete':
                this.deleteRole(this.$refs['form'].getFormData())
                break
            }
          } else {
            console.log('error submit!!')
            return false
          }
        })
      },
      getPageData () {
        this.getRoles()
      },
      getRoles () {
        var condition = Object.assign({}, this.paginationParams, this.sortParam, this.queryCondition)
        GetRoles(condition).then(resp => {
          this.roles = resp.data.list
          this.pagination.totalCount = resp.data.totalCount
        })
      },

      addRole (role) {
        if (role.menuIds) {
          role.menuIds = role.menuIds.map(id => parseInt(id))
        }
        role.appDetails = role.appDetailsArr.map(item => { return { 'appId': item, appStatus: '0' } })
        if (this.roleTypes.length <= 1) {
          role.roleType = '2'
        }
        AddRole(role).then(resp => {
          this.$notify({
            title: '成功',
            message: '角色添加成功！',
            type: 'success'
          })
          this.getRoles()
          this.cancelFormHandle()
        })
      },
      updateRole (role) {
        role.appDetails = role.appDetailsArr.map(item => { return { 'appId': item, appStatus: '0' } })
        UpdateRole(role).then(resp => {
          // var index = this.roles.findIndex(roleItem => roleItem.roleId === role.roleId)
          // this.roles.splice(index, 1, JSON.parse(JSON.stringify(role)))
          this.getRoles()
          this.$notify({
            title: '成功',
            message: '角色编辑成功！',
            type: 'success'
          })
          this.cancelFormHandle()
        })
      },
      deleteRole (role) {
        DeleteRole(role.roleId).then(resp => {
          this.getRoles()
          this.$notify({
            title: '成功',
            message: '角色删除成功！',
            type: 'success'
          })
        })
      },
      deleteRoleBatch (roleIds) {
        DeleteRoleBatch(roleIds).then(resp => {
          this.getRoles()
          this.$notify({
            title: '成功',
            message: '角色批量删除成功！',
            type: 'success'
          })
        })
      },
      closeHandle () {
        this.dialogVisible = false;
      }
    },
    computed: {}
  }
</script>
<style lang="stylus" scoped>
  .right-wrapper{
    padding 0px
    overflow-x hidden
    overflow-y auto
  }
</style>
