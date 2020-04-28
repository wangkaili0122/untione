<template>
  <div class="user-select">
    <el-select ref="select" v-model="selectedData" placeholder="请选择收件人"
               style="width: 100%;" clearable multiple size="small"
               @focus="focusHandle"
               @remove-tag="removeSelectedNodes"
               @change="changeSelectedNodes">
      <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
    </el-select>
    <el-dialog
      title="选择收件人"
      width="1000px"
      :visible.sync="dialogVisible"
      :close-on-click-modal="false">
      <div class="user-select-content">
        <div class="user-select-item">
          <div class="user-select-item-title">部门</div>
          <div class="user-select-item-tree">
            <el-tree ref="deptTree" :data="deptTreeData" :props="deptTreeProps"
                     show-checkbox
                     node-key="deptId"
                     default-expand-all
                     @check-change="handleCheckChange"></el-tree>
          </div>
        </div>
        <div class="space-line"></div>
        <div class="user-select-item">
          <div class="user-select-item-title">角色</div>
          <div class="user-select-item-tree">
            <el-tree ref="roleTree" :data="roleTreeData" :props="roleTreeProps"
                     show-checkbox
                     node-key="roleId"
                     default-expand-all
                     @check-change="handleCheckChange"></el-tree>
          </div>
        </div>
        <div class="space-line"></div>
        <div class="user-select-item">
          <div class="user-select-item-title">用户</div>
          <div class="user-select-item-tree">
            <el-tree ref="userTree" :data="userTreeData" :props="userTreeProps"
                     show-checkbox
                     node-key="userId"
                     default-expand-all
                     @check-change="handleCheckChange"></el-tree>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import { GetDeptTree } from 'request/services/dept.js';
  import { GetRoleListAll } from 'request/services/role.js';
  import { GetMsgUserList } from 'request/services/msg.js';
  export default {
    name: 'user-select',
    data () {
      return {
        selectedData: [], // 选中的节点
        options: [],
        dialogVisible: false,
        deptTreeData: [],
        deptTreeProps: {
          children: 'childrenList',
          label: 'deptName'
        },
        roleTreeData: [],
        roleTreeProps: {
          children: 'childrenList',
          label: 'roleName'
        },
        userTreeData: [],
        userTreeProps: {
          children: 'childrenList',
          label: 'name'
        }
      }
    },
    created () {
      this.getDeptTree();
      this.getRoleTree();
      this.getUserTree();
    },
    methods: {
      focusHandle () {
        this.$refs.select.blur();
        this.dialogVisible = true;
      },
      getDeptTree () {
        GetDeptTree({isHide : 'true'}).then(res => {
          this.deptTreeData = res.data.data;
        })
      },
      getRoleTree () {
        GetRoleListAll().then(res => {
          this.roleTreeData = res.data.data;
        })
      },
      getUserTree () {
        GetMsgUserList().then(res => {
          this.userTreeData = res.data.data;
          this.userTreeData.map(item => {
            item.name = item.userName + ' ( ' + item.loginName + ' )';
          });
        })
      },
      // 多选，勾选上传进来的节点
      checkSelectedNodes(deptCheckedKeys, roleCheckedKeys, userCheckedKeys) {
        this.$refs.deptTree.setCheckedKeys(deptCheckedKeys);
        this.$refs.roleTree.setCheckedKeys(roleCheckedKeys);
        this.$refs.userTree.setCheckedKeys(userCheckedKeys);
      },
      // 多选，清空所有勾选
      clearSelectedNodes() {
        var deptCheckedKeys = this.$refs.deptTree.getCheckedKeys(); // 选中的部门节点
        for (let i = 0; i < deptCheckedKeys.length; i++) {
          this.$refs.deptTree.setChecked(deptCheckedKeys[i], false);
        }
        var roleCheckedKeys = this.$refs.roleTree.getCheckedKeys(); // 选中的角色节点
        for (let i = 0; i < roleCheckedKeys.length; i++) {
          this.$refs.roleTree.setChecked(roleCheckedKeys[i], false);
        }
        var userCheckedKeys = this.$refs.userTree.getCheckedKeys(); // 所选中的用户节点
        for (let i = 0; i < userCheckedKeys.length; i++) {
          this.$refs.userTree.setChecked(userCheckedKeys[i], false);
        }
      },
      // 节点选中状态发生变化时的回调
      handleCheckChange() {
        var deptCheckedKeys = this.$refs.deptTree.getCheckedKeys(); // 选中的部门节点
        var deptOptions = deptCheckedKeys.map((item) => {
          var node = this.$refs.deptTree.getNode(item);
          let tmpMap = {};
          tmpMap.value = 'dept' + node.key;
          tmpMap.label = node.label;
          tmpMap.id = node.key;
          return tmpMap;
        });
        var roleCheckedKeys = this.$refs.roleTree.getCheckedKeys(); // 选中的角色节点
        var roleOptions = roleCheckedKeys.map((item) => {
          var node = this.$refs.roleTree.getNode(item);
          let tmpMap = {};
          tmpMap.value = 'role' + node.key;
          tmpMap.label = node.label;
          tmpMap.id = node.key;
          return tmpMap;
        });
        var userCheckedKeys = this.$refs.userTree.getCheckedKeys(); // 所选中的用户节点
        var userOptions = userCheckedKeys.map((item) => {
          var node = this.$refs.userTree.getNode(item);
          let tmpMap = {};
          tmpMap.value = 'user' + node.key;
          tmpMap.label = node.label;
          tmpMap.id = node.key;
          return tmpMap;
        });
        this.options = deptOptions.concat(roleOptions,userOptions);
        this.selectedData = this.options.map((item) => {
          return item.value;
        });
        this.$emit('change', this.selectedData, deptCheckedKeys, roleCheckedKeys, userCheckedKeys);
      },
      // 多选,删除任一select选项的回调
      removeSelectedNodes(val) {
        var index = this.options.findIndex(item => item.value === val);
        var id = this.options[index].id;
        if (val.indexOf('dept') === 0) {
          this.$refs.deptTree.setChecked(id, false);
          var node = this.$refs.deptTree.getNode(id);
          if (node.childNodes.length > 0) {
            this.treeToList(node).map(item => {
              if (item.childNodes.length <= 0) {
                this.$refs.deptTree.setChecked(item, false);
              }
            });
            this.handleCheckChange();
          }
        } else if (val.indexOf('role') === 0) {
          this.$refs.roleTree.setChecked(id, false);
          var node = this.$refs.roleTree.getNode(id);
          if (node.childNodes.length > 0) {
            this.treeToList(node).map(item => {
              if (item.childNodes.length <= 0) {
                this.$refs.roleTree.setChecked(item, false);
              }
            });
            this.handleCheckChange();
          }
        } else if (val.indexOf('user') === 0) {
          this.$refs.userTree.setChecked(id, false);
          var node = this.$refs.userTree.getNode(id);
          if (node.childNodes.length > 0) {
            this.treeToList(node).map(item => {
              if (item.childNodes.length <= 0) {
                this.$refs.userTree.setChecked(item, false);
              }
            });
            this.handleCheckChange();
          }
        }
      },
      treeToList(tree) {
        var queen = [];
        var out = [];
        queen = queen.concat(tree);
        while (queen.length) {
          var first = queen.shift();
          if (first.childNodes) {
            queen = queen.concat(first.childNodes);
          }
          out.push(first);
        }
        return out;
      },
      // 选中的select选项改变的回调
      changeSelectedNodes(selectedData) {
        // 多选,清空select输入框时，清除树勾选
        if (selectedData.length <= 0) {
          this.clearSelectedNodes()
        }
      }
    }
  }
</script>

<style scoped lang="stylus">
  .user-select{
    >>>.el-dialog__body{
      padding: 0 20px 20px;
    }
    .user-select-content{
      box-sizing: border-box;
      display: flex;
      .user-select-item{
        box-sizing: border-box;
        padding: 6px 0;
        flex: 1;
        .user-select-item-title{
          border-left: 3px solid #1d8fff;
          line-height: 20px;
          padding-left: 10px;
          margin-bottom: 12px;
        }
        .user-select-item-tree{
          box-sizing: border-box;
          height: 400px;
          width: 292px;
          overflow: auto;
        }
      }
      .space-line{
        width: 2px;
        height: 444px;
        background-color: #ccc;
        margin: 0 20px;
      }
    }
  }
</style>
