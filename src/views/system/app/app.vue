<!--
/**
  * @desc 组件描述
  * @author 21086
  * @data 2020/4/26
  * @example 调用示例
  * <app></app>
  */
-->
<template>
    <div>
      <div>
        <!--搜索组件-->
        <table-filter-form
          :search-show="searchShow"
          :search-fields="searchFields"
          :form-inline="filterTable">
        </table-filter-form>
        <!--刷新和是否显示所搜-->
        <el-row :gutter="10" class="optBar">
          <el-button icon="el-icon-plus" type="primary" @click="addHandler">新增</el-button>
          <el-button-ground style="float: right">
            <el-button icon="el-icon-plus" :title="searchShow ? '关闭查询':'打开查询'" size="mini" @click="searchShow = !searchShow"></el-button>
            <el-button icon="el-icon-plus" size="mini" @click="getApps"></el-button>
          </el-button-ground>
        </el-row>
        <!--table表单-->
        <el-table :data="apps" style="width: 100%">
          <el-table-column
            prop="appName"
            label="应用名称"
            width="180">
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
            prop="appUrl"
            label="应用地址">
            <template slot-scope="scope">
              <span v-if="scope.row.appType=='0'">--</span>
              <span v-else>{{scope.row.appUrl}}</span>
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
                @click="viewHandle(scope.row)"
                plain
                type="success"
                size="mini">
                详情
              </el-button>
              <el-button
                @click="updateHandle(scope.row)"
                v-hasPerm="'PLATFORM_APP_UPDATE_B'"
                plain type="primary" size="mini">
                编辑
              </el-button>
              <el-button
                @click="deleteHandle(scope.row)"
                v-hasPerm="'PLATFORM_APP_DELETE_B'"
                :disabled="(!isAdmin) && scope.row.appType===0"
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
        <!--编辑对话窗-->
       <el-dialog title="应用管理" :visible.sync="formVisible" :close-on-click-model="false" width="40%">
         <app-form ref="appForm" :model="currentEdit" :opt-type="optType" :repeat-app-name="repeatAppName"></app-form>
         <div slot="footer" class="dialog-footer">
           <el-button @click="cancelAppFormHandle" size="small">取 消</el-button>
           <el-button type="primary" @click="submit" size="small">确 定</el-button>
         </div>
       </el-dialog>
      </div>
    </div>
</template>

<script>
    import TableFilterForm from "@/components/table-filter-form/table-filter-form";
    export default {
        name: "app",
      components: {TableFilterForm}
    }
</script>

<style scoped>

</style>
