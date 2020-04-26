<!--
/**
  * @desc 组件描述
  * @author 21086
  * @data 2020/4/26
  * @example 调用示例
  * <dict-checkbox dict-type="dicttype"></dict-checkbox>
  */
-->
<template>
  <el-checkbox-group v-model="model" v-on="$listeners" v-bind="$attrs">
    <el-checkbox v-for="(dict,index) in dictData" :key="index" :label="dict.dictValue" :border="border">{{dict.dictLabel}}</el-checkbox>
  </el-checkbox-group>
</template>

<script>
  import componentMixin from './dict-component-mixins'
  export default {
    name: 'dict-checkbox',
    mixins: [componentMixin],
    props: {
      border: {
        type: Boolean,
        default () { return false }
      }
    }
  }
</script>

<style scoped>

</style>
