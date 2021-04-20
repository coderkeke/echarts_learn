<template>
    <div class="com-container">
        <div class="title" :style="comStyle">
            <span>{{showTitle}}</span>
            <span class="iconfont title-icon" :style="comStyle" @click="showChoice=!showChoice">&#xe6eb;</span>
            <div class="select-con" v-show="showChoice">
                <div class="select-item" v-for="item in selectTypes" :key="item.key" @click="handleSelect(item.key)">
                    {{item.text}}
                </div>
            </div>
        </div>
        <div ref="chart_ref" class="com-chart"></div>
    </div>
</template>

<script>
    import {trend} from "@/network/api";

    export default {
        name: "Trend",
        data() {
            return {
                chartInstance: null,//echarts实例
                allData: null,//服务器返回的数据
                showChoice: false,//是否显示可选项
                choiceType: 'map', //显示的数据类型
                titleFontSize: 0 //标题的大小
            }
        },
        created() {
            //注册回调函数
            this.$socket.registerCallBack("trendData", this.getData)
        },
        mounted() {
            //初始化Echarts
            this.initChart()
            //获取数据
            // this.getData()
            //发送数据给服务器,告诉服务器，我现在需要数据
            this.$socket.send({
                action: 'getData',
                socketType: 'trendData',
                chartName: 'trend',
                value: ''
            })
            // //窗口变化时
            addEventListener('resize', this.screenAdapter)
            // //页面加载完时，主动进行屏幕适配
            this.screenAdapter()
        },
        computed: {
            selectTypes() {
                if (!this.allData) return []
                return this.allData.type.filter(item => item.key !== this.choiceType)
            },
            showTitle() {
                if (!this.allData) return ''
                return this.allData[this.choiceType].title
            },
            //设置给标题的样式
            comStyle() {
                return {
                    fontSize: this.titleFontSize + 'px'
                }
            },
        },
        methods: {
            //初始化echartInstance
            initChart() {
                this.destroyInstance()
                const {chart_ref} = this.$refs;
                this.chartInstance = this.$echarts.init(chart_ref, 'chalk')
                //对图表初始化配置的控制
                const initOption = {
                    grid: {
                        top: '35%',
                        left: '3%',
                        right: '6%',
                        bottom: '3%',
                        containLabel: true
                    },
                    xAxis: {
                        type: 'category',
                        boundaryGap: false
                    },
                    yAxis: {
                        type: 'value'
                    },
                    tooltip: {
                        trigger: 'axis'
                    },
                    legend: {
                        left: 20,
                        top: '15%',
                        icon: "circle"
                    }

                }
                this.chartInstance.setOption(initOption)
            },
            //获取服务器数据 ret  服务端发送过来的数据
            async getData(ret) {
                // const {data: aaa} = await trend()
                this.allData = JSON.parse(ret)
                //更新图表
                this.updateChart()
            },
            //更新图表
            updateChart() {
                //半透明的颜色值
                const colorArr1 = [
                    'rgba(11,168,44,0.5)',
                    'rgba(44,110,255,0.5)',
                    'rgba(22,242,217,0.5)',
                    'rgba(254,33,30,0.5)',
                    'rgba(250,105,0,0.5)',
                ]
                //全透明的颜色值
                const colorArr2 = [
                    'rgba(11,168,44,0)',
                    'rgba(44,110,255,0)',
                    'rgba(22,242,217,0)',
                    'rgba(254,33,30,0)',
                    'rgba(250,105,0,0)',
                ]
                //类目轴数据
                const timeArr = this.allData.common.month
                //y轴的数据
                const valueArr = this.allData[this.choiceType].data
                const seriesArr = valueArr.map((item, index) => {
                    return {
                        name: item.name,
                        type: 'line',
                        data: item.data,
                        stack: this.choiceType,
                        areaStyle: {
                            color: new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                                offset: 0,
                                color: colorArr1[index]
                            }, {
                                offset: 1,
                                color: colorArr2[index]
                            }])
                        }
                    }
                })
                //图例的数据
                const legendArr = valueArr.map(item => {
                    return item.name
                })
                const dataOption = {
                    xAxis: {
                        data: timeArr
                    },
                    series: seriesArr,
                    legend: {
                        data: legendArr
                    }
                }
                this.chartInstance.setOption(dataOption)
            },

            //窗口适配器
            screenAdapter() {
                //标题文字大小
                this.titleFontSize = this.$refs.chart_ref.offsetWidth / 100 * 3.6
                //跟分辨率大小相关的配置项
                const adapterOption = {
                    legend: {
                        itemWidth: this.titleFontSize,
                        itemHeight: this.titleFontSize,
                        itemGap: this.titleFontSize,
                        textStyle: {
                            fontSize: this.titleFontSize / 2,
                        }
                    }
                }
                this.chartInstance.setOption(adapterOption)
                //重置图表
                this.chartInstance.resize()
            },

            //选择
            handleSelect(currentType) {
                this.choiceType = currentType
                this.updateChart()
                this.showChoice = false
            },

            destroyInstance() {
                if (this.chartInstance) {
                    this.$echarts.dispose(this.chartInstance)
                    this.chartInstance = null
                }
            }
        },

        //销毁
        destroyed() {
            clearInterval(this.timerId)
            removeEventListener('resize', this.screenAdapter)
            this.$socket.unRegisterCallBack('trendData')
            this.destroyInstance()
        }
    }
</script>

<style lang="less" scoped>
    .com-container {

        .title {
            position: absolute;
            top: 20px;
            left: 20px;
            z-index: 10;
            user-select: none;
            color: #fff;

            .title-icon {
                margin-left: 10px;
                cursor: pointer;
            }

            .select-con {
                .select-item {
                    cursor: pointer;

                    &:hover {
                        background: #000;
                    }
                }
            }
        }
    }
</style>