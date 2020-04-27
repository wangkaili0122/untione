<!--
     /**
      * 根据配置文件自动渲染内容
      * @desc 组件描述
      * @example 调用示例
      *  <custom-component></custom-component>
      */
       -->
<template>
  <div class="CustomConfig">
    <!--header-->
    <div class="work-item-title">
      <div class="headline">
        <i class="iconfont icon-yonghuguanli headline-icon"></i>
        <span>个人自助</span>
      </div>
    </div>
    <!--内容-->
    <div class="CustomConfig_content">
      <div class="nomessage" v-if="config.length===0">
        暂无数据，请联系管理员进行处理
      </div>
      <template v-else>
        <div class="CustomConfig_Item" v-for="(item,index) in config" :key="index">
          <custom-component-item :config="item" :bgColor="bgs[index].bgColor" :bg="bgs[index].bgImage"></custom-component-item>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
  import CustomComponentItem from './custom-component-item'
  import { GetInters } from 'request/services/customComponent'
  import balance from '../../../../public/img/customInfo/balance.png'
  import bookcount from '../../../../public/img/customInfo/bookcount.png'
  import overtime from '../../../../public/img/customInfo/overtime.png'

  export default {
    name: 'custom-component',
    components: { CustomComponentItem },
    props: {
      configs: {
        required: false,
        default () {
          return [
            {
              componentName: 'test1',
            }, {
              componentName: 'test2',
            }, {
              componentName: 'test3',
            }
          ]
        }
      }
    },
    data () {
      return {
        config: [],
        bgs: [
          { bgColor: '#56abfa', bgImage: balance }, { bgColor: '#fc9441', bgImage: bookcount }, { bgColor: '#33d59b', bgImage: overtime }
        ]
      }
    },
    created () {
      this.getCustomConfig()
    },
    mounted () {

    },
    methods: {
      getCustomConfig () {
        //  发送请求
        GetInters({ size: 100, current: 0 }).then(resp => {
          this.config = resp.data.list
        })
      }
    },
    computed: {
      span () {
        return parseInt(100 / this.configs.length)
      }
    }
  }
</script>

<style scoped lang="stylus">
  .CustomConfig {
    height 100%
    .CustomConfig_content {
      display flex
      flex-direction row
      justify-content center
      justify-items center
      height calc(100% - 40px)
      .nomessage {
        display flex
        align-items center
        justify-content center
        color #ccc
      }
      .CustomConfig_Item {
        flex-grow 1
        min-width 10px
        justify-self center
        width 0
        padding 5px 8px
        align-self center
        height 100%
        box-sizing border-box
        @media screen and (min-width: 1860px){
          padding 25px 10px
        }
        @media screen and (max-width: 1860px){
          padding 15px 10px
        }
      }
    }

    .work-item-title {
      height: 40px;
      line-height: 40px;
      padding: 0 20px;
      display: flex;
      justify-content: space-between;
      .headline {
        .headline-icon {
          padding-right: 8px;
          color: #409EFF;
          font-size: 18px;
        }
      }
      .ellipsis {
        padding: 0 10px;
        color: #bbb;
        font-size: 20px;
      }
      .ellipsis:hover {
        color: #409EFF;
        cursor: pointer;
      }
    }
  }
</style>
