<!--
    /**
     * 部门小组件，展示部门结构，提供部门选择功能，方便其他模块调用
     * 调用示例：
     * <dept-compt @checked="checkedHandle" @checkChange="checkChangeHandle"></dept-compt>
     */
-->
<template>
  <div class="deptCompt">
    <!-- 部门树结构 -->
    <el-tree
      :data="depts"
      node-key="deptId"
      :props="defaultProps"
      default-expand-all
      :expand-on-click-node="false"
      :highlight-current="true"
      :show-checkbox="showCheckbox"
      @node-click="nodeClickHandle"
      ref="dept">
    </el-tree>
  </div>
</template>
<script>
  import { GetDept, GetDepts, AddDept } from 'request/services/dept.js'

  export default {
    name: 'dept-compt',
    components: {},
    mixins: [],
    props: {
      // 配置是否显示复选框
      showCheckbox: {
        type: Boolean,
        default () {
          return true
        }
      },
      // 单选还是多选
      singleCheck: {
        type: Boolean,
        default () {
          return true
        }
      },
      height: {
        type: Number,
        default () {
          return 350
        }
      },
      width: {
        type: Number,
        default () {
          return 250
        }
      }
    },
    data () {
      return {
        defaultProps: {
          children: 'children',
          label: 'deptName'
        },
        depts: []
      }
    },
    created () {
      this.getDepts()
    },
    methods: {
      getDepts () {
        // todo 传参和树结构处理
        var that = this;
        var data = {
          'current' :1,
          'size':1,
          'orderDesc':'updateTime',
          'deptName':''
        };
        GetDepts(data).then(resp => {
          that.depts = resp.data.list;
        }).catch(error => {
          console.log(error);
        })
      },
      checked () {
        // todo 选中节点后触发事件，返回刚才选中的节点
        this.$emit('checked', {})
      },
      checkChange () {
        // todo 选中或取消节点后触发该事件，返回当前所有选中的节点数据
        this.$emit('checkChange', {})
      },
      getChecked () {
        // todo 返回所有已经选中的节点数据
        return {}
      },
      nodeClickHandle (data, node, tree) {
        console.log('dept-compt', data, node, tree)
        this.$emit('node-click', data, node, tree)
      }

    }
  }
</script>
<style lang="stylus">
  .deptCompt {
    .el-tree--highlight-current .el-tree-node.is-current > .el-tree-node__content {
      background-color #c3dcfa
    }
  }
</style>
