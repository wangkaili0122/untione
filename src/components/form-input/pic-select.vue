<!--
/**
  * @desc 组件描述
  * @author 21086
  * @data 2020/4/26
  * @example 调用示例
  * <pic-select></pic-select>
  */
-->
<template>
  <div style="display: inline-block">
    <div class="appIconContent">
      <img v-if="model && model.length>0" :src="model.indexOf('base64,')>=0?model:( $project.serverUrl +'/'+ model)"
           class="appIcon"/>
      <i v-else class="el-icon-plus appIcon appTop"></i>
    </div>
    <el-button type="success" @click="selectPic" size="small">本地上传图片</el-button>
    <input ref="imgUploadInput" @change="selectedPic" type="file"
           :accept="accept"
           style="width: 1px;visibility: hidden"/>
    <div class="icon-content" v-if="defaultIconShow">
      <div class="tip">可选择以下默认图片：</div>
      <div class="icon-img">
        <img v-for="(img, index) in iconImages" :key="index" :src="img.file" alt="" class="icon" @click="selectIcon(img)"/>
      </div>
    </div>
  </div>
</template>

<script>
  import iconImages from 'utils/fileRead.js';
  export default {
    name: 'pic-select',
    props: {
      value: {},
      picType: {
        type: Array,
        default() {
          return ['jpeg', 'jpg', 'png', 'ico']
        }
      },
      maxSize: {
        type: Number,
        default() {
          return 2097152
        }
      },
      maxWidthHeight: {//图片的最大宽度和高度，[宽度，高度],[0,0]是不限制尺寸
        type: Array,
        default() {
          return [0, 0]
        }
      },
      defaultIconShow: {
        type: Boolean,
        default() {
          return true
        }
      },
    },
    data() {
      return {
        iconImages: []
      }
    },
    created(){
      this.iconImages = iconImages;
      if(this.maxWidthHeight.length<2){
        console.error('maxWidthHeight传值错误，正确格式为[Number(宽),Number(高)]')
      }
    },
    methods: {
      selectPic: function () {
        this.$refs['imgUploadInput'].click()
      },
      selectedPic: function () {
        var file = this.$refs['imgUploadInput'].files[0]
        if(!file){
          return
        }
        var extension = file.name.split('.').slice(-1)[0].toLowerCase()
        if (this.pictypes.indexOf(extension) < 0) {
          var tip = '所选图片格式不正确，请选择' + this.picType.join('/') + '格式的图片！'
          this.$alert(tip, '错误', {type: 'error'})
          return
        }
        var reader = new FileReader()
        if (file) {
          // 将文件以Data URL形式读入页面
          var imgUrlBase64 = reader.readAsDataURL(file)
          reader.onload = (e) => {
            this.readed(e)
          }
        }
      },
      selectIcon (img) {
        this.model = img.file;
        this.$emit('input', img.file);
        this.$emit('change', img.file);
      },
      /**
       * 文件读取成功后的回调
       * @param e
       */
      readed(e){
        //如果maxwidthheight都是0，就是不限制宽度和高度
        if(this.maxWidthHeight.length===2 && this.maxWidthHeight[0]===0 && this.maxWidthHeight[1]===0){
          this.checkSize(e)
          return
        }
        //如果有宽高限制，亏先验证宽高，再验证大小
        let result = e.target.result
        let image=new Image()
        image.onload=(event )=>{
          try{
            let width = event.target.width;
            let height = event.target.height;
            let isAllow = width <= this.maxWidthHeight[0] && height <= this.maxWidthHeight[1];

            if(!isAllow){
              this.$alert(`请上传宽高小于${this.maxWidthHeight[0]}px*${this.maxWidthHeight[1]}px的图片！`, '错误', {type: 'error'})
            }else {
              this.checkSize(e)
            }

          }catch (exce) {
            console.error(exce)
          }
        }
        image.src=result
      },
      /**
       * 检查图片大小
       * @param e {}
       */
      checkSize(e){
        let result = e.target.result
        if (this.maxSize != 0 && this.maxSize < result.length) {
          // 上传图片最大值(单位字节)（ 2 M = 2097152 B ）超过2M上传失败

          let message = ''
          if (this.maxSize < 1048576) {
            message = (this.maxSize / 1024).toFixed(2) + 'K'
          } else {
            message = (this.maxSize / (1024 * 1024)).toFixed(2) + 'M'
          }
          this.$alert(`上传失败，请上传不大于${message}的图片！`, '错误', {type: 'error'})
        } else {
          // 把base64赋值给变量
          this.$emit('input', result)
          this.$emit('change', result)

          this.$forceUpdate()
        }
      }
    },
    computed: {
      model: {
        get() {
          return this.value
        },
        set(val) {
          this.$emit('input', val)
          this.$emit('change', val)
        }
      },
      accept() {
        return this.picType.map(t => '.' + t.replace('.', '')).join(',')
      },
      pictypes() {
        return this.picType.map(t => t.replace('.', ''))
      }
    },
    watch: {
      'value': function (newVal, oldVal) {
        try {
          var obj = this.$refs['imgUploadInput']
          obj.select()
          if (document.selection && document.selection.clear) {
            document.selection.clear()
          }
          obj.value=''
        } catch (e) {
          console.error(e)
        }
      }
    }
  }
</script>

<style scoped lang="stylus">
  .appIconContent {
    border 1px dashed #c0ccda
    background-color #fbfdff
    border-radius 5px
    display inline-block
    width 50px
    height 50px
    text-align center
    vertical-align middle
    margin-right 50px
    .appIcon {
      width 50px
      height 50px
    }
    .appTop {
      padding-top: 18px
    }
  }
  .icon-content{
    margin-top: 10px;
    padding: 0 20px;
    border: 1px dashed #c0ccda;
    max-height: 168px;
    overflow: auto;
    .tip{
      line-height: 30px;
      font-size: 12px;
      color: #ff310f;
    }
    .icon-img {
      line-height: 34px;
      .icon{
        width: 34px;
        margin-right: 6px;
        cursor: pointer;
      }
    }
  }
</style>
