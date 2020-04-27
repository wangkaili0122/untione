<!--
     /**
      * 数据备份列表页
      * @desc 组件描述
      * @example 调用示例
      */
       -->


<template>
  <div class="data-backup">
    <div class="service-cont">
      <el-row>
        <el-col :span="4"  v-for="(item,index) in serverList" :key="index">
          <div class="service-item" @click="skipTo(item)">
            <div class="doList" v-if='index>0'>
              <i class="iconfont icon-bianji"  @click.stop="editServer(item)" title="编辑节点"  v-hasPerm="'SYS_BACKUP_UPDATE_B'|| ''"></i>
              <i class="iconfont icon-delete3e" @click.stop="deleteServer(item.infoId)" title="删除节点" v-hasPerm="'SYS_BACKUP_DELETE_B'|| ''"></i>
            </div>
            <div class="imgCont">
              <i class="serverImg iconfont" :class="index==0?'icon-fuwuqi':'icon-jiedian'"></i>
            </div>
            <h3 class="ip">
              {{index>0?item.ip:'主节点'}}
            </h3>
            <el-button type="primary" @click="skipTo(item)" class="server-button">查看详情</el-button>
          </div>
        </el-col>
        <el-col :span="4">
          <div class="service-item" @click="addService" title="添加节点">
            <i class="iconfont icon-add1 add-server"></i>
          </div>
        </el-col>
      </el-row>
    </div>
    <el-dialog
      :title="editType?'编辑节点':'新增节点'"
      width="35%"
      :close-on-click-modal="false"
      :visible.sync="dialogFormVisable" :before-close="cancel">
      <el-form
        ref="serverForm"
        v-if='dialogFormVisable'
        :model="formData"
        label-width="120px"
        size="small"
        label-position="right"
        :rules="rules">
        <el-form-item prop="serverIp" label="主机IP：">
          <el-input placeholder="请输入主机IP" v-model="formData.serverIp" :disabled="editType"></el-input>
        </el-form-item>
        <el-form-item prop="serverPort" label="端口号：">
          <el-input placeholder="请输入端口号" v-model="formData.serverPort"></el-input>
        </el-form-item>
        <el-form-item label="用户名：" prop="userName">
          <el-input
            v-model="formData.userName"
            maxlength="50"
            show-word-limit
            placeholder="请输入用户名"
            type="text"
            trigger-on-focus="false"></el-input>
        </el-form-item>
        <el-form-item label="密码：" prop="passWord" >
          <el-input v-model="formData.passWord" show-password  placeholder="请输入密码" type="password"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="testConnect" size="small">测试连接</el-button>
        <el-button type="primary" @click="submit" size="small" :disabled="!testResult">保存</el-button>
        <el-button @click="cancel" size="small">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  // import BackupSetting from "./components/backup-setting";
  // import BackupTable from "./components/backup-table";
  import basePage from 'mixins/base-page.js'
  import commonForm from 'mixins/common-form'
  import { CheckIp,BackupTestRest,BackupAdd,BackupList,BackupDelete,BackupUpdate} from 'request/services/data-backup.js'
  import debounce from 'utils/debounce.js'
  import DES from 'utils/security/DESUtil'
  export default {
    name: 'data-backup',
    components: { },
    mixins: [commonForm,basePage],
    props: {
      rules: {
        default() {
          const that = this;
          // let checkUserPhoneNum = (rule, value, callback) => {
          //   const checkPhone = RegExp(/^((13[0-9])|(14[5-9])|(15([0-3]|[5-9]))|(16[5-6])|(17[0,1,3,4,5,6,7,8])|(18[0-9])|(19[1,8,9]))\d{8}$/im).test(value)
          //   if (!value || value === '') {
          //     callback(new Error('请输入您的手机号'))
          //   } else if (!checkPhone) {
          //     callback(new Error('请输入正确的11位的手机号码'))
          //   } else {
          //     debounce(function () {
          //       RegisterCheckRepeatPhone(value).then(res => {
          //         if (res.data.data) {
          //           callback()
          //         } else {
          //           callback(new Error('此手机号已存在'))
          //         }
          //       })
          //     }, 200)()
          //   }
          // }
          let checkServerIp = (rule, value, callback) => {
            let checkStruct = RegExp(/^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/).test(value)
            if (!checkStruct) {
              callback(new Error('IP地址格式不正确'))
            } else if(!that.editType){
              debounce(function () {
                CheckIp(value).then(res => {
                  if(res.data.data){
                    callback()
                  }else{
                    callback(new Error('此IP已对应存在'))
                  }
                }).catch(err => {
                  callback(new Error('此IP已对应存在'))
                })
              }, 500)()
            }else{
              callback()
            }
          };
          let checkServerIpPort = (rule, value, callback) => {
            let checkStruct = RegExp(/^([0-9]|[1-9]\d|[1-9]\d{2}|[1-9]\d{3}|[1-5]\d{4}|6[0-4]\d{3}|65[0-4]\d{2}|655[0-2]\d|6553[0-5])$/).test(value);
            if (this.optType === 'view') {
              callback()
            } else {
              if (!checkStruct) {
                callback(new Error('请输入正确的端口号'))
              } else {
                callback()
              }
            }
          };
          return {
            userName: [
              {required: true, message: '请输入用户名', trigger: 'blur'},
              {max: 50, message: '最多输入50个字符', trigger: 'blur'},
              // {validator: checkSpecialWord, trigger: 'blur'}
            ],
            passWord: [
              { required: true, trigger: 'blur', message: '请输入您的密码' },
              { max:50, trigger: 'blur', message: '最多输入50个字符' },
              // {required: true, validator: checkStrongPassword, trigger: 'blur'}
            ],
            serverIp: [
              {required: true, trigger: 'blur', message: '请输入主机IP地址'},
              {validator: checkServerIp, trigger: 'blur'}
            ],
            serverPort: [
              {required: true, trigger: 'blur', message: '请输入端口'},
              {validator: checkServerIpPort, trigger: 'blur'}
            ],
          }
        }
      }
    },
    data() {
      return {
        serverList:[
          {
            ip: 'localhost'
          }
        ],
        dialogFormVisable:false,
        formData:{
          serverIp:'',
          serverPort:'',
          userName:'',
          passWord:''
        },
        testResult:false,
        editType:false,
        infoId:null
        // getTable:false
      }
    },
    created() {
    },
    methods: {
      getServerList(){
        BackupList({}).then(res => {
          this.serverList.splice(1,this.serverList.length)
          this.serverList.push(...res.data.data);
        })
      },
      skipTo(item){
        let param = {
          ip:item.ip,
          port:item.port,
          userName:item.userName
        }
        this.$router.push({name: 'backup-list', query: {serverInfo: JSON.stringify(param)}})
      },
      addService(){
        this.testResult = false;
        this.editType = false;
        this.infoId = null;
        this.dialogFormVisable = true
      },
      testConnect(){
        this.$refs['serverForm'].validate((valid) => {
          if (valid) {
            let params = {
              ip: this.formData.serverIp,
              passwd: DES.encrypt(this.formData.passWord),
              port:this.formData.serverPort,
              userName: this.formData.userName,
            }
            BackupTestRest(params).then(res => {
              let code = res.data.code;
              let msg = res.data.message;
              this.$notify({
                message: msg,
                type: code == '0'?'success':'warning',
                offset: 120
              });
              this.testResult = code == '0'
            })
          } else {
            console.log('error register!!')
            return false
          }
        })

      },
      submit(){
        let params = {
          infoId:this.infoId,
          ip: this.formData.serverIp,
          passwd: DES.encrypt(this.formData.passWord),
          port:this.formData.serverPort,
          userName: this.formData.userName,
        }
        if(this.editType){
          BackupUpdate(params).then(res => {
            let data = res.data.data;
            if(data){
              this.$notify({
                message: '节点修改成功',
                type: 'success',
                offset: 120
              });
              this.cancel();
              this.getServerList();
            }else{
              this.$notify({
                message: '节点修改失败，请重试',
                type: 'warning',
                offset: 120
              });
            }
          })
        }else{
          BackupAdd(params).then(res => {
            let data = res.data.data;
            if(data){
              this.$notify({
                message: '节点新增成功',
                type: 'success',
                offset: 120
              });
              this.cancel();
              this.getServerList();
            }else{
              this.$notify({
                message: '节点新增失败，请重试',
                type: 'warning',
                offset: 120
              });
            }
          })
        }
      },
      cancel(){
        this.$refs['serverForm'].clearValidate()
        this.$refs['serverForm'].resetFields()
        this.formData = {
          serverIp:'',
          serverPort:'',
          userName:'',
          passWord:''
        },
          this.dialogFormVisable = false
      },
      deleteServer(infoId){
        this.$confirm('确定删除该节点？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          closeOnClickModal: false
        }).then(() => {
          BackupDelete(infoId).then(res => {
            let data = res.data.data;
            if(data){
              this.$notify({
                message: '节点删除成功',
                type: 'success',
                offset: 120
              });
              this.getServerList();
            }else{
              this.$notify({
                message: '节点删除失败',
                type: 'warning',
                offset: 120
              });
            }
          })
        })

      },
      editServer(item){
        this.formData = {
          serverIp:item.ip,
          serverPort:item.port,
          userName:item.userName,
          passWord:DES.decrypt(item.passwd),
        }
        this.testResult = false;
        this.editType = true
        this.infoId = item.infoId
        this.dialogFormVisable = true
      }
    },

    mounted(){
      this.getServerList();
    },
    watch:{
      'formData':{
        handler(){
          this.testResult = false
        },
        deep:true
      }
    }
  }
