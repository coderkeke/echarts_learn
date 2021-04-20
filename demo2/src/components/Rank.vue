<!--商家销量统计的横向柱状图-->
<template>
    <div class="com-container">
        <div ref="chart_ref" class="com-chart"></div>
    </div>
</template>

<script>
    import {rank} from '@/network/api'

    export default {
        name: "Rank",
        data() {
            return {
                chartInstance: null,//echarts实例
                allData: null,//服务器返回的数据
                timerId: null,//定时器id
                startValue: 0,//区域缩放的起点值
                endValue: 9//区域缩放的结束值
            }
        },
        created() {
            //注册回调函数
            this.$socket.registerCallBack("rankData", this.getData)
        },
        mounted() {
            //初始化Echarts
            this.initChart()
            //获取数据
            // this.getData()
            this.$socket.send({
                action: 'getData',
                socketType: 'rankData',
                chartName: 'rank',
                value: ''
            })
            //窗口变化时
            addEventListener('resize', this.screenAdapter)
            //页面加载完时，主动进行屏幕适配
            this.screenAdapter()
        },

        methods: {
            //初始化echartInstance
            initChart() {
                this.destroyInstance()
                const {chart_ref} = this.$refs;
                this.chartInstance = this.$echarts.init(chart_ref, 'chalk')
                //对图表初始化配置的控制
                const initOption = {
                    title: {
                        text: "| 地区销售排行",
                        left: 20,
                        top: 20
                    },
                    grid: {
                        top: '35%',
                        left: '3%',
                        right: '6%',
                        bottom: '5%',
                        containLabel: true
                    },
                    xAxis: {
                        type: 'category'
                    },
                    yAxis: {
                        type: 'value',
                    },
                    tooltip: {
                        trigger: 'axis',
                        axisPointer: {
                            type: 'line',
                            z: 0,
                            lineStyle: {
                                color: "#2D3443",
                            }
                        }
                    },
                    dataZoom: {
                        type: 'slider',
                        show: false,
                        startValue: this.startValue,
                        endValue: this.endValue,
                        bottom: "3%"
                    },
                    series: [
                        {
                            type: 'bar',
                            label: {
                                show: true,
                                position: 'top',
                                textStyle: {
                                    color: '#fff'
                                }
                            },
                            itemStyle: {
                                color: (arg) => {
                                    let targetColorArr = null
                                    if (arg.value < 130) {
                                        targetColorArr = '#d316e0'
                                    } else if (arg.value < 170) {
                                        targetColorArr = "#09d9ec"
                                    } else {
                                        targetColorArr = "#ec0973"
                                    }
                                    return new this.$echarts.graphic.LinearGradient(0, 1, 0, 0, [
                                        {
                                            offset: 0,
                                            color: targetColorArr
                                        }, {
                                            offset: 1,
                                            color: "#092fec"
                                        }
                                    ])
                                }
                            }
                        }
                    ]
                }
                this.chartInstance.setOption(initOption)
                //对图表对象进行鼠标事件监听
                this.chartInstance.on('mouseover', () => clearInterval(this.timerId))
                this.chartInstance.on('mouseout', this.startInterval)
            },
            //获取服务器数据
            async getData(ret) {
                // const {data: ret} = await rank()
                this.allData = JSON.parse(ret)
                //对数据排序
                this.allData.sort((a, b) => a.value - b.value)
                //更新图表
                this.updateChart()
                //变更数据
                this.startInterval()
            },
            //更新图表
            updateChart() {
                const dataOption = {
                    xAxis: {
                        data: this.allData.map(item => {
                            return item.name
                        })
                    },
                    dataZoom: {
                        startValue: this.startValue,
                        endValue: this.endValue,
                    },
                    series: [
                        {
                            data: this.allData.map(item => {
                                return item.value
                            }),
                        }
                    ]
                }
                this.chartInstance.setOption(dataOption)
            },
            //窗口适配器
            screenAdapter() {
                //标题文字大小
                const titleFontSize = this.$refs.chart_ref.offsetWidth / 100 * 3.6
                console.log(titleFontSize,11111111111)
                //跟分辨率大小相关的配置项
                const adapterOption = {
                    title: {
                        textStyle: {
                            fontSize: titleFontSize
                        },
                    },
                    tooltip: {
                        axisPointer: {
                            lineStyle: {
                                width: titleFontSize,
                            }
                        }
                    },
                    series: [
                        {
                            barWidth: titleFontSize,
                            itemStyle: {
                                borderRadius: [titleFontSize / 2, titleFontSize / 2, 0, 0],
                            }
                        }
                    ]
                }
                this.chartInstance.setOption(adapterOption)
                //重置图表
                this.chartInstance.resize()
            },
            //定时修改数据页码
            startInterval() {
                if (this.timerId) clearInterval(this.timerId)
                this.timerId = setInterval(() => {
                    this.startValue++
                    this.endValue++
                    if (this.endValue > this.allData.length - 1) {
                        this.startValue = 0
                        this.endValue = 9
                    }
                    this.updateChart()
                }, 2000)
            },
            //销毁实例
            destroyInstance() {
                if (this.chartInstance) {
                    this.$echarts.dispose(this.chartInstance)
                    this.chartInstance = null
                }
            }
        },

        destroyed() {
            clearInterval(this.timerId)
            removeEventListener('resize', this.screenAdapter)
            this.$socket.unRegisterCallBack('rankData')
            this.destroyInstance()
        }

    }
</script>

<style scoped>

</style>