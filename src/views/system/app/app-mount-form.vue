<!--
     /**
      * 应用挂接form表单
      * @desc 组件描述
      * @example 调用示例
      *  <app-mount-form></app-mount-form>
      */
       -->
<template>
  <el-form ref="form" :model="formData" :rules="rules" :label-width="labelWidth+'px'" :disabled="this.optType==='view'">
    <el-form-item label="应用名称" prop="appName" disabled>
      <el-input v-model="formData.appName" autocomplete="off" :maxlength="20" disabled></el-input>
    </el-form-item>
    <el-form-item label="挂接菜单" prop="appName">
      <el-popover
        placement="bottom-start"
        width="400"
        @hide="treeHide"
        v-model="popoverVisible">
        <div style="height: 400px;overflow-y: auto">
          <el-tree
            ref="menuTree"
            :data="menus"
            @check-change="checkChange"
            show-checkbox
            :props="{children:'childrenList',label:'menuName'}"
            node-key="menuId"
            :check-strictly="true"
            default-expand-all
          >
          </el-tree>
        </div>
        <el-input v-model="formData.menuNameStr" slot="reference" autocomplete="off"></el-input>
      </el-popover>
    </el-form-item>
  </el-form>
</template>

<script>
  import commonForm from 'mixins/common-form'
  import recursion from 'utils/recursion'
  import treeStructor from 'utils/treeStructor'

  export default {
    name: 'app-mount-form',
    mixins: [commonForm],
    props: {
      rules: {
        default() {
          return {
            menuIds: [
              {required: true, trigger: 'change', message: '请选择应用类型'}
            ]
          }
        }
      },
      menus: {
        required: true,
        default() {
          return []
        }
      }
    },
    data() {
      return {
        popoverVisible: false,
        currentRootNode: null// 当前已选的所有节点的公共父节点，可以是已选择的根节点
      }
    },
    created() {
    },
    methods: {
      /**
       * 选中节点变化时自动寻找所有节点的公共父节点
       * @param data 当前点击的节点
       * @param checked 点击节点的选中状态
       * @param indeterminate 子节点是否有选中节点
       */
      checkChange(data, checked, indeterminate) {
        var fatherNodes = {}
        if (!checked) {
          if(this.checkShareFather(this.$refs['menuTree'].getCheckedNodes(), 'menuId', 'parentId', 'childrenList')) {
            this.$set(this.formData, 'menuNameStr', this.$refs['menuTree'].getCheckedNodes().map(menu => menu.menuName).join(' , '))
            this.formData.menuIds = this.$refs['menuTree'].getCheckedKeys()
          }else{
            this.$notify.error({
              title: '错误',
              message: '挂接菜单只允许有一个根节点！'
            });
            this.$nextTick(()=>{
              let checkedNodes =  this.$refs['menuTree'].getCheckedNodes()
              checkedNodes.push(data)
              this.$refs['menuTree'].setCheckedNodes(checkedNodes);
            })
          }
          return
        }
        if (this.$refs['menuTree'].getCheckedNodes().length === 1) {
          this.currentRootNode = data
        } else {
          // 判断当前节点和currentRootNode的共同父节点
          fatherNodes = this.findShareFather(data)
          this.currentRootNode = fatherNodes.shareFather
        }
        var checkedKeys = this.$refs['menuTree'].getCheckedKeys()
        // 添加当前选中所有节点的公共父节点
        checkedKeys.push(this.currentRootNode.menuId)
        // 添加当前选中所有节点到公共父节点之间的所有节点
        if (fatherNodes.fathers) {
          fatherNodes.fathers.forEach(node => {
            if (checkedKeys.indexOf(node.menuId) < 0) {
              checkedKeys.push(node.menuId)
            }
          })
        }

        this.$refs['menuTree'].setCheckedKeys(checkedKeys)
        this.$set(this.formData, 'menuNameStr', this.$refs['menuTree'].getCheckedNodes().map(menu => menu.menuName).join(' , '))
        this.formData.menuIds = this.$refs['menuTree'].getCheckedKeys()
      },
      /**
       * 检查当前选中的节点是否存在公共父节点
       */
      checkShareFather(nodes, idKey, parentKey, childrenKey) {
        var result = null
        try {
          result = treeStructor(nodes, idKey, parentKey, childrenKey)
        } catch (e) {
          console.error(e)
          this.$notify.error({
            title: '错误',
            message: '树构建错误！'
          });
        }
        return result.length <= 1
      },
      treeHide() {
      },
      // 寻找点击节点和currentRootNode的共同父级节点
      findShareFather(node) {
        if (!this.currentRootNode) {
          return {shareFather: node}
        } else if (this.currentRootNode.menuId == node.menuId) {
          return {shareFather: this.currentRootNode}
        } else {
          // 找到所有父节点
          var checkedFathers = [node]
          while (recursion.recursion(this.menus, 'childrenList', (menu) => menu.menuId === checkedFathers.slice(-1)[0].parentId)) {
            checkedFathers.push(recursion.recursion(this.menus, 'childrenList', (menu) => menu.menuId === checkedFathers.slice(-1)[0].parentId))
          }
          checkedFathers.push({menuId: 0, parentId: -1})

          var currentRootFathers = [this.currentRootNode]
          while (recursion.recursion(this.menus, 'childrenList', (menu) => menu.menuId === currentRootFathers.slice(-1)[0].parentId)) {
            currentRootFathers.push(recursion.recursion(this.menus, 'childrenList', (menu) => menu.menuId === currentRootFathers.slice(-1)[0].parentId))
          }
          currentRootFathers.push({menuId: 0, parentId: -1})

          var shareFather = null
          for (var i = 0; i < (checkedFathers.length > currentRootFathers.length ? currentRootFathers.length : checkedFathers.length); i++) {
            if (checkedFathers.slice(-1 - i)[0].menuId == currentRootFathers.slice(-1 - i)[0].menuId) {
              shareFather = checkedFathers.slice(-1 - i)[0]
            } else {
              break
            }
          }
          // 返回层级较深的节点到公共父节点中间的所有节点
          var fathers = checkedFathers.length > currentRootFathers.length ? checkedFathers : currentRootFathers
          fathers = fathers.slice(0, fathers.length - i)
          return {shareFather: shareFather, fathers: fathers}
        }
      }
    },
    watch: {
      'model': function (newVal, oldVal) {
        this.currentRootNode = null
        this.$refs['menuTree'].setCheckedKeys(this.formData.menuIds)
      }
    }
  }
</script>

<style scoped>

</style>
