<!--
    /**
     * 新增公告
     * 调用示例：
     * <notice-add></notice-add>
     */
-->
<template>
  <div class="notice-add">
    <el-form :model="noticeForm" :rules="rules" ref="noticeForm" label-width="80px" label-position="left">
      <el-form-item label="标题" prop="noticeTitle">
        <el-input v-model="noticeForm.noticeTitle" placeholder="请输入标题" clearable></el-input>
      </el-form-item>
      <el-form-item label="内容" prop="noticeContent">
        <editor v-model="noticeForm.noticeContent" @change="contentChange"></editor>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="mini" @click="submitForm('noticeForm')">发布</el-button>
        <el-button icon="el-icon-back" size="mini" @click="goBack">返回</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  import { AddNotice } from 'request/services/notice.js'
  import basePage from 'mixins/base-page.js'
  import Editor from 'components/editor/editor'

  export default {
    name: 'sys_notice_add',
    mixins: [basePage],
    components: { Editor },
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
        dicNoticeType: 'notice_type',
        noticeForm: {
          noticeTitle: '',
          noticeContent: ''
        },
        contentText: '',
        rules: {
          noticeTitle: [
            { required: true, message: '请输入标题', trigger: 'blur' },
            { min: 1, max: 50, message: '长度在 1 到 50 个字符', trigger: 'blur' },
            { validator: checkSpace, trigger: 'blur' }
          ],
          noticeContent: [
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
          this.contentText = '图片'
        }else{
          this.contentText = text.replace(/\s+/g,'')
        }
      },
      submitForm (formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            AddNotice(this.noticeForm).then(res => {
              this.$notify({
                title: '成功',
                message: '发布成功',
                type: 'success'
              })
              this.$refs[formName].resetFields();
              this.$router.push({ name: 'sys_notice' })
            })
          }
        })
      },
      goBack () {
        this.$router.push({ name: 'sys_notice' })
      }
    }
  }
</script>

<style lang="stylus">
  .notice-add{
    padding: 0 20px;
    .ql-editor{
      height: 300px;
    }
  }
</style>
