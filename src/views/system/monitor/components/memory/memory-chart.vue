<!--
 /**
  * 服务监控-磁盘状态
  * @desc 组件描述
  * @example 调用示例
  */
-->
<template>
  <div :class="className" :style="{height:height,width:width}"></div>
</template>

<script>
  import resize from 'mixins/resize';
  //引入基本模板
  const echarts = require('echarts/lib/echarts')
  import 'echarts-liquidfill';
  require('echarts/theme/macarons'); // echarts theme
  const backgroundStyleColor = ['rgba(54, 149, 208, 0.1)', 'rgba(255,152,0,0.1)', 'rgba(255,0,0,0.1)']
  const itemShadowColor = ['#3695d0', '#ff9800', '#f60']
  const colorList = [
    ['rgba(54, 149, 208, 0.5)', 'rgba(54, 149, 208, 0.5)', 'rgba(54, 149, 208, 0.5)', 'rgba(54, 149, 208, 0.5)'],
    ['rgba(255,152,0,0.5)', 'rgba(255,152,0,0.5)', 'rgba(255,152,0,0.5)', 'rgba(255,152,0,0.5)'],
    [ 'rgba(255,0,0,0.5)', 'rgba(255,0,0,0.5)', 'rgba(255,0,0,0.5)', 'rgba(255,0,0,0.5)']
  ]
  export default {
    name: 'memory-chart',
    mixins: [resize],
    props: {
      className: {
        type: String,
        default: 'chart'
      },
      width: {
        type: String,
        default: '100%'
      },
      height: {
        type: String,
        default: '400px'
      },
      chartOptionData: {
        type: Object,
        required: true,
        default: () => {}
      }
    },
    data() {
      return {
        chart: null,
        // chartData: {
        //   optionData: {}
        // },
        time: null
      };
    },
    computed: {
      chartData() {
        let Obj = {}
        if (this.chartOptionData.usage) {
          // let total =  parseFloat(((this.chartOptionData.sys + this.chartOptionData.used)/100).toFixed(4))
          let total =  this.chartOptionData.usage*100/10000
          var dataObj = {
            seriesData: [{
              name: '内存利用率',
              value: total
            },total, total,total],
            category: []
          };
          Obj.optionData = dataObj;
        } else {
          Obj.optionData = {};
        }
        return Obj
      }
    },
    mounted () {
      this.initChart();
    },
    beforeDestroy () {
      if (!this.chart) {
        return;
      }
      this.chart.dispose()
      this.chart = null;
    },
    watch: {
      chartData: {
        deep: true,
        handler (val) {
          this.setOptions(val);
        }
      }
    },
    methods: {
      setOptions ({optionData} = {}) {
        if (optionData.seriesData) {
          this.chart.setOption({
            grid: {
              top: '20%',
              left: '4%',
              right: '2%',
              bottom: '3%',
              containLabel: true
            },
            series: [{
              type: 'liquidFill',//类型
              name: '内存利用率',
              data: this.chartData.optionData.seriesData,//数据是个数组 数组的每一项的值是0-1
              label: {
                normal: {
                  formatter: function(param) {
                    var text = [
                      '{a|'+ (param.value*10000/100).toFixed(2) +'%' + '}',
                      '{x|' + param.seriesName + '}'
                    ].join('\n')
                    return text
                  },
                  rich: {
                    a: {
                      fontSize: 24,
                      fontWeight:'bold',
                      lineHeight: 40
                    },
                    x: {
                      fontSize: 14,
                      fontFamily: 'Microsoft YaHei',
                      height: 20
                    }
                  }
                }
              },
              outline: {
                //show: true , //是否显示轮廓 布尔值
                borderDistance: 0, //外部轮廓与图表的距离 数字
                itemStyle:{
                  //borderColor:'rgba(255,0,0,0.09)', //边框的颜色
                  borderWidth: 0,  //边框的宽度
                  //shadowBlur: 5 , //外部轮廓的阴影范围 一旦设置了内外都有阴影
                  //shadowColor: '#000' //外部轮廓的阴影颜色
                }
              },
              backgroundStyle: {
                color: optionData.seriesData[0].value< 0.6 ? backgroundStyleColor[0] : (optionData.seriesData[0].value< 0.9 ? backgroundStyleColor[1]: backgroundStyleColor[2]),//图表的背景颜色
                //borderWidth: '10',//图表的边框宽度
                //borderColor: '#000',//图表的边框颜色
                itemStyle: {
                  shadowBlur:100,//设置无用
                  shadowColor: '#f60',//设置无用
                  opacity: 1 //设置无用
                }
              },
              itemStyle: {
                opacity:0.5,//波浪的透明度
                shadowBlur: 10,//波浪的阴影范围
                shadowColor:optionData.seriesData[0].value< 0.6 ? itemShadowColor[0] : (optionData.seriesData[0].value< 0.9 ? itemShadowColor[1]: itemShadowColor[2])//阴影颜色
              },
              emphasis:{
                itemStyle: {
                  opacity :1 //鼠标经过波浪颜色的透明度
                }
              },
              color: optionData.seriesData[0].value< 0.6 ? colorList[0] : (optionData.seriesData[0].value< 0.9 ? colorList[1]: colorList[2]),//水波的颜色 对应的是data里面值
              shape: 'circle',//水填充图的形状 circle默认圆形  rect圆角矩形  triangle三角形  diamond菱形  pin水滴状 arrow箭头状  还可以是svg的path
              center: ['50%','50%'],//图表相对于盒子的位置 第一个是水平的位置 第二个是垂直的值 默认是[50%,50%]是在水平和垂直方向居中 可以设置百分比 也可以设置具体值
              radius: '70%', //图表的大小 值是圆的直径 可以是百分比 也可以是具体值 100%则占满整个盒子 默认是40%; 百分比下是根据宽高最小的一个为参照依据
              amplitude:4,   //振幅 是波浪的震荡幅度 可以取具体的值 也可以是百分比 百分比下是按图标的直径来算
              waveLength:'50%',//波的长度 可以是百分比也可以是具体的像素值  百分比下是相对于直径的 取得越大波浪的起伏越小
              phase:0 ,//波的相位弧度 默认情况下是自动
              period: (value,index)=>{//控制波的移动速度 可以是函数 也可以是数字 两个参数  value 是data数据里面的值 index 是data值的索引

                return index*2000;
              },
              direction: 'left',//波移动的速度 两个参数  left 从右往左 right 从左往右
              waveAnimation: true, //控制波动画的开关  值是布尔值 false 是关闭动画 true 是开启动画 也是默认值
              animationEasing: 'linear',//初始动画
              animationEasingUpdate: 'quarticInOut',//数据更新的动画效果
              animationDuration: 3000, //初始动画的时长，支持回调函数，可以通过每个数据返回不同的 delay 时间实现更绚丽的初始动画效果
              animationDurationUpdate : 300 //数据更新动画的时长

            }],
            //backgroundColor: 'rgba(255,0,0,0.1)'容器背景颜色
          })
        }
      },
      setSeriesData (val) {
        var seriesData = val.data;
        var seriesList = [];
        seriesData.map((item, index) => {
          var seriesObj = {
            name: '',
            center: index < 6 ? [(index * 17 + 8.5 + '%'), '20%'] : [(index % 6 * 17 + 8.5 + '%'), '70%'],
            radius: ['25%', '28%'],
            startAngle: 225,
            type: 'pie',
            labelLine: {
              normal: {
                show: false
              }
            },
            markPoint: {
              data: [{
                symbol: 'triangle',
                symbolSize: 15,
                symbolRotate: 0,
                itemStyle: {
                  normal: {
                    color: 'transparent'
                  }
                },
                name: '',
                value: item.name,
                x: index < 6 ? (index * 17 + 6 + '%') : (index % 6 * 17 + 6 + '%'),
                y: index < 6 ? '43%' : '93%',
                label: {
                  normal: {
                    show: true,
                    position: 'center',
                    formatter: function (params) {
                      return params.value;
                    },
                    textStyle: {
                      fontSize: '14',
                      color: '#666'
                      // color: colorData[index]
                    }
                  }
                }
              }]
            },
            markLine: {
              silent: true,
              symbolSize: 0,
              data: [{
                0: {
                  x: index < 6 ? (index * 17 + '%') : (index % 6 * 17 + '%'),
                  y: index < 6 ? '5%' : '50%',
                  lineStyle: {
                    normal: {
                      color: !!index ? '#ccc' : 'transparent',
                      width: 1,
                      type: 'solid'
                    }
                  }
                },
                1: {
                  x: index < 6 ? (index * 17 + '%') : (index % 6 * 17 + '%'),
                  y: index < 6 ? '50%' : '95%',
                  lineStyle: {
                    normal: {
                      color: !!index ? '#ccc' : 'transparent',
                      width: 1,
                      type: 'solid'
                    }
                  }
                }
              }]
            },
            data: [{
              value: item.value,
              name: item.name,
              itemStyle: {
                normal: {
                  color: colorData[index]
                  // shadowColor: colorData[index],
                  // shadowBlur: 5
                },
                emphasis: {
                  color: colorData[index]
                }
              },
              label: {
                normal: {
                  formatter: '{c}',
                  position: 'center',
                  show: true,
                  textStyle: {
                    fontSize: '16',
                    fontWeight: 'bold',
                    color: colorData[index]
                  }
                }
              }
            }, {
              value: item.value / 3,
              name: '',
              tooltip: {
                show: false
              },
              itemStyle: {
                normal: {
                  // color: '#aaa'
                  color: 'rgba(44,59,70,0.1)', // 未完成的圆环的颜色
                },
                emphasis: {
                  color: '#aaa'
                }
              },
              hoverAnimation: false
            }]
          };
          seriesList.push(seriesObj);
        });
        return seriesList;
      },
      // 自动播放tooltip
      autoPlay() {
        let _that = this;
        clearInterval(_that.time);
        let index = 0; // 播放所在下标
        if (_that.chart != null) {
          _that.time = setInterval(function () {
            _that.chart.dispatchAction({
              type: 'showTip',
              seriesIndex: 0,
              dataIndex: index
            });
            index++;
            if (index > _that.chartData.optionData.category.length) {
              index = 0;
            }
          }, 3000);
        }
      },
      initChart () {
        this.chart = echarts.init(this.$el, 'macarons');
        this.setOptions(this.chartData);
      }
    },
    destroyed () {
      clearInterval(this.time);
    }
  };
</script>
<style lang="stylus" scoped>
  .chart {
    width 100%
    height 100%
    display: flex;
    display: -webkit-flex;
    align-items: center;
    justify-content: center;
    .no-data {
      width 100px
      height 100px
      text-align: center;
      font-weight: bold;
      line-height: 140px;
      color: #666;
      background-size 100% 100%
      background-image: url("~@/assets/img/nodata.png")
      background-repeat no-repeat
    }
  }
</style>
