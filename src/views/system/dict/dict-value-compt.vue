<!--
    /**
     * 字典小组件，展示字典结构，提供字典选择功能，方便其他模块调用
     * 调用示例：
     * <dict-value-compt></dict-value-compt>
     */
-->
<template>
  <div class="dictValueCompt">

  </div>
</template>
<script>
  export default {
    name:'dict-value-compt',
    props:{
      // 配置是否显示复选框
      checkable:{
        type:Boolean,
        default(){
          return true;
        }
      },
      // 单选还是多选
      singleCheck:{
        type:Boolean,
        default(){
          return true;
        }
      },
      height:{
        type:Number,
        default(){
          return 350;
        }
      },
      width:{
        type:Number,
        default(){
          return 250;
        }
      }
    },
    data(){
      return {

      }
    },
    created(){},
    methods:{
      getDictValues(){
        // todo 获取角色信息

      },
      checked(){
        // todo 选中节点后触发事件，返回刚才选中的节点
        this.$emit('checked',{})
      },
      checkChange(){
        // todo 选中或取消节点后触发该事件，返回当前所有选中的节点数据
        this.$emit('checkChange',{})
      },
      getChecked(){
        // todo 返回所有已经选中的节点数据
        return {}
      }
    }

  }
</script>
<style lang="stylus" scoped>
  .dictValueCompt{

  }
</style>
