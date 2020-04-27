<!--
     /**
      * app和菜单挂接
      * @desc 组件描述
      * @example 调用示例
      *  <app-mount></app-mount>
      */
       -->
<template>
  <div class="app-mount">
    <div>
      <!-- 操作按钮和控制按钮(控制列的显示和隐藏) -->
      <el-row :gutter="10" class="search-row">
        <el-col :span="18">
          <table-filter-form
            :search-show='searchShow'
            :search-fields='searchFields'
            :form-inline='queryCondition'
            @filter-table='filterTable'>
          </table-filter-form>
        </el-col>
        <!--<el-button icon="el-icon-plus" type="primary" size="mini" v-hasPerm="'PLATFORM_APP_ADD_B'" @click="addHandle">新增</el-button>-->
        <!--<el-button icon="el-icon-delete" plain type="primary" size="mini" :disabled="multipleSelection.length===0" @click="batchDeteteHandle">批量删除</el-button>-->
        <el-button-group style="height: 46px; float: right">
          <el-button icon="iconfont icon-chaxun" :title="searchShow ? '关闭查询': '打开查询'" size="mini" @click="searchShow = !searchShow"></el-button>
          <el-button icon="iconfont icon-shuaxin2" size="mini" title="刷新" @click="getApps"></el-button>
          <!--<el-button icon="iconfont icon-ai-list" size="mini" title="选择列"></el-button>-->
        </el-button-group>
      </el-row>

      <el-table :data="apps"
                style="width: 100%">
        <el-table-column type="expand">
          <template slot-scope="props">
            <div class="menuContent">
              <span class="menuItemShow" v-for="menu in props.row.menuIds"
                    :key="menu">{{getMenu(menu).menuName}}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          prop="appName"
          label="应用名称">
        </el-table-column>
        <el-table-column
          prop="appType"
          label="应用类型"
          width="180">
          <template slot-scope="scope">
            <span>{{scope.row.appType|dictFilter('sys_app_type')}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="appAccess"
          label="接入类型"
          width="180">
          <template slot-scope="scope">
            <span v-if="scope.row.appType=='1'">{{scope.row.appAccess|dictFilter('sys_app_access')}}</span>
            <span v-else>--</span>
          </template>
        </el-table-column>

        <el-table-column
          prop="appIcon"
          width="100"
          label="应用图标">
          <template slot-scope="scope">
            <img
              :src="scope.row.appIcon.indexOf('base64')>=0?scope.row.appIcon:( $project.serverUrl +'/'+ scope.row.appIcon)"
              alt="" class="appIcon">
          </template>
        </el-table-column>
        <el-table-column
          fixed="right"
          label="操作"
          width="220">
          <template slot-scope="scope">
            <el-button
              @click="mountHandle(scope.row)"
              v-hasPerm="'PLATFORM_APP_MENU_RELATION_B'"
              plain type="primary" size="mini">
              挂载
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
    </div>

    <!--编辑对话框-->
    <el-dialog title="应用挂载" :visible.sync="formVisible" :close-on-click-modal="false" width="600px">
      <app-form ref="appForm" :model="currentEdit" :menus="menus" :opt-type="optType"></app-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelAppFormHandle" size="small">取 消</el-button>
        <el-button type="primary" @click="submit" size="small">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import TableFilterForm from 'components/table-filter-form/table-filter-form.vue'
  import basePage from 'mixins/base-page.js'
  import pagination from 'mixins/pagination'
  import appForm from './app-mount-form'
  import {GetApps, AppMenuRelation} from 'request/services/app.js'
  import {GetMenus} from 'request/services/menu'
  import recursion from 'utils/recursion'
  import { GetAppTypes } from 'request/services/app-type'

  export default {
    name: 'sys_app_mount',
    mixins: [basePage, pagination],
    components: { TableFilterForm, appForm},
    data() {
      return {
        searchShow: true,
        // 检索条件
        queryCondition: {
          appName: '',
          appType: '0'
        },
        searchFields: [
          { type: 'input', label: '应用名称', fieldName: 'appName', placeholder: '请输入应用名称查询' },
          // { type: 'dictSelect', label: '应用类型', fieldName: 'appType', placeholder: '请选择', dictType: 'sys_app_type'}
        ],
        apps: [],
        menus: [],
        currentEdit: {},
        optType: 'add',
        formVisible: false
      }
    },
    beforeCreate() {
    },
    created() {
      this.getAppTypes()
      this.getApps()
      this.getMenus()
    },
    methods: {
      getAppTypes () {
        var param = {
          'pageMode': 'true'
        }
        GetAppTypes(param).then(resp => {
          var dict = { dictType: 'sys_app_type' }
          dict.dictValues = resp.data.list.map(typeItem => {
            return {
              dictLabel: typeItem.manageName,
              dictValue: typeItem.manageId
            }
          })
          this.$store.commit('dict/ADD_DICT', dict)
        })
      },
      // 查询
      filterTable (val) {
        this.queryCondition = val
        this.resetCurrentPage()
        this.getApps()
      },
      getAppModel() {
        return {appId: '', menuIds: []}
      },
      mountHandle(data) {
        this.formVisible = true
        this.optType = 'update'
        this.$nextTick(() => {
          this.currentEdit = JSON.parse(JSON.stringify(data))
          this.$refs['appForm'].clearValidate()
          this.$refs['appForm'].resetFields()
        })
      },
      cancelAppFormHandle() {
        this.formVisible = false
        this.$refs['appForm'].clearValidate()
        this.$refs['appForm'].resetFields()
        this.currentEdit = this.getAppModel()
      },
      submit() {
        this.$refs['appForm'].validate((valid) => {
          if (valid) {
            switch (this.optType) {
              case 'view':
                this.cancelAppFormHandle()
                break
              case 'update':
                this.updateApp(this.$refs['appForm'].getFormData())
                break
            }
          } else {
            console.log('error submit!!')
            return false
          }
        })
      },
      getMenus: function () {
        GetMenus({}).then(resp => {
          var allMenus = [{
            menuId: 0,
            parentId: -1,
            menuName: '根节点',
            menuType: 'C',
            childrenList: recursion.recursionTree(resp.data.data, 'childrenList', (menu) => menu.menuType === 'C')
          }]
          this.menus = allMenus
        })
      },
      getPageData(){
        this.getApps()
      },
      getApps() {
        var condition = Object.assign({}, this.paginationParams, this.queryCondition)
        GetApps(condition).then(resp => {
          this.apps = resp.data.data.list
          this.pagination.totalCount = resp.data.data.totalCount
        })
      },
      updateApp(data) {
        var formData = {appId: data.appId, menuIds: data.menuIds}
        AppMenuRelation(formData).then(resp => {
          var index = this.apps.findIndex(app => app.appId === data.appId)
          if (index >= 0) {
            this.apps.splice(index, 1, JSON.parse(JSON.stringify(data)))
          }
          this.$notify({
            title: '成功',
            message: '应用编辑成功！',
            type: 'success'
          })
          this.cancelAppFormHandle()
        })
      },
      getMenu(menuId) {
        return recursion.recursion(this.menus, 'childrenList', (menu) => menu.menuId == menuId)
      }
    }
  }
</script>

<style scoped lang="stylus">
  .app-mount {
    .search-row{
      padding: 0 5px 10px 0;
    }
    .menuContent {
      padding-left 100px
      .menuItemShow {
        display inline-block
        line-height 20px
        padding 5px 10px
      }
    }
  }

  .appIcon {
    width: 28px;
    height: 28px;
    vertical-align: bottom;
  }
</style>
