<template>
  <div class="verification-mode">
    <div class="mode-title">选择验证方式</div>
    <div class="mode-list">
      <!--<a href="javascript:void(0)" @click="verification('phone')">-->
      <!--<el-row class="list_item">-->
      <!--<el-col :span="3">-->
      <!--<span class="iconfont icon-shouji mode-icon"></span>-->
      <!--</el-col>-->
      <!--<el-col :span="18" class="item-text">-->
      <!--<h3>短信验证</h3>-->
      <!--<p>你需要用注册账号时留的手机号码进行短信验证</p>-->
      <!--</el-col>-->
      <!--<el-col :span="3">-->
      <!--<span class="iconfont icon-xiangyou right-icon"></span>-->
      <!--</el-col>-->
      <!--</el-row>-->
      <!--</a>-->
      <a href="javascript:void(0)" @click="verification('email')">
        <el-row class="list_item">
          <el-col :span="3">
            <span class="iconfont icon-youxiang mode-icon"></span>
          </el-col>
          <el-col :span="18" class="item-text">
            <h3>邮箱验证</h3>
            <p>你需要用注册账号时留的邮箱进行邮箱验证</p>
          </el-col>
          <el-col :span="3">
            <span class="iconfont icon-xiangyou right-icon"></span>
          </el-col>
        </el-row>
      </a>
      <a href="javascript:void(0)" @click="verification('human')">
        <el-row class="list_item">
          <el-col :span="3">
            <span class="iconfont icon-rengongfuwu mode-icon"></span>
          </el-col>
          <el-col :span="18" class="item-text">
            <h3>人工服务</h3>
            <p>你需要拨打人工服务电话进行身份验证及密码重置</p>
          </el-col>
          <el-col :span="3">
            <span class="iconfont icon-xiangyou right-icon"></span>
          </el-col>
        </el-row>
      </a>
    </div>
  </div>
</template>

<script>
  export default {
    name: "verification-mode",
    data () {
      return {};
    },
    methods: {
      verification (mode) {
        this.$emit('chooseMode', mode);
      }
    }
  }
</script>

<style lang="stylus" scoped>
  .verification-mode{
    .mode-title{
      padding-bottom: 20px;
      font-size: 18px;
      font-weight: 700;
      text-align: center;
    }
    .mode-list{
      .list_item{
        height: 80px;
        margin-bottom: 10px;
        border: 1px solid #ededed;
        border-radius: 2px;
        background-color: #fafafa;
        cursor: pointer;
        text-align: center;
        display: flex;
        align-items: center;
        .mode-icon{
          font-size: 32px;
          color: #409EFF;
        }
        .right-icon{
          font-size: 32px;
          color: #bbb;
        }
        .item-text{
          text-align: left;
          h3{
            font-size: 16px;
            line-height: 24px;
            font-weight: 700;
            color: #4c4c4c;
          }
          p{
            font-size: 12px;
            line-height: 20px;
            color: #a5a5a5;
          }
        }
      }
    }
  }
</style>
