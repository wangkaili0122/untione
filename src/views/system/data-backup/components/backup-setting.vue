<!--
     /**
      * 系统基础设置
      * @desc 组件描述
      * @example 调用示例
      *  <backup-setting></backup-setting>
      */
       -->
<template>
  <div class="data-backup">
    <el-form
      ref="form"
      :model="setting"
      label-position="left"
      label-width="100px">
      <el-form-item label="自动备份">
        <el-select
          :disabled="serverInfo.ip!=='localhost'"
          v-model="setting.isAutoBackup"
          placeholder="请选择"
          size="mini">
          <el-option key="开启" label="开启" :value="true"></el-option>
          <el-option key="关闭" label="关闭" :value="false"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="自动备份周期">
        <el-input-number
          v-model="setting.backupCycle"
          controls-position="right"
          :min="1"
          :max="30"
          size="mini"
          :disabled="!setting.isAutoBackup||serverInfo.ip!=='localhost'"
        ></el-input-number>
        天
      </el-form-item>
      <el-form-item label="自动备份时间">
        <el-time-picker
          v-model="setting.backupStarttime"
          format="HH:mm:ss"
          value-format="HH:mm:ss"
          size="mini"
          :disabled="!setting.isAutoBackup||serverInfo.ip!=='localhost'"
        ></el-time-picker>
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          size="mini"
          @click="submit"
          v-if="serverInfo.ip=='localhost'"
          style="margin-left:-100px"
          v-hasPerm="'SYS_CONFIG_SETPERSONALISE_B'|| ''"
        >保存设置</el-button>
        <el-button type="primary" size="mini" @click="manualBackup" v-hasPerm="'SYS_BACKUP_DATABACKUP_B'|| ''" v-if="serverInfo.ip=='localhost'">立即备份</el-button>

      </el-form-item>
    </el-form>
    <el-form
      ref="serverForm"
      style="width:30%;margin-bottom:30px"
      v-if="serverInfo.ip!=='localhost'"
      :model="formData"
      label-position="left"
      label-width="100px"
      size="small">
      <el-form-item label="主机IP">
        {{formData.serverIp}}
      </el-form-item>
      <el-form-item label="端口号">
        {{formData.serverPort}}
      </el-form-item>
      <el-form-item label="用户名">
        {{formData.userName}}
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  import SettingMixin from '../../sys-setting/components/setting-mixin'
  import {DataBackUp,DataBackUpAuto} from 'request/services/data-backup'
  // import basePage from 'mixins/base-page.js'
  export default {
    name: 'backup-setting',
    mixins: [SettingMixin],
    props: {
      serverInfo:{
        type:Object,
        default:()=>{
          return {}
        }
      }
    },
    data() {
      return {
        setting: {
          isAutoBackup: false,
          backupCycle: 1,
          backupStarttime: '00:00'
        },
        formData:{
          serverIp:'',
          serverPort:'',
          userName:'',
          passWord:''
        }
      }
    },
    created() {
      this.$on('setting-updated',()=>{
        DataBackUpAuto(JSON.stringify({})).then(res => {
          this.$emit('getTableData')
        })
      })
    },
    watch:{
      serverInfo(){
        if(this.serverInfo.ip!=='localhost'){
          this.$set(this.formData,'serverIp',this.serverInfo.ip)
          this.$set(this.formData,'serverPort',this.serverInfo.port)
          this.$set(this.formData,'userName',this.serverInfo.userName)
        }
      }
    },
    methods: {
      manualBackup(){
        DataBackUp(JSON.stringify({})).then(res => {
          let message = res.data.message;
          if(message === 'success'){
            this.$notify({
              message: '请求成功，正在备份中',
              type: 'success',
              offset: 120
            })
            this.$emit('getTableData')
          }else if(message === 'failed'){
            this.$notify({
              message: '请求备份失败',
              type: 'error',
              offset: 120
            })
          }else if(message === '2'){
            this.$notify({
              message: '备份正在进行中，请稍后重试',
              type: 'error',
              offset: 120
            })
          }
        })
      },

    }

  }
</script>



<style scoped lang="stylus">
  .data-backup{
    >>>.el-form-item {
      margin-bottom: 5px;
    }
    >>>.el-input-number--mini{
      width:174px;
    }
    >>>.el-date-editor.el-input, .el-date-editor.el-input__inner{
      width:174px;
    }
    >>>.el-input--mini .el-input__inner{
      height:28px !important
    }
  }
</style>
