<!--
/**
  * 表格检索组件，提供是否显示该组件和检索表格的功能，方便其他模块调用
  * @desc 组件描述
  * @author 21086
  * @data 2020/4/26
  * @example 调用示例
  <table-filter-form
          :search-show='searchShow'
          :search-fields='searchFields'
          :form-inline='formInline'
          @filter-table='filterTable'>
   <table-filter-form>
  */
-->
<template>
  <transition name="el-zoom-in-top">
    <el-form v-show="searchShow" v-if="searchFields.length>0" :inline="true" :model="formInlineData" class="form-inline" size="mini" @submit.native.prevent>
      <el-form-item v-for="item in searchFields" :label="item.label" class="filter-item-margin">
        <el-input v-if="item.type === 'input'"
                  v-model="formInlineData[item.fieldName]"
                  :placeholder="item.placeholder"
                  clearable
                  :prefix-icon="item.prefixIcon"
                  :suffix-icon="item.suffixIcon"
                  @input="handleInputChange" ></el-input>
        <el-select v-if="item.type === 'select'" v-model="formInlineData[item.fieldName]"
                   :placeholder="item.placeholder"
                   filterable clearable
                   @change="handleSelectChange">
          <el-option
            v-for="option in item.options"
            :key="option.value"
            :label="option.name"
            :value="option.value">
          </el-option>
        </el-select>
        <!-- 需要从字典中取数据的下拉框 -->
        <dict-select v-if="item.type === 'dictSelect'"
                     :dict-type="item.dictType"
                     v-model="formInlineData[item.fieldName]"
                     :placeholder="item.placeholder"
                     filterable clearable
                     @change="handleSelectChange">
        </dict-select>
        <el-date-picker
          v-if="item.type === 'date'"
          v-model="formInlineData[item.fieldName]"
          type="datetimerange"
          align="right"
          unlink-panels
          :default-time="['00:00:00', '23:59:59']"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :picker-options="item.options"
          @change="handleDateChange">
        </el-date-picker>
      </el-form-item>
      <slot></slot>
    </el-form>
  </transition>
</template>
<script>
  import debounce from 'utils/debounce.js'
  import DictSelect from 'components/form-input/dict-select'
  export default {
    name: 'table-filter-form',
    components: { DictSelect },
    props: {
      // 是否显示组件
      searchShow: {
        type: Boolean,
        default () {
          return true
        }
      },
      // 搜索表单中显示的字段配置列表, searchFields是一个一维数组，表示表单需要展示多少个
      // searchFields = [
      //   [
      //     { type: 'Form类型', label: '字段标签/中文名', prop: '验证规则字段名', fieldName: '属性字段' },
      //     { type: 'Form类型', label: '字段标签/中文名', prop: '验证规则字段名', fieldName: '属性字段' }
      //   ],
      //   [
      //     { type: 'Form类型', label: '字段标签/中文名', prop: '验证规则字段名', fieldName: '属性字段' },
      //   ],
      //   ......
      // ],
      // 组件功能配置
      searchFields: {
        required: true,
        type: Array,
        default () {
          return []
        }
      },
      // 检索条件
      formInline: {
        type: Object,
        default () {
          return {}
        }
      }
    },
    data () {
      return {
        formInlineData: JSON.parse(JSON.stringify(this.formInline))// el-form中绑定的数据
      }
    },
    methods: {
      handleInputChange () {
        // 防止每次输入都会触发查询事件，最后焦点离开输入框时查询
        debounce(() => {
          this.$emit('filter-table', this.formInlineData)//重新调接口查询
        }, 500)()
      },
      handleSelectChange () {
        this.$emit('filter-table', this.formInlineData)
      },
      handleDateChange () {
        // TODO 时间选择框起始时间可结束时间字段与后台匹配及数据格式处理
        this.$emit('filter-table', this.formInlineData)
      }
    }
  }
</script>
<style>

</style>