</script>

<style scoped lang="stylus">
  .data-backup{
    position: relative;
    .el-dialog__body{
      padding 30px 60px 10px 20px
    }
    .doList{
      float:right
      margin:10px 5px 0 0;
      color:#000
      .iconfont{
        margin-right:5px
        font-size:22px;
        &:hover{
          color:#1d8fff
        }
      }
    }
    .imgCont i{
      position: absolute;
      color:#4f82ff
      font-size:70px;
      top:40%;
      left:50%;
      width:70px;
      height:70px;
      transform:translate(-50%,-50%)
      overflow hidden
    }
    .ip{
      position: absolute;
      top:60%;
      left:50%;
      transform:translate(-50%,-50%)
    }
    .server-button{
      position: absolute;
      top:80%;
      left:50%;
      transform:translate(-50%,-50%)
    }

  }
  .service-item{
    width:250px;
    height:300px;
    box-shadow: 0 2px 2px 0 rgba(0,0,0,0.16), 0 0 0 1px rgba(0,0,0,0.08);
    display inline-block
    position: relative
    cursor pointer
    &:hover{
      box-shadow: 0 3px 8px 0 rgba(0,0,0,0.2), 0 0 0 1px rgba(0,0,0,0.08);
    }
    .add-server{
      position: absolute;
      font-size: 100px;
      top: 50%;
      left: 50%;
      transform: translate(-50%,-50%);
    }
  }
</style>
