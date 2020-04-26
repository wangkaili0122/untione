/**
 * 根据字典自动渲染组件的混入方法
 */
export default {
  props: {
    value: {},
    dictType: {
      required: true,
      type: String
    },
    exclude: {
      required: false,
      type: Array,
      default () {
        return []//例子：[{dictValue:0},{dictValue:1}]
      }
    }
  },
  data () {
    return {
      dictData: this.$store.getters['dict/getDictType'](this.dictType).filter(dict => {
        return !this.exclude.find(item => item.dictValue.toString() === dict.dictValue.toString())
      })
    }
  },
  methods: {},
  computed: {
    model: {
      get () {
        return this.value
      },
      set (val) {
        this.$emit('change', val)
      }
    },
    getDictData(){
      return this.$store.state.dict.dicts
    }
  },
  watch: {
    getDictData(val){
      this.dictData = this.$store.getters['dict/getDictType'](this.dictType).filter(dict => {
        return !this.exclude.find(item => item.dictValue.toString() === dict.dictValue.toString())
      })
    }
  }
}
