<!--
/**
  * @desc 组件描述
  * 层级结构的checkbox组件
  * @desc 层级结构的checkbox组件
  * @author 21086
  * @data 2020/4/26
  * @example 调用示例
  *  <tree-checkbox :data="treeCheckData" v-model="selectValue"></tree-checkbox>
      * treeCheckData= [
        { label: '系统管理', 'value': 'sys_management',
        children: [
        { label: '用户管理', value: 'sys_user' },
        { label: '角色管理', value: 'sys_role' }
        ]}]
        selectValue=['sys_management']
  */
-->
<template>
  <div class="base-container">
    <template v-for="(item,index) in treeData" >
      <template v-if="item[childrenKey]">
        <div :key="index" class="tc-container">
          <div class="father-container">
            <!--显示当前节点的checkbox-->
            <el-checkbox :label="item[valueKey]" v-model="checked[item[valueKey]]" @change="checkHandle(item[valueKey],$event,true,item)" :key="index">{{item[labelKey]}}</el-checkbox>
          </div>
          <div class="children-container">
            <div class="tc-container">
              <tree-checkbox :data="item[childrenKey]" :value="value"  :children-key="childrenKey" :label-key="labelKey" :value-key="valueKey" @checked-change="childrenChangeHandle"></tree-checkbox>
            </div>
          </div>
        </div>
      </template>
      <template v-else>
        <el-checkbox :label="item[valueKey]" v-model="checked[item[valueKey]]" @change="checkHandle(item[valueKey],$event,false,item)" :key="index" >{{item[labelKey]}}</el-checkbox>
      </template>
    </template>
  </div>
</template>

<script>
  // todo 添加配置项，决定是否自动选中父节点以及是否自动选中子节点
  import recursion from 'utils/recursion'
  export default {
    name: 'tree-checkbox',
    props: {
      data: {
        required: true,
        type: Array
      },
      value: {
        required: false,
        default () {
          return []
        }
      },
      childrenKey: {// 自定义子节点key
        type: String,
        default () { return 'children' }
      },
      valueKey: {// 自定义value的key
        type: String,
        default () { return 'value' }
      },
      labelKey: {// 自定义label的key
        type: String,
        default () { return 'label' }
      },
      autoCheckFather: {// 是否自动选中父节点和祖先节点
        type: Boolean,
        default () {
          return true
        }
      },
      autoCheckChildren: {// 是否自动选中子节点和后代节点
        type: Boolean,
        default () {
          return true
        }
      }
    },
    data () {
      var dt = {
        checked: {}
      }
      if (this.value) {
        this.value.forEach(key => {
          dt.checked[key] = true
        })
      }
      return dt
    },
    created () {
    },
    mounted () {
    },
    model: {
      prop: 'value',
      event: 'change'
    },
    methods: {
      /**
       * 选中或取消选中的处理事件
       * @param checkboxKey 选择的菜单/按钮的 menuId
       * @param val true/false 节点是否选中
       * @param isParent true/false  该节点是否为父节点
       * @param nodeData 节点数据 即菜单或按钮的数据
       */
      checkHandle (checkboxKey, val, isParent, nodeData) {
        // 如果当前节点有子节点并且配置允许自动选中子节点，就选中所有子节点
        if (isParent && this.autoCheckChildren) {
          // 自动选中所有子节点,递归子节点，把所有节点的key添加到this.checked里面
          var list = recursion.recursionAll(nodeData[this.childrenKey], this.childrenKey, () => true)
          // console.log(list)
          list.forEach(item => {
            this.$set(this.checked, item[this.valueKey], val)
          })
        }

        this.$forceUpdate()
        // 触发选择变化事件给父组件，checked-change是向递归的父组件传递变化的，change是向外围组件传递变化修改v-model值的
        this.$emit('checked-change', this.checked)
        // 触发change，可以修改props里面的value，允许调用该组件的时候使用v-model绑定数据
        this.$emit('change', Object.keys(this.checked).filter(item => { return this.checked[item] }))
      },
      // 获取已选择的checkbox列表
      getChecked () {
        var list = []
        Object.keys(this.checked).forEach(key => {
          if (this.checked[key]) {
            list.push(key)
          }
        })
      },
      // 侦听子组件选择项的变化
      childrenChangeHandle (checkedObj) {
        // 把子组件选择的菜单ID合并到当前组件的已选择ID里面
        Object.keys(checkedObj).forEach(key => {
          this.$set(this.checked, key, checkedObj[key])
        })

        // 如果允许自动选中父节点，就选中父节点吧
        if (this.autoCheckFather) {
          // 接收到子节点的选择变化事件后， 自动选中所有父节点,可以使用recursion寻找符合条件的父节点
          Object.keys(checkedObj).forEach(key => {
            if (checkedObj[key]) {
              var parent = recursion.recursion(this.treeData, this.childrenKey, (item) => {
                return item[this.childrenKey] && item[this.childrenKey].find(it => it[this.valueKey] == key)
              })
              if (parent) {
                this.$set(this.checked, parent[this.valueKey], true)
              }
            }
          })
        } else {

        }

        // 触发选择变化事件给父组件
        this.$emit('checked-change', this.checked)
        // 触发根组件的change事件，改变v-model绑定进来的值
        this.$emit('change', Object.keys(this.checked).filter(item => { return this.checked[item] }))
      },
      // 外部传入的value变化后重新设置所有checkbox为非选中
      resetChecked () {
        Object.keys(this.checked).forEach(key => {
          this.checked[key] = false
        })
      }
    },
    computed: {
      treeData: function () {
        return JSON.parse(JSON.stringify(this.data))
      }
    },
    watch: {
      'data': function (newVal, oldVal) {
      },
      // 侦听当前选中项的变化后，取消所有选中项然后重新选择
      'value': function (newVal, oldVal) {
        this.resetChecked()
        if (!newVal) {
          return
        }
        newVal.forEach(key => {
          this.$set(this.checked, key, true)
        })
        this.$forceUpdate()
      }
    }
  }
</script>

<style scoped lang="stylus">
  .base-container{
    border-bottom 1px solid #d5d5d5
    border-top 1px solid #d5d5d5
    .base-container{
      border none
    }
  }
  .base-container{
    width 100%
    >.tc-container:last-child{
      border-bottom none
    }
    .el-checkbox{
      margin-right 0px
      margin-left 10px
    }
    label+div.tc-container{
      border-top 1px solid #d5d5d5
    }
    .tc-container{
      display flex
      flex-direction row
      width 100%
      border-bottom 1px solid #d5d5d5
      >.children-container{
        >:last-child{
          border-bottom none
        }
      }
      .father-container{
        width 140px
        vertical-align middle
        align-self center
      }
      .children-container{
        width 150px
        flex-grow 1
        border-left 1px solid #d5d5d5
      }
    }
  }
</style>
<style lang="stylus">
  .base-container{
    .father-container{
      .el-checkbox{
        .el-checkbox__label{
          white-space normal
          width 110px
          box-sizing border-box
        }
      }
    }
  }

</style>
