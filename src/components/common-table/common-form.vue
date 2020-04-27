<!--
/**
 * 通用列表配套的通用表单，通过传入表单配置项自动构建表单
 */
 -->
<!--<template>
  <div>
    <el-form :model="formData" :rules="rules" ref="form" :label-width="labelWidth+'px'" :disabled="optType==='view'">
      &lt;!&ndash;<el-form-item v-for="(field,index) in fields" :key="index" :label="field.label" :prop="field.prop">&ndash;&gt;
      &lt;!&ndash;<el-input v-model="formData[field.fieldName]"></el-input>&ndash;&gt;
      &lt;!&ndash;</el-form-item>&ndash;&gt;
      <template v-for="(elementFields,i) in fields" :key="i">
        <el-form-item v-if="field.type === 'text'" :label="field.label">
          <span>{{formData[field.fieldName]}}</span>
        </el-form-item>
        <el-form-item v-else :label="field.label" :prop="field.prop">
          <template v-if="field.type === 'radio'">
            <el-radio-group v-model="formData[field.fieldName]">
              <el-radio
                v-for="(item,index) in field.options"
                :key="index"
                :label="item.value">
                {{item.name}}
              </el-radio>
            </el-radio-group>
          </template>
          <template v-if="field.type === 'input'">
            <el-input v-model="formData[field.fieldName]" size="small" clearable class="dialog-input-width"></el-input>
          </template>
          <template v-if="field.type === 'textarea'">
            <el-input type="textarea" :rows="field.rows" v-model="formData[field.fieldName]" size="small"
                      class="dialog-input-width"></el-input>
          </template>
          <template v-if="field.type === 'select'">
            <el-select v-model="formData[field.fieldName]"
                       :multiple="field.multiple"
                       filterable clearable
                       size="small"
                       class="dialog-input-width"
                       @change="handleSelectChange"
            >
              <el-option
                v-for="(item,index) in field.options"
                :key="item.value"
                :label="item.name"
                :value="item.value">
              </el-option>
            </el-select>
          </template>
          <template v-if="field.type === 'checkbox'">
            <el-checkbox-group v-model="formData[field.fieldName]">
              <el-checkbox v-for="(item,index) in field.options" :label="item.value" :key="index">{{item.name}}
              </el-checkbox>
            </el-checkbox-group>
          </template>
        </el-form-item>
      </template>
    </el-form>
  </div>
</template>-->

<script>
  import commonFormMixins from 'mixins/common-form.js'
  import dictRadio from 'components/form-input/dict-radio'
  import dictCheckbox from 'components/form-input/dict-checkbox'
  import dictSelect from 'components/form-input/dict-select'
  import picSelect from 'components/form-input/pic-select'

  import { merge } from 'lodash'
  export default {
    name: 'common-form',
    mixins: [commonFormMixins],
    components: { dictRadio, dictCheckbox, dictSelect, picSelect },
    props: {},
    data () {
      return {}
    },
    inject: ['formOpt'],
    render (createElement) {
      return createElement('el-form',
        {
          ref: 'form',
          props: {
            model: this.formData,
            rules: this.rules,
            disabled: (this.optType ? this.optType : this.tableOptType) === 'view',
            labelWidth: this.labelWidth + 'px'
          }
        },
        this.structForm(createElement))
    },
    created(){
      console.log('tb opt',this.formOpt)
    },
    methods: {
      handleSelectChange (val) {
        console.log(val)
      },
      structForm (createElement) {
        return this.fields.map(field => {
          let vdom = null
          switch (field.type) {
            case 'input':
              vdom = this.renderInput(field)
              break
            case 'radio':
              vdom = this.renderRadio(field)
              break
            case 'checkbox':
              vdom = this.renderCheckbox(field)
              break
            case 'select':
              vdom = this.renderSelect(field)
              break
            case 'component':
              vdom = this.renderCustormComponent(field)
              break
            default:
              break
          }
          return createElement('el-form-item',
            {
              props: {
                label: field.label, prop: field.prop
              }
            },
            [vdom])
        })
      },
      renderCheckbox (data) {
        var self = this
        return this.$createElement('el-checkbox-group',
          merge(data.data || {}, {
            domProps: {
              value: self.formData[data.fieldName]
            },
            on: {
              change: function (val) {
                self.$emit('change', val)
              }
            }
          }),
          [
            data.options.map(item => {
              return self.$createElement('el-checkbox', { props: { label: item.value, key: item.value } }, item.label)
            })
          ])
      },
      renderRadio (data) {
        var self = this
        return this.$createElement('el-radio-group',
          merge(data.data || {}, {
            domProps: {
              value: self.formData[data.fieldName]
            },
            on: {
              change: function (val) {
                self.$emit('change', val)
              }
            }
          }),
          [
            data.options.map(item => {
              return self.$createElement('el-radio', { props: { label: item.value, key: item.value } }, item.label)
            })
          ])
      },
      renderInput (data) {
        var self = this
        return this.$createElement('el-input',
          merge(data.data || {}, {
            props: {
              value: self.formData[data.fieldName]
            },
            on: {
              input: function (val) {
                self.$emit('input', val)
                self.$set(self.formData, data.fieldName, val)
              }
            }
          }),
          []
        )
      },
      renderSelect (data) {
        var self = this
        return this.$createElement('el-select',
          merge(data.data || {}, {
            domProps: {
              value: self.formData[data.fieldName]
            },
            on: {
              change: function (val) {
                self.$emit('change', val)
              }
            }
          }),
          [
            data.options.map(item => {
              return self.$createElement('el-radio', {
                props: {
                  value: item.value,
                  label: item.label,
                  key: item.value
                }
              }, [])
            })
          ])
      },
      renderCustormComponent (data) {
        var self = this

        var on = {}
        on[data.eventName || 'change'] = function (val) {
          if (val !== undefined && val !== null) {
            self.$set(self.formData, data.fieldName, val)
            // self.$emit(data.eventName || 'change', val)
          }
        }
        return this.$createElement(data.componentName,
          merge(data.data ? JSON.parse(JSON.stringify(data.data)) : {},
            {
              props: {
                value: self.formData[data.fieldName]
              },
              on: on
            }
          ),
          []
        )
      }
    },
    computed: {
      tableOptType () {
        return this.formOpt
      }
    },
    watch: {
      'formData': function (newVal) {
        console.log('formData', newVal)
      },
      'formOpt': function (newVal) {
        console.log('formOpt', newVal)
      },
      'optType':function (v) {
        console.log('optType', v)
      }
    }
  }
</script>

<style>

</style>
