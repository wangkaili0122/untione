<!--
 /**
  * 应用统计-应用类型统计
  * @desc 组件描述
  * @date 2019/03/28
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
  require('echarts/lib/chart/pie')
  // 引入提示框和title组件，图例
  require('echarts/lib/component/tooltip')
  require('echarts/lib/component/title')
  require('echarts/lib/component/legend')
  require('echarts/theme/macarons'); // echarts theme

  import { GetAppType } from 'request/services/app-statistics'
  const colorList = ['#41a6f7', '#F55D90','#ffc500', '#26c7db', '#ff9800', '#7dc57e', '#F55D90', '#ca8622', '#bda29a', '#6e7074', '#546570', '#c4ccd3', '#FEC400',];
  // const colorList = ['#3695d0', '#ff9800', '#f60', '#E75CF3', '#4F82FF', '#12D2FF', '#29CC97', '#F55D90', '#ca8622', '#FEC400', '#bda29a', '#6e7074', '#546570', '#c4ccd3']
  // const colorList = ['#41a6f7', '#F55D90', '#ffc500',  '#ff9800', '#f60', '#4F82FF', '#12D2FF','#E75CF3', '#29CC97', '#F55D90', '#ca8622', '#FEC400', '#bda29a', '#6e7074', '#546570', '#c4ccd3']
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
      }
    },
    data() {
      return {
        chart: null,
        chartData: {
          optionData: {}
        },
        rawHtml: null
      };
    },
    mounted() {
      this.getOptionData();
      this.initChart();
    },
    beforeDestroy() {
      if (!this.chart) {
        return;
      }
      ;
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
      getOptionData() {
        GetAppType().then(res => {
          var resData = res.data.data;
          if (resData && resData.length > 0) {
            // var aa=[
            //   {
            //     name: "平台管理1",
            //     value: 14
            //   },
            //   {
            //     name: "平台管理2",
            //     value: 6
            //   },
            //   {
            //     name: "平台管理",
            //     value: 4
            //   }
            // ]
            // resData = aa.concat(aa)
            var dataObj = {
              seriesData: resData,
              category: []
            };
            this.chartData.optionData = dataObj;
          } else {
            this.rawHtml = '<div id="app-type-nodata" style="text-align: center;font-weight: bold;line-height: 140px; color: #666">暂无数据</div>';
          }
        }).catch(error => {
          this.rawHtml = '<div id="app-type-nodata" style="text-align: center;font-weight: bold;line-height: 140px; color: #666">暂无数据</div>';
          console.log(response);
        });
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
              show: true,
              trigger: 'item',
              formatter: function (param) {
                if (param.name) {
                  return param.seriesName + '<br/>' + param.name + ': ' + param.value + '个' + ' (' + param.percent + '%)';
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
              top: '20%',
              left: '2%',
              right: '3%',
              bottom: '3%',
              containLabel: true
            },
            series: this.setSeriesData(optionData)
          });
        }
      },
      setSeriesData(val) {
        var seriesData = val.seriesData;
        var seriesObj = {};
        var seriesList = [];
        seriesObj = {
          name: '应用类型',
          type: 'pie',
          radius: ['50%', '65%'],
          center: ['43%', '50%'],
          avoidLabelOverlap: false,
          itemStyle: {
            normal: {
              color: function (params) {
                return colorList[params.dataIndex];
              }
            }
          },
          label: {
            normal: {
              formatter: '{a|{c} 个}\n{hr|}\n{b|{b}}',
              padding: [0, 15, 0, 20],
              rich: {
                a: {
                  lineHeight: 22,
                  align: 'center',
                  fontSize: 14
                },
                hr: {
                  borderColor: '#aaa',
                  width: '100%',
                  borderWidth: 0.5,
                  height: 0
                },
                b: {
                  lineHeight: 22,
                  align: 'center',
                  fontSize: 14
                }
              }
            },
            emphasis: {
              show: true,
              textStyle: {
                position: 'center',
                fontSize: '24',
                fontWeight: 'bold'
              }
            }
          },
          labelLine: {
            normal: {
              show: false,
              length: 10,
              length2: 12,
              smooth: false,
              lineStyle: {
                type: 'dashed'
              }
            }
          },
          data: seriesData
        };
        seriesList.push(seriesObj)
        seriesList.push({
          name: '',
          type: 'pie',
          radius: ['67%', '68%'],
          center: ['43%', '50%'],
          hoverAnimation: false,
          avoidLabelOverlap: true,
          itemStyle: dataStyle,
          labelLine: {
            normal: {
              show: false
            }
          },
          data: [{
            value: 100,
            name: '',
            itemStyle: {
              normal: {
                color: '#70ffac',
                borderWidth: 15
              }
            }
          }, {
            value: 0,
            name: '',
          }]
        });
        return seriesList;
      },
      initChart() {
        this.chart = echarts.init(this.$el, 'macarons');
        this.setOptions(this.chartData);
      }
    }
  };
</script>
<style lang="stylus" src="../../../../assets/skins/echart.styl"></style>
