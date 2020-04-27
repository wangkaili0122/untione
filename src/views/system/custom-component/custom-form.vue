<!--
     /**
      *
      * @desc 组件描述
      * @example 调用示例
      *  <custom-form></custom-form>
      */
       -->
<template>
  <el-form ref="form" :model="formData" size="small" label-width="100px" :rules="rules"
           :disabled="this.optType==='view'">
    <el-form-item label="接口名称：" prop="interName">
      <el-input v-model="formData.interName"></el-input>
    </el-form-item>
    <el-form-item label="接口URL：" prop="interUrl">
      <el-input v-model="formData.interUrl" placeholder="格式：'http://0.0.0.0:8080/'"></el-input>
    </el-form-item>
    <el-form-item label="token：" prop="interToken">
      <el-input v-model="formData.interToken" ></el-input>
    </el-form-item>
    <el-form-item label="请求类型：" prop="requestType">
      <dict-select v-model="formData.requestType" :dict-type="'request_types'"></dict-select>
    </el-form-item>
    <el-form-item label="请求参数：" prop="requestParams">
      <!--<el-input v-model="formData.requestParams"></el-input>-->
      <div class="paramsRow" v-for="(param,index) in paramList" :key="index">
        <el-input v-model.trim="param.key" style="display: inline-block;width: 200px"></el-input>
        <span> = </span>
        <el-input v-model.trim="param.value" style="display: inline-block;width: 200px"></el-input>
      </div>
    </el-form-item>
    <el-form-item label="展示模板：" prop="expression">
      <el-input v-model="formData.expression" type="textarea"
                placeholder="嵌入参数模板为：'${data.paramName}'。data为接口返回的数据。"></el-input>
    </el-form-item>
    <el-form-item label="排序值：" prop="interSort">
      <el-input-number size="small" v-model.number="formData.interSort"
                       controls-position="right" style="width: 150px;"
                       :min="0" :max="10000" placeholder="请输入排序值">
      </el-input-number>
    </el-form-item>
    <el-form-item label="备注：" prop="remark">
      <el-input v-model="formData.remark" type="textarea"></el-input>
    </el-form-item>
  </el-form>
</template>

<script>
  import commonForm from 'mixins/common-form'
  import DictSelect from '@/components/form-input/dict-select'
  import { checkUrlRule } from 'utils/validate/validateRules'
  import { debounce } from 'lodash'
  import { CheckNameRepeat } from 'request/services/customComponent'

  export default {
    name: 'custom-form',
    components: { DictSelect },
    mixins: [commonForm],
    props: {
      rules: {
        type: Object,
        default () {
          var that = this
          var checkNameRepeat = (rule, value, callback) => {
            {
              if (this.interName !== this.formData.interName && this.formData.interName.length > 0) {
                debounce(() => {
                  CheckNameRepeat(value).then(res => {
                    if (res.data.data) {
                      callback()
                    } else {
                      callback(new Error('此接口名称已存在！'))
                    }
                  })
                }, 500)()
              }else{
                callback()
              }
            }
          }
          return {
            interName: [
              { required: true, trigger: 'blur', message: '请输入接口名称' },
              { min: 2, max: 20, trigger: 'blur', message: '接口名称长度为2-20' },
              { validator: checkNameRepeat, trigger: 'blur' }
              // { min: 2, max: 20, trigger: 'change', message: '接口名称长度为2-20' },
            ], interUrl: [
              { required: true, trigger: 'blur', message: '请输入接口URL' },
              { min: 10, max: 500, trigger: 'blur', message: '接口URL长度为10-500' },
              // { min: 10, max: 500, trigger: 'change', message: '接口URL长度为10-500' },
              { validator: checkUrlRule, trigger: 'blur' },
            ],interToken: [
              { required: true, trigger: 'blur', message: '请输入token值' },
            ],
            requestType: [
              { required: true, trigger: 'blur', message: '请输入请求类型' },
              // { min: 3, max: 10, trigger: 'blur', message: '请求类型长度为3-10' },
              { min: 3, max: 10, trigger: 'change', message: '请求类型长度为3-10' },
            ], requestParams: [
              { required: false, trigger: 'blur', message: '请输入请求参数' },
              { min: 0, max: 1000, trigger: 'blur', message: '请求参数长度为1-1000' },
              // { min: 0, max: 1000, trigger: 'change', message: '请求参数长度为1-1000' },
            ], expression: [
              { required: true, trigger: 'blur', message: '请输入展示模板' },
              { min: 1, max: 250, trigger: 'blur', message: '展示模板长度为1-250' },
              // { min: 1, max: 250, trigger: 'change', message: '展示模板长度为1-250' },
            ], remark: [
              { required: false, trigger: 'blur', message: '请输入备注' },
              { min: 0, max: 200, trigger: 'blur', message: '备注长度为1-200' },
              // { min: 0, max: 200, trigger: 'change', message: '备注长度为1-200' },
            ],
            interSort: [
              { required: true, trigger: 'blur', message: '请输入排序值(0-10000的整数)' }
            ]
          }
        }
      },
      labelWidth: {
        type: Number,
        default () {
          return 100
        }
      },
    },
    data () {
      return {
        paramList: [{ key: '', value: '' }],
        interName: ''
      }
    },
    created () {
      this.refreshParamLIst(this.model)
      this.interName=this.model.interName
    },
    methods: {
      // 获取表单中填写的数据
      getFormData () {
        if (this.formData) {

          return this.formData
        } else {
          console.error('formData属性丢失！')
          return null
        }
      },
      refreshParamLIst (newValue) {
        this.formData = JSON.parse(JSON.stringify(newValue))
        let requestParams = JSON.parse(this.formData.requestParams || '{}')
        let params = Object.keys(requestParams).map(item => {
          return { key: item, value: requestParams[item] }
        })
        params.push({ key: '', value: '' })
        this.paramList = params
      },
      requestParams () {
        let exp = {}
        this.paramList.forEach(param => {
          if (param.key.length > 0) {
            exp[param.key] = param.value
          }
        })
        return exp
      },
      testInterValidator (callback) {
        let fields = ['interUrl', 'requestType', 'expression']
        let validatorCount = 0 //已经验证的字段个数
        let execed = false //是否调用过callback，保证callback只调用一次

        this.$refs['form'].validateField(fields, (result) => {
          validatorCount++
          if (result.length > 0) {
            callback(false)
            execed = true
          } else if (validatorCount === fields.length && !execed) {
            callback(true)
          }
        })
      }
    },
    computed: {},
    watch: {
      'model': function (newValue, oldValue) {
        this.refreshParamLIst(newValue)
        this.interName = newValue.interName
      },
      'paramList': {
        handler: debounce(function (nv, ov) {

          let lastItem = nv.slice(-1)[0]
          if (lastItem.key.length > 0 || lastItem.value.length > 0) {
            this.paramList.push({ key: '', value: '' })
          } else {
            for (var i = nv.length - 2; i >= 0; i--) {
              if (nv[i].key.length == 0 && nv[i].value.length == 0) {
                nv.splice(i, 1)
              }
            }
          }
          this.formData.requestParams = JSON.stringify(this.requestParams())

        }, 300),
        deep: true
      }
    }
  }
</script>

<style scoped lang="stylus">
  div.paramsRow {
    padding 4px 0
  }
</style>
