<!--
 /**
  * 应用审计-周应用访问趋势
  * @desc 组件描述
  * @date 2019/06/19
  */
-->
<template>
  <div :class="className" :style="{height:height,width:width}" v-html="rawHtml"></div>
</template>

<script>
  import resize from 'mixins/resize';
  //引入基本模板
  const echarts = require('echarts/lib/echarts')
  // 引入折线图等组件
  require('echarts/lib/chart/line')
  require('echarts/lib/chart/bar')
  // 引入提示框和title组件，图例
  require('echarts/lib/component/toolbox')
  require('echarts/lib/component/tooltip')
  require('echarts/lib/component/title')
  require('echarts/lib/component/legend')
  require('echarts/theme/macarons'); // echarts theme
  /*  import echarts from 'echarts';*/

  import { AppVisitTrend } from 'request/services/app-statistics'
  const colorList = ['#41a6f7','#3695d0','#ff9800', '#f60', '#E75CF3', '#4F82FF', '#12D2FF', '#29CC97', '#F55D90', '#ca8622', '#FEC400', '#bda29a', '#6e7074', '#546570', '#c4ccd3']
  var dataStyle = {
    normal: {
      label: {
        show: false
      },
      labelLine: {
        show: false
      }
    }
  };
  export default {
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
        default: '300px'
      },
      manageTypeId: {
        type: Number,
        default: null
      }
    },
    data() {
      return {
        chart: null,
        chartData: {
          optionData: {}
        },
        typeId: this.manageTypeId,
        rawHtml: null
      };
    },
    mounted() {
      this.getOptionData();
      // this.getData();
      this.initChart();
    },
    beforeDestroy() {
      if (!this.chart) {
        return;
      };
      this.chart.dispose();
      this.chart = null;
    },
    watch: {
      chartData: {
        deep: true,
        handler(val) {
          this.setOptions(val);
        }
      }
    },
    methods: {
      getData() {
        const resData = [
          {
            name: '2019-06-13',
            value: 1923
          },
          {
            name: '2019-06-14',
            value: 465
          },
          {
            name: '2019-06-15',
            value: 2783
          },
          {
            name: '2019-06-16',
            value: 354
          },
          {
            name: '2019-06-17',
            value: 3534
          },
          {
            name: '2019-06-18',
            value: 233
          },
          {
            name: '2019-06-19',
            value: 576
          }
        ]
        var dataObj = {
          seriesData: resData,
          category: resData.map(item => {
            return item.name
          })
        };
        this.chartData.optionData = dataObj;
      },
      getOptionData() {
        console.log("typeId====");
        console.log(this.typeId);
        AppVisitTrend(this.typeId).then(res => {
          var resData = res.data.data;
          if (resData && resData.length > 0) {
            var dataObj = {
              seriesData: resData,
              category: resData.map(item => {
                return item.name
              })
            };
            this.chartData.optionData = dataObj;
          } else {
            this.rawHtml = '<div id="app-type-nodata" style="text-align: center;font-weight: bold;line-height: 140px; color: #666">暂无数据</div>';
          }
        }).catch(error => {
          console.log("no data and 异常了")
          this.rawHtml = '<div id="app-type-nodata" style="text-align: center;font-weight: bold;line-height: 140px; color: #666">暂无数据</div>';
          console.log(response);
        });
      },
      ascInsertSort(arr){
        for(var i=1; i<arr.length;i++){
          if(arr[i].value > arr[i-1].value){
            var temp = arr[i];
            var j = i-1;
            arr[i] = arr[j];
            while(j>=0&&temp.value>arr[j].value){
              arr[j+1] = arr[j];
              j--;
            };
            arr[j+1] = temp;
          }
        }
        return arr
      },
      setOptions({optionData} = {}) {
        if (optionData.seriesData) {
          this.chart.setOption({
            toolbox: {
              right: '2%',
              itemSize: 12,
              feature: {
                dataView: {
                  show: true,
                  readOnly: true,
                  buttonColor: '#318FF3',
                  optionToContent: function (opt) {
                    var series = opt.series;
                    var seriesName = opt.series[0].data;
                    var tdHeaders = '<thead>' + '<th>指标</th>'; // 表头
                    seriesName.forEach(function (item) {
                      tdHeaders += '<th>' + item.name + '</th>'; // 组装表头
                    });
                    tdHeaders += '</thead>';
                    var table = '<div class="table-responsive"><table class="data-view-table" style="text-align:center"><tbody><tr>' + tdHeaders + '</tr>';
                    var tdBodys = ''; // 数据
                    for (let i = 0, l = series.length; i < l; i++) {
                      if(series[i].name) {
                        var seriesData = series[i].data;
                        for (let j = 0; j < seriesData.length; j++) {
                          tdBodys += '<td>' + seriesData[j].value + '</td>'; // 组装表数据
                        }
                        table += '<tr><td style="padding: 0 10px">' + series[i].name + '</td>' + tdBodys + '</tr>';
                        tdBodys = '';
                      }
                    }
                    table += '</tbody></table></div>';
                    return table;
                  },
                  // 在使用 optionToContent 的情况下，如果支持数据编辑后的刷新，需要自行通过该函数实现组装 option 的逻辑
                  contentToOption: function (option) {
                  }
                },
                magicType: {show: true, type: ['line', 'bar']},
                restore: {show: true},
                saveAsImage: {show: true}
              },
              iconStyle: {
                normal: {
                  borderColor: '#999'
                },
                emphasis: {
                  borderColor: '#179cff'
                }
              }
            },
            calculable: true,
            tooltip: {
              trigger: 'axis',
              axisPointer: {
                type: 'shadow',
                crossStyle: {
                  color: '#999'
                }
              }
            },
            legend: {
              show: false,
              orient: 'vertical',
              x: 'left',
              // itemGap: 30,
              itemWidth: 10,
              itemHeight: 10,
              textStyle: {
                color: '#666',
                fontSize: 14
              },
              // data: optionData.legendData
            },
            grid: {
              top: '15%',
              left: '3%',
              right: '3%',
              bottom: '3%',
              containLabel: true
            },
            yAxis: [
              {
                type: 'value',
                name: '（次）',
                nameTextStyle: {
                  color: '#999',
                  fontStyle: 'normal',
                  fontWeight: 'normal',
                  fontSize: 14
                },
                axisLine: {
                  show: false
                },
                axisLabel: {
                  color: '#999'
                },
                axisTick: {
                  show: false
                },
                splitLine: {
                  lineStyle: {
                    color: ['#f0f0f0']
                  }
                }
              },
              {
                type: 'value',
                name: '',
                nameTextStyle: {
                  color: '#999',
                  fontStyle: 'normal',
                  fontWeight: 'normal',
                  fontSize: 14
                },
                axisLine: {
                  show: false
                },
                axisLabel: {
                  color: '#999',
                  formatter: '{value} %'
                },
                axisTick: {
                  show: false
                },
                splitLine: {
                  lineStyle: {
                    color: ['#f0f0f0']
                  }
                }
              }
            ],
            xAxis: [
              {
                type: 'category',
                data: optionData.category,
                boundaryGap: true,
                axisTick: {
                  show: false,
                  alignWithLabel: true
                },  // #9a9a9a
                axisLine: {
                  show: true,
                  lineStyle: {
                    color: '#f0f0f0'
                  }
                },
                axisLabel: {
                  color: '#999',
                  rotate:30
                },
                axisPointer: {
                  label: {
                    backgroundColor: '#008dcf'
                  }
                }
              }
            ],
            series: this.setSeriesData(optionData)
          });
        }
      },
      setSeriesData(val) {
        var seriesData = val.seriesData
        var seriesList = [];
        var barSeriesObj = {
          name: '周应用访问趋势',
          type: 'line',
          data: seriesData,
          barWidth: 14,
          borderWidth: 0,
          label: {
            normal: {
              show: true,
              color: '#0822cc',
              position: 'top',
              formatter: function (params) {
                return params.value;
              }
            }
          },
          // itemStyle: {
          //   normal: {
          //     show: true,
          //     // barBorderRadius: 14,
          //     color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
          //       offset: 0,
          //       color: graduColorBottomList[main]
          //     }, {
          //       offset: 1,
          //       color: graduColorTopList[main]
          //     }])
          //   }
          // }
          itemStyle: {
            normal: {
              color: colorList[0],
              lineStyle: {
                color: colorList[0],
                width: 2
              }
            }
          }
        };
        seriesList.push(barSeriesObj);
        return seriesList;
      },
      initChart() {
        this.chart = echarts.init(this.$el, 'macarons');
        this.setOptions(this.chartData);
        // 解决切换图表类型时，折线图两边留白丢失问题
        this.chart.on('magictypechanged', (params) => {
          if(params.currentType === 'line') {
            params.newOption.xAxis.map(item => {
              item.boundaryGap = true
            })
            this.chart.setOption(params.newOption);
          }
        })
        // 监听还原点击事件，重置图表
        this.chart.on('restore', params => {
          this.setOptions(this.chartData);
        })
      }
    }
  };
</script>
<!--<style lang="stylus" src="src/assets/skins/echart.styl"></style>-->
<style lang="stylus" src="../../../../assets/skins/echart.styl"></style>
