<template>
  <div class="validCode" :class="validCodeClass" @click="changeCode" :style="{cursor:clickChange?'pointer':'default'}" :title="clickChange?'点击更换验证码':''">
    <canvas ref="validCode"  id="validCode" :width="width" :height="height"></canvas>
  </div>
</template>

<script>
  export default {
    name: 'verify-code',
    props: {
      identifyCode: {
        type: String,
        default: '1234'
      },
      type: {
        type: String,
        default () {
          return 'blend'
        }
      },
      height: {
        type: Number,
        default () {
          return 38
        }
      },
      width: {
        type: Number,
        default () {
          return 100
        }
      },
      backgroundColor: {
        type: String,
        default () {
          return 'rgb(255,255,255)'
        }
      },
      clickChange: {
        type: Boolean,
        default () {
          return false
        }
      },
      validCodeClass: {
        type: String,
        default () {
          return ''
        }
      }
    },
    data () {
      return {
        code: '',
        numArr: '0123456789'.split(''),
        letterArr: 'abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNOPQRSTUVWXYZ'.split('')
      }
    },
    created () {
    },
    mounted () {
      var canvas = this.$refs['validCode']
      canvas.width = this.width
      canvas.height = this.height
      canvas.innerHTML = '您的浏览器版本不支持canvas'
      this.refresh()
    },
    methods: {
      /**
       * 刷新验证码
       */
      refresh: function () {
        this.code = ''
        if (this.$refs['validCode'].getContext) {
          var ctx = this.$refs['validCode'].getContext('2d')
        } else {
          return
        }
        ctx.textBaseline = 'middle'
        // 刷验证码图片底色，
        ctx.fillStyle = 'rgb(255,255,255)'// this._randomColor(180, 240);
        ctx.fillRect(0, 0, this.width, this.height)
        if (this.type === 'blend') {
          var txtArr = this.numArr.concat(this.letterArr)
        } else if (this.type === 'number') {
          var txtArr = this.numArr
        } else {
          var txtArr = this.letterArr
        }
        for (var i = 1; i <= 4; i++) {
          var txt = txtArr[this._randomNum(0, txtArr.length)]
          this.code += txt
          ctx.font = this._randomNum(this.height * 3 / 4, this.height) + 'px SimHei'
          ctx.fillStyle = this._randomColor(50, 160)
          ctx.shadowOffsetX = this._randomNum(-3, 3)
          ctx.shadowOffsetY = this._randomNum(-3, 3)
          ctx.shadowBlur = this._randomNum(-3, 3)
          ctx.shadowColor = 'rgba(0, 0, 0, 0.3)'
          var x = this.width / 5 * i
          var y = this.height / 2
          var deg = this._randomNum(-30, 30)
          ctx.translate(x, y)
          ctx.rotate(deg * Math.PI / 180)
          ctx.fillText(txt, 0, 0)
          ctx.rotate(-deg * Math.PI / 180)
          ctx.translate(-x, -y)
        }
        // 绘制干扰线
        for (var i = 0; i < 1; i++) {
          ctx.strokeStyle = this._randomColor(40, 180)
          ctx.beginPath()
          ctx.moveTo(this._randomNum(0, this.width), this._randomNum(0, this.height))
          ctx.lineTo(this._randomNum(0, this.width), this._randomNum(0, this.height))
          ctx.stroke()
        }
        for (var i = 0; i < this.width / 4; i++) {
          ctx.fillStyle = this._randomColor(0, 255)
          ctx.beginPath()
          ctx.arc(this._randomNum(0, this.width), this._randomNum(0, this.height), 1, 0, 2 * Math.PI)
          ctx.fill()
        }
      },
      /**
       * 验证输入的验证码是否正确
       * @param {String} code
       * @returns {boolean}
       */
      validate: function (code) {
        var inCode = code.toLowerCase()
        var v_code = this.code.toLowerCase()
        if (inCode === v_code) {
          return true
        } else {
          // this.refresh();
          return false
        }
      },
      /**
       * 更新验证码
       */
      changeCode () {
        if (this.clickChange) {
          this.refresh()
        }
      },
      _randomNum (min, max) {
        return Math.floor(Math.random() * (max - min) + min)
      },
      _randomColor (min, max) {
        var r = this._randomNum(min, max)
        var g = this._randomNum(min, max)
        var b = this._randomNum(min, max)
        return 'rgb(' + r + ',' + g + ',' + b + ')'
      }
    }
  }
</script>

<style scoped>

</style>
