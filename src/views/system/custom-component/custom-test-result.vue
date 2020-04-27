<!--
     /**
      * 接口测试结果展示
      * @desc 组件描述
      * @example 调用示例
      *  <custom-test-result></custom-test-result>
      */
       -->
<template>
  <el-form size="small" label-width="100px" class="customResult">
    <el-form-item label="返回结果">
      <el-input type="textarea" :value="JSON.stringify(response)" readonly class="responseResult" style="height:100px"></el-input>
    </el-form-item>
    <el-form-item label="表达式">
      <el-input type="textarea" :value="JSON.stringify(expression)" readonly></el-input>
    </el-form-item>
    <el-form-item label="展示结果">
      <div v-html="result"></div>
    </el-form-item>
  </el-form>
</template>

<script>
  import RenderByConfig from 'utils/renderByConfig'

  export default {
    name: 'custom-test-result',
    props: {
      response: {
        type: Object,
        required: true
      },
      expression: {
        type: String,
        required: true
      }
    },
    data () {
      return {
        result: ''
      }
    },
    created () {
      this.result = RenderByConfig.structExpression(this.response, this.expression)
    },
    methods: {},
    watch: {
      'response': function (nv, ov) {
        this.$nextTick(() => {
          this.result = RenderByConfig.structExpression(this.response, this.expression)
        })
      }
    }
  }
</script>

<style scoped lang="stylus">
  .customResult {
    >>>.responseResult{
      textarea{
        height 100px
      }
    }
  }
</style>
