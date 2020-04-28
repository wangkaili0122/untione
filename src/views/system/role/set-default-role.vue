<template>
  <div>
    <el-dialog title="设置新增用户默认角色" :visible.sync="dialogShow" top="3%"
               :close-on-click-modal="false" width="40%" @close="cancel">
      <el-table ref="allRoleTable" :data="allRoles"
                @select="selectionChange"
                @select-all="selectAll"
                style="width: 80%; margin: 0 auto;">
        <el-table-column
          type="selection"
          width="55">
        </el-table-column>
        <el-table-column
          prop="roleName"
          label="角色名称">
        </el-table-column>
        <el-table-column
          prop="roleKey"
          label="角色标识">
        </el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel" size="small">取 消</el-button>
        <el-button type="primary" @click="setDefaultRole" size="small">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import { GetRoles, GetDefaultRole, SetDefaultRole } from 'request/services/role.js'
  export default {
    name: 'set-default-role',
    props: {
      dialogVisible: {
        type: Boolean,
        default() {
          return false
        }
      }
    },
    data () {
      return {
        dialogShow: false,
        allRoles: [],
        selectionData: {}
      };
    },
    mounted () {

    },
    methods:{
      getAllRoles () {
        var data = {
          pageMode: 'true',
          status: '0'
        }
        GetRoles(data, {showModal: false}).then(resp => {
          this.allRoles = resp.data.list;
          this.getDefaultRole();
        })
      },
      getDefaultRole () {
        GetDefaultRole().then(resp => {
          var id = resp.data.data;
          var index = this.allRoles.findIndex(item => item.roleId === id);
          if (index >= 0) {
            this.selectionData = this.allRoles[index];
            this.selectAll();
          }
        })
      },
      selectionChange (selection, row) {
        var index = selection.findIndex(item => item.roleId === row.roleId);
        if (index >= 0) {
          this.selectionData = row;
          this.selectAll();
        }
      },
      selectAll () {
        this.$refs.allRoleTable.clearSelection();
        this.$refs.allRoleTable.toggleRowSelection(this.selectionData);
      },
      setDefaultRole () {
        SetDefaultRole(this.selectionData.roleId).then(resp => {
          this.$notify({
            title: '成功',
            message: '新增用户默认角色设置成功',
            type: 'success'
          });
          this.$emit('close');
        })
      },
      cancel () {
        this.$emit('close');
      }
    },
    watch: {
      dialogVisible (newVal) {
        this.dialogShow = newVal;
        if (newVal) {
          this.getAllRoles();
        }
      }
    }
  }
</script>

<style scoped>

</style>
