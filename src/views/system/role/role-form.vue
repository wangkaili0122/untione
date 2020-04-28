<!--
     /**
      * 组件名称
      * @desc 组件描述
      * @example 调用示例
      *  <role-form></role-form>
      */
       -->
<template>
  <el-form ref="form" :model="formData" :rules="rules" :label-width="labelWidth+'px'" :disabled="this.optType==='view'">
    <el-form-item label="角色名称：" prop="roleName">
      <el-input size="small" v-model="formData.roleName" autocomplete="off" :maxlength="64"></el-input>
    </el-form-item>
    <el-form-item label="角色标识：" prop="roleKey" >
      <el-input size="small" v-model="formData.roleKey" autocomplete="off" :maxlength="64" :disabled="optType==='update'"></el-input>
    </el-form-item>
    <el-form-item label="角色类型：" prop="roleType" v-if="roleTypes.length > 1">
      <dict-select dict-type="sys_role_type" v-model="formData.roleType"
                   :disabled="optType==='update'"
                   filterable clearable size="small"></dict-select>
    </el-form-item>
    <!--<el-form-item label="角色状态" prop="status" v-if="optType!='add'">-->
    <!--<dict-radio dict-type="sys_role_status" v-model="formData.status"></dict-radio>-->
    <!--</el-form-item>-->
    <el-form-item label="角色排序：" prop="roleSort">
      <el-input-number size="small" v-model.number="formData.roleSort" controls-position="right"
                       style="width: 150px;" :min="0" :max="10000" placeholder="请输入排序值"></el-input-number>
    </el-form-item>
    <el-form-item label="菜单权限：">
      <el-card class="box-card" shadow="never" style="width: 100%;height:300px">
        <div style="overflow: auto;height: 250px">
          <tree-checkbox :data="treeCheckData" v-model="formData.menuIds" :children-key="childrenKey"
                         :label-key="labelKey" :value-key="valueKey"></tree-checkbox>
        </div>
      </el-card>
    </el-form-item>
    <el-form-item label="应用权限：">
      <div style="overflow: hidden; height: 200px;box-sizing: border-box;padding:20px; border: 1px solid #ebeef5;" class="el-table--border">

        <el-checkbox-group class="roleForm"
                           v-model="formData.appDetailsArr" style="overflow: auto;height: 180px">
          <div class="contentTitle">应用中心</div>
          <el-checkbox v-for="app in apps" :label="app.appId" :key="app.appId" class="roleFormCheck">
            <div :title="app.appName"><img :src="$project.serverUrl+'/'+app.appIcon" alt="暂无图片" class="appIcon"
                                           @error="imgError"></div>
            <span class="appName" :title="app.appName">{{app.appName}}</span>
          </el-checkbox>
          <!--          <div class="contentTitle">服务中心</div>-->
          <!--          <el-checkbox v-for="app in services" :label="app.appId" :key="app.appId" class="roleFormCheck">-->
          <!--            <div :title="app.appName"><img :src="$project.serverUrl+'/'+app.appIcon" alt="暂无图片" class="appIcon"-->
          <!--                                           @error="imgError"></div>-->
          <!--            <span class="appName" :title="app.appName">{{app.appName}}</span>-->
          <!--          </el-checkbox>-->
        </el-checkbox-group>
      </div>
    </el-form-item>
  </el-form>
</template>

<script>
  import commonForm from 'mixins/common-form'
  import DictRadio from '@/components/form-input/dict-radio'
  import DictSelect from 'components/form-input/dict-select'
  import TreeCheckbox from '@/components/tree-checkbox/tree-checkbox'
  import { GetMenus } from 'request/services/menu'
  import { checkRoleKey } from 'utils/validate/validateRules'
  import { GetApps } from 'request/services/app'
  import { CheckRoleName } from 'request/services/role.js'
  import debounce from 'utils/debounce.js'
  import defaultPng from '../../../../public/img/app/default.png'

  export default {
    name: 'role-form',
    mixins: [commonForm],
    components: { TreeCheckbox, DictRadio, DictSelect },
    props: {
      roleTypes: {
        type: Array,
        default () {
          return []
        }
      },
      rules: {
        default () {
          const that = this;
          var checkRoleName = (rule, value, callback) => {
            let checkStruct = RegExp(/^[\u4E00-\u9FA5A-Za-z0-9_-]+[\s\u4E00-\u9FA5A-Za-z0-9_-]*$/).test(value)
            if (!checkStruct) {
              callback(new Error('角色名称只能输入中文、英文、数字、空格、下划线和连接线，其中首部不能为空格'))
            } else {
              if (that.optType === 'update' && that.repeatRoleName === value) {
                callback()
              } else {
                debounce(function () {
                  CheckRoleName(value).then(res => {
                    if (res.data.data) {
                      callback()
                    } else {
                      callback(new Error('此角色名称已存在'))
                    }
                  })
                }, 500)()
              }
            }
          }
          return {
            roleName: [
              { required: true, trigger: 'blur', message: '请输入角色名称' },
              { min: 1, max: 64, trigger: 'blur', message: '角色名称长度为1-64个字符' },
              { validator: checkRoleName, trigger: 'blur' }
            ],
            roleKey: [
              { required: true, trigger: 'blur', message: '请输入角色key' },
              { min: 1, max: 64, trigger: 'blur', message: '角色key长度为1-64个字符(只能包含英文字母、短横线、下划线)' },
              { validator: checkRoleKey, trigger: 'blur' }
            ],
            roleType: [
              { required: true, trigger: 'change', message: '请选择角色类型' },
            ],
            roleSort:[
              { required: true, trigger: 'change', message: '请输入排序值(0-10000的整数)' },
            ]
          }
        }
      }
    },
    data () {
      return {
        treeCheckData: [],
        childrenKey: 'childrenList',
        labelKey: 'menuName',
        valueKey: 'menuId',
        selectValue: ['sys_management', 'sys_management3sd', 'sys_user1'],
        apps: [],
        services: [],
        repeatRoleName: ''
      }
    },
    created () {
      this.getMenus()
      this.getApps()
    },
    methods: {
      getMenus () {
        GetMenus({}, { showModal: false }).then(resp => {
          this.treeCheckData = resp.data.data
        })
      },
      getApps () {
        GetApps({ pageMode: 'true', appType: '1' }).then(resp => {
          this.apps = resp.data.data.list
        })
        GetApps({ pageMode: 'true', appType: '2' }).then(resp => {
          this.services = resp.data.data.list
        })
      },
      imgError (e) {
        e.target.src = defaultPng
      }
    },
    watch: {
      'model': function (newValue, oldValue) {
        this.formData = JSON.parse(JSON.stringify(newValue))
        this.repeatRoleName = newValue.roleName
      },
      'selectValue': function (newval, oldval) {
      }
    }
  }
</script>

<style scoped lang="stylus">
  .el-card__body {
    padding 10px
  }

  .appIcon {
    width 40px
    height 40px
  }

  .roleForm {
    display flex
    flex-direction row
    flex-wrap wrap
    .roleFormCheck {
      display inline-block
      width 85px
      height 70px
      /*vertical-align bottom*/
      margin-bottom 10px
      margin-left 20px
    }
  }

  .contentTitle {
    width 100%
    padding 0px 20px 5px 20px
    margin-bottom 10px
    font-size 14px
    border-bottom 1px solid #d3d3d3
  }

  .appName {
    overflow hidden
    display inline-block
    text-overflow ellipsis
    width 80px
    vertical-align middle
    white-space nowrap
  }
</style>
