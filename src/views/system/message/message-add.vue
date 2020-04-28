<!--
    /**
     * 新增消息
     */
-->
<template>
  <div class="msg-add">
    <el-form :model="msgForm" :rules="rules" ref="msgForm" label-width="80px" label-position="left">
      <el-form-item label="标题" prop="msgTitle">
        <el-input v-model="msgForm.msgTitle" placeholder="请输入标题" clearable></el-input>
      </el-form-item>
      <el-form-item label="收件人" prop="receiveUser">
        <user-select @change="changeHandle"></user-select>
      </el-form-item>
      <el-form-item label="内容" prop="msgContent">
        <div>
          <editor v-model="msgForm.msgContent" @change="contentChange"></editor>
        </div>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="mini" @click="submitForm('msgForm')">发送</el-button>
        <el-button icon="el-icon-back" size="mini" @click="goBack">返回</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  import { AddMsg } from 'request/services/msg.js'
  import basePage from 'mixins/base-page.js'
  import Editor from 'components/editor/editor'
  import UserSelect from './user-select.vue'

  export default {
    name: 'sys_message_add',
    mixins: [basePage],
    components: { Editor, UserSelect },
    props: {},
    data () {
      var checkSpace = (rule, value, callback) => {
        if (value.replace(/\s+/g,'') === '') {
          callback(new Error('标题不能为全空格'))
        }else {
          callback()
        }
      }
      var checkContent = (rule, value, callback) => {
        if (value !== '' && this.contentText === '') {
          callback(new Error('内容不能为全空格'))
        }else {
          callback()
        }
      }
      return {
        msgForm: {
          msgTitle: '',
          receiveUser: [],
          deptIdList: [],
          roleIdList: [],
          userIdList: [],
          msgContent: ''
        },
        contentText: '',
        rules: {
          msgTitle: [
            { required: true, message: '请输入标题', trigger: 'blur' },
            { min: 1, max: 50, message: '长度在 1 到 50 个字符', trigger: 'blur' },
            { validator: checkSpace, trigger: 'blur' }
          ],
          receiveUser: [
            { required: true, message: '请选择收件人', trigger: 'change' }
          ],
          msgContent: [
            { required: true, message: '请输入内容', trigger: 'blur' },
            { validator: checkContent, trigger: 'blur' }
          ]
        }
      }
    },
    mounted () {

    },
    methods: {
      contentChange ({html, text, quill}) {
        var imgIndex = html.indexOf('<img src=');
        if (imgIndex >= 0) {
          this.contentText = '图片';
        }else{
          this.contentText = text.replace(/\s+/g,'');
        }
      },
      changeHandle (selectedData, deptCheckedKeys, roleCheckedKeys, userCheckedKeys) {
        this.msgForm.receiveUser = selectedData;
        this.msgForm.deptIdList = deptCheckedKeys;
        this.msgForm.roleIdList = roleCheckedKeys;
        this.msgForm.userIdList = userCheckedKeys;
      },
      submitForm (formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            var data = JSON.parse(JSON.stringify(this.msgForm));
            delete data.receiveUser;
            AddMsg(data).then(res => {
              this.$notify({
                title: '成功',
                message: '发送成功',
                type: 'success'
              });
              this.$refs[formName].resetFields();
              this.$router.push({ name: 'sys_message' });
            })
          }
        })
      },
      goBack () {
        this.$router.push({ name: 'sys_message' });
      }
    }
  }
</script>

<style lang="stylus">
  .msg-add{
    padding: 0 20px;
    .ql-editor{
      height: 300px;
    }
  }
</style>
