<!--
/**
  * 根据字典类型自动找到数据，自动渲染成下拉选择框
  * @desc 组件描述
  * @author 21086
  * @data 2020/4/26
  * @example 调用示例
  * <dict-select dict-type= "dicttype"></dict-select>
  */
-->
<template>
  <el-select v-model="model" v-on="$listeners" v-bind="$attrs" placeholder="请选择">
    <el-option
      v-for="dict in dictData"
      :key="dict.dictValue"
      :value="dict.dictValue"
      :label="dict.dictLabel">
    </el-option>
  </el-select>
</template>

<script>
  import componentMixin from './dict-component-mixins'

  export default {
    name: 'dict-select',
    mixins: [componentMixin],
    model: {
      prop: 'value',
      event: 'change'
    },
    computed: {

    }
  }
</script>


<style scoped>

</style>
