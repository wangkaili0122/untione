<!--
/**
  * @desc 组件描述
  * @author 21086
  * @data 2020/4/27
  * @example 调用示例
  * <app-form></app-form>
  */
-->
<template>
  <el-form ref="form" :model="formData" :rules="rules" :label-width="labelWidth+'px'" :disabled="this.optType==='view'"
           size="small">
    <el-form-item label="应用名称：" prop="appName">
      <el-input v-model="formData.appName" autocomplete="off" :maxlength="20"></el-input>
    </el-form-item>
    <el-form-item v-if="showAppType" label="应用类型：" prop="appType" >
      <dict-radio dict-type="sys_app_type" :exclude="appTypeExcloude" v-model="formData.appType"></dict-radio>
    </el-form-item>
    <el-form-item v-if="formData.appType!='0'" label="应用地址：" prop="appUrl">
      <el-input v-model="formData.appUrl"></el-input>
    </el-form-item>
    <el-form-item v-if="formData.appType!='0'" label="接入类型：" prop="appAccess">
      <dict-radio dict-type="sys_app_access" v-model="formData.appAccess"></dict-radio>
    </el-form-item>
    <el-form-item v-if="formData.appType!='0'" label="打开方式：" prop="openType">
      <dict-radio dict-type="sys_app_open_type" v-model="formData.openType"></dict-radio>
    </el-form-item>
    <el-form-item label="应用排序：" prop="appSort">
      <el-input-number v-model="formData.appSort" controls-position="right" :min="0" :max="10000" style="width: 150px;" placeholder="请输入排序值"></el-input-number>
    </el-form-item>
    <el-form-item label="应用图标：" prop="appIcon">
      <pic-select v-model="formData.appIcon" @change="appIconChange"></pic-select>
    </el-form-item>
    <el-form-item v-if="formData.appType=='2'" label="联系电话：" prop="contactPhone">
      <el-input v-model="formData.contactPhone"></el-input>
    </el-form-item>
    <el-form-item v-if="formData.appType=='2'" label="所属类型：" prop="serviceTypes">
      <dict-select v-model="formData.serviceTypes" dict-type="service_label_type" multiple
                   style="width: 100%"></dict-select>
    </el-form-item>
    <el-form-item v-if="formData.appType=='2'" label="发布部门：" prop="releaseDept">
      <tree-select :data="deptTreeData"
                   v-model="formData.releaseDept"
                   :defaultProps="deptDefaultProps"
                   placeholder="请选择部门"
                   size="small"
                   clearable
                   :nodeKey="nodeKey"><!--:checkedKeys="defaultDeptKeys"-->
      </tree-select>
    </el-form-item>
    <el-form-item label="备注：" prop="remark">
      <el-input type="textarea" v-model="formData.remark" :maxlength="150" placeholder="请输入应用说明"></el-input>
    </el-form-item>
  </el-form>
</template>

