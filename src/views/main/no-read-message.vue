<!--
/**
  * 头部导航栏未读消息
  * @desc 组件描述
  * @author 21086
  * @data 2020/4/24
  * @example 调用示例
  * <no-read-message></no-read-message>
  */
-->
<template>
  <el-popover>
   <div class="no-read-message">
     <ul v-if="messageList.length != 0">
       <li class="no-reade-li" v-for="(item,index) in messageList" :key="index" @click="toDetail(item)">
         <span class="iconfont dotIcon"></span>
         <span>{{item.msgTitle}}</span>
       </li>
     </ul>
     <div v-else style="text-align: center; color: #ccc; line-height: 60px;">暂无未读消息</div>
     <div class="more" @click="$route.push({name:'my-message'})">查看更多</div>
   </div>
    <span slot="reference" class="no-read-tip">
      <i class="iconfont icon-lingdang tip-icon"></i>
      <i v-if="total > 0" class="iconfont icon-yuandianzhong tip-dot"></i>
    </span>
  </el-popover>
</template>

<script>
  import { GetMsg } from 'request/services/workspace.js'
  import { MsgStatusUpdate } from 'request/services/msg.js'
    export default {
        name: "no-read-message",
      data(){
          return{
            massageList:[],
            total:''
          }
      },
      mounted(){
        this.getUnreadMsg()
      },
      methods:{
        getUnreadMsg(){
          var params = {
            current: 1,
            size: 5,
            msgStatus: '0',
            orderDesc: ['msgCreateTime']
          }
          GetMsg(params).then(res =>{
            this.messageList = res.data.data.list
            this.total = res.data.data.totalCount
          })
        },
        toDetail(){
          MsgStatusUpdate(row.msgId).then(res =>{
            this.$store.commit('msg/SET_MSG_IDS', JSON.stringify(row.msgId))
          })
          let path = '/index.html#/myMessageDetail?msgId=' + row.msgId
          window.open(path, '_blank')
        },
        computed:{
          msgChange(){
            return this.$store.status.msg.msg
          }
        },
        watch:{
          msgChange: function (val) {
            if (val) {
              this.getUnreadMsg()
            }
          }
        }
      },
    }
</script>

<style scoped lang="stylus">
  .no-read-message{
    .no-read-li{
      line-height: 24px;
      font-size: 14px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      .dotIcon {
        font-size: 12px;
        padding-right: 4px;
        color: #f56c6c;
      }
    }
    .no-read-li:hover{
      color: #409EFF;
      cursor: pointer;
    }
    .more{
      text-align: center;
      color: #409EFF;
      border-top: 1px solid #e9e9e9;
      padding-top: 10px;
      margin-top: 12px;
      cursor: pointer;
      &:hover{
        color: #66b1ff;
      }
    }
  }
  .no-read-tip{
    display: inline-block;
    max-height: 60px;
    width: 34px;
    margin-right: 10px;
    .tip-icon{
      font-size: 20px;
      cursor: pointer;
      color: #e2e2e2;
    }
    .tip-dot{
      font-size: 12px;
      color: #f56c6c;
      position: relative;
      bottom: 12px;
      right: 6px;
    }
    &:hover{
      .tip-icon{
        font-weight: bold;
        color: white;
      }
      .tip-dot{
        color: #ff3c3c;
      }
    }
  }
</style>
