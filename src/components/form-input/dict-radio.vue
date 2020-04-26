<!--
/**
  * 根据字典类型找到自动数据，自动渲染出radiogroup
  * @desc 组件描述
  * @author 21086
  * @data 2020/4/26
  * @example 调用示例
  * <dict-radio></dict-radio>
  */
-->
<template>
  <el-radio-group v-model="model" v-on="$listeners" v-bind="$attrs">
    <el-radio v-for="(dict ,index) in dictData" :key="index" :label="dict.dictValue">{{dict.dictLabel}}</el-radio>
  </el-radio-group>
</template>

<script>
  import componentMixin from './dict-component-mixins'
  export default {
    name: 'dict-radio',
    mixins: [componentMixin]
  }
</script>

<style scoped>

</style>
