<!--
     /**
      * 用户信息抽取的数据源配置
      * @desc 组件描述
      * @example 调用示例
      *  <custom-component-item></custom-component-item>
      */
       -->
<template>
  <div class="content" :style="style">
    <div :style="customItem" v-html="content"></div>
  </div>
</template>

<script>
  //import {GetUserInfo} from '@/request/services/user'
  import RenderByConfig from 'utils/renderByConfig'
  import axios from 'axios'

  export default {
    name: 'custom-component-item',
    props: {
      config: {
        required: true,
        type: Object,
        default () {
          return {}
        }
      },
      bg: {
        required: true
      },
      bgColor: {
        required: true
      }
    },
    data () {
      var that = this

      function getBgUrl () {
        return `url('${that.bg}')`
      }

      return {
        content: '',
        style: {
          backgroundImage: getBgUrl(),
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'contain',
          backgroundColor:this.bgColor,
          backgroundPosition:'right',
          borderRadius:'8px'
        },
        customItem: {
          // marginTop: '-5px'
        }
      }
    },
    created () {
      // GetUserInfo().then(resp=>{
      //   if (Object.keys(this.config).length > 0) {
      //     this.getData(resp.data)
      //   }
      // })
      if (Object.keys(this.config).length > 0) {
        this.getData()
      }
    },
    mounted () {

    },
    destroyed () {
    },
    methods: {
      getData () {
        var requestParams = {
          url: this.config.interUrl,
          method: this.config.requestType,
          showError: false,
          headers: {
            'Content-Type': 'application/json',
            'ContentType': 'application/json',//dsg使用contentType不是标准的header字段，所以添加这个，如果访问其他网站接口有可能会被跨域拦截
            'token':this.config.interToken    //新版本添加token字段
          },
          data:{},
          timeout: 20000, // request timeout
        }


        let rp = JSON.parse(this.config.requestParams)

        let arr = Object.keys(rp);
        if(arr.length >0){
          for(var key in rp){
            //  rp[key] === 'param_userNum' ? this.$store.state.user.userNum : rp[key]
            if( rp[key] === 'param_userNum'){
              rp[key] = this.$store.state.user.userNum
            }
          }
        }


        //rp.userId = this.$store.state.user.userId
        rp.userNum = this.$store.state.user.userNum
        this.config.requestParams = JSON.stringify(rp)

        console.log(this.config.requestParams)

        this.config.requestType.toLowerCase() === 'get' ? (requestParams.params = JSON.parse(this.config.requestParams)) : (requestParams.data = JSON.parse(this.config.requestParams))

        // axios(requestParams)

        axios(requestParams).then(resp => {
          try {
            this.structContent(resp.data)
          } catch (e) {
            //this.$alert(e, '错误提示', { type: 'error' })
            console.log(e)
          }
        }).catch(error => {
          if (typeof error == 'string') {
            //this.$alert(error, '错误提示', { type: 'error' })
            console.log(error)
          } else {
            // this.$alert('请求失败，请检查接口URL、请求类型和请求参数', '错误提示', { type: 'error' })
            console.log('接口请求失败，请检查接口URL、请求类型和请求参数');
          }
        })
      },
      /**
       * 通过模板（expression）和返回数据构建html
       * @param data
       */
      structContent (data) {
        this.content = RenderByConfig.structExpression(data, this.config.expression)
      },
    }
  }
</script>

<style scoped lang="stylus">
  .content {
    display flex
    word-break break-all;
    align-items center
    justify-content center
    line-height 22px
    overflow hidden
    height 100%
    /*height 128px*/
    /*height calc(100% - 18px)*/
    /*width 272px*/
    text-align left
    vertical-align top
    color #ffffff
    padding-left: 20px

    justify-content flex-start
    align-items center
    div.expression {

    }
  }


</style>
