<template>
  <div>
    <div style="margin-bottom: 10px;">
      <el-row>
        <el-col :span="8"> 用户数量为：<span style="color: #0099ff">{{deptUsers.length}}</span></el-col>
        <el-col :span="16"><span style="color: #ff310f;">提示： 批量导出用户信息后，才可以删除部门</span></el-col>
      </el-row>
    </div>
    <el-table :data="deptUsers"
              :empty-text="deptUsers.length < 1 ? '该部门下暂无用户': ''"
              style="width: 100%"
              max-height="450">
      <el-table-column
        prop="loginName"
        show-overflow-tooltip
        label="登录名">
      </el-table-column>
      <el-table-column
        prop="userName"
        show-overflow-tooltip
        label="用户名">
      </el-table-column>
      <el-table-column
        prop="deptName"
        show-overflow-tooltip
        label="部门">
      </el-table-column>
      <el-table-column
        prop="roleName"
        show-overflow-tooltip
        label="角色">
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
  export default {
    name: "dept-users",
    props:{
      deptUsers:{
        type: Array,
        default() {
          return [];
        }
      }
    }
  }
</script>

<style scoped>

</style>