<script>
  import commonForm from 'mixins/common-form'
  import DictRadio from '@/components/form-input/dict-radio'
  import PicSelect from '@/components/form-input/pic-select'
  import TreeSelect from 'components/tree-select'
  import { GetDeptTree } from 'request/services/dept'
  import { checkPhone } from 'utils/validate/validateRules'
  import DictSelect from '@/components/form-input/dict-select'
  import { CheckAppName } from 'request/services/app.js'
  import debounce from 'utils/debounce.js'

  export default {
    name: 'app-form',
    components: { DictSelect, PicSelect, DictRadio, TreeSelect },
    mixins: [commonForm],
    props: {
      repeatAppName: {
        type: String,
        default () {
          return ''
        }
      },
      rules: {
        default () {
          var checkAppName = (rule, value, callback) => {
            let checkStruct = RegExp(/^[\u4E00-\u9FA5A-Za-z0-9_\-]+$/).test(value)
            if (!checkStruct) {
              callback(new Error('应用名称只能包含中英文、数字、连接线和下划线'))
            } else {
              if (this.optType === 'update' && this.repeatAppName === value) {
                callback()
              } else {
                debounce(function () {
                  CheckAppName(value).then(res => {
                    if (res.data.data) {
                      callback()
                    } else {
                      callback(new Error('此应用名称已存在'))
                    }
                  })
                }, 500)()
              }
            }
          }
          var checkUrl = (rule, value, callback) => {
            let checkStruct = RegExp(/^((https|http|ftp|rtsp|mms)?:\/\/)+[A-Za-z0-9]+\.[A-Za-z0-9]+[\/=\?%\-&_~`@[\]\':+!]*([^<>\"\"])*$/im).test(value)
            if (value === '') {
              callback(new Error('请输入URL'))
            } else if (!checkStruct) {
              callback(new Error('请输入正确的URL'))
            } else {
              callback()
            }
          }
          return {
            appName: [
              { required: true, trigger: 'blur', message: '请输入应用名称' },
              { min: 3, max: 20, trigger: 'blur', message: '应用名称长度为3-20个字符' },
              { validator: checkAppName, trigger: 'blur' }
            ],
            appType: [
              { required: true, trigger: 'change', message: '请选择应用类型' }
            ],
            appUrl: [
              { required: true, validator: checkUrl, trigger: 'blur' }
            ],
            appAccess: [
              { required: true, trigger: 'change', message: '请选择接入类型' }
            ],
            appIcon: [
              { required: true, trigger: 'change', message: '请选择应用图标' }
            ],
            openType: [
              { required: true, trigger: 'change', message: '请选择应用打开类型' }
            ],
            appSort: [
              { required: true, trigger: 'blur', message: '请输入排序值(0-10000的整数)' }
            ],
            remark: [
              { max: 150, min: 0, trigger: 'blur', message: '请输入0-150个文字的描述' }
            ],
            serviceTypes: [
              { required: true, trigger: 'change', message: '请选择所属类型' }
            ],
            contactPhone: [
              { required: true, trigger: 'blur', message: '请输入联系电话' },
              { validator: checkPhone, trigger: 'blur' }
            ],
            releaseDept: [
              { required: true, trigger: 'change', message: '请选择发布部门' }
            ]
          }
        }
      }
    },
    data () {
      return {
        deptDefaultProps: {
          children: 'childrenList',
          label: 'deptName'
        },
        nodeKey: 'deptId',
        deptTreeData: [],
        appTypeExcloude: this.$store.getters['user/isAdmin'] ? [] : [{ dictValue: 0 }]
      }
    },
    created () {
      this.getDeptTree()
    },
    methods: {
      appIconChange (val) {
        if (val) {
          this.$refs['form'].validateField('appIcon')
        }
      },
      selectPic () {
        this.$refs['imgUploadInput'].click()
      },
      selectedPic () {
        var file = this.$refs['imgUploadInput'].files[0]
        var AllowImgFileSize = 2100000 // 上传图片最大值(单位字节)（ 2 M = 2097152 B ）超过2M上传失败
        var reader = new FileReader()
        if (file) {
          // 将文件以Data URL形式读入页面
          var imgUrlBase64 = reader.readAsDataURL(file)
          reader.onload = (e) => {
            // var ImgFileSize = reader.result.substring(reader.result.indexOf(",") + 1).length;//截取base64码部分（可选可不选，需要与后台沟通）
            if (AllowImgFileSize != 0 && AllowImgFileSize < reader.result.length) {
              alert('上传失败，请上传不大于2M的图片！')
            } else {
              // 把base64赋值给变量
              this.formData.appIcon = reader.result
              this.$refs['form'].validateField('appIcon')
              this.$forceUpdate()
            }
          }
        }
      },
      getDeptTree () {
        GetDeptTree({ isHide: 'true' }).then(res => {
          this.deptTreeData = res.data.data
        })
      }

    },
    computed: {
      showAppType(){
        // return !((!this.$store.getters['user/isAdmin']) && (this.optType === 'update' || this.optType === 'view'))
        return this.$store.getters['user/isAdmin'] || this.optType === 'add'
      }
    },
    watch: {}
  }
</script>

<style scoped>

</style>
