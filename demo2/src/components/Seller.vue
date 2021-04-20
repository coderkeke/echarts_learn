<!--商家销量统计的横向柱状图-->
<template>
    <div class="com-container">
        <div ref="chart_ref" class="com-chart"></div>
    </div>
</template>

<script>
    import {seller} from '@/network/api'

    export default {
        name: "Seller",
        data() {
            return {
                chartInstance: null,//echarts实例
                allData: null,//服务器返回的数据
                currentPage: 1,//当前显示的椰树
                totalPage: 0,//总共页数
                timerId: null//定时器id
            }
        },
        created() {
            //注册回调函数
            this.$socket.registerCallBack("sellerData", this.getData)
        },
        mounted() {
            //初始化Echarts
            this.initChart()
            //获取数据
            // this.getData()
            this.$socket.send({
                action: 'getData',
                socketType: 'sellerData',
                chartName: 'seller',
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
                        text: "| 商家销售统计",
                        left: 20,
                        top: 20
                    },
                    grid: {
                        top: '15%',
                        left: '3%',
                        right: '6%',
                        bottom: '3%',
                        containLabel: true
                    },
                    xAxis: {
                        type: 'value'
                    },
                    yAxis: {
                        type: 'category',
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
                    series: [
                        {
                            type: 'bar',
                            label: {
                                show: true,
                                position: 'right',
                                textStyle: {
                                    color: '#fff'
                                }
                            },
                            itemStyle: {

                                color: new this.$echarts.graphic.LinearGradient(0, 0, 1, 0, [
                                    {
                                        offset: 0,
                                        color: '#5052EE'
                                    }, {
                                        offset: 1,
                                        color: "#AB6EE5"
                                    }
                                ])
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
                // const {data: ret} = await seller()
                this.allData = JSON.parse(ret)
                //对数据排序
                this.allData.sort((a, b) => a.value - b.value)
                //每五个元素显示一页
                this.totalPage = Math.ceil(this.allData.length / 5)
                //更新图表
                this.updateChart()
                //变更数据
                this.startInterval()
            },
            //更新图表
            updateChart() {
                const start = (this.currentPage - 1) * 5
                const end = this.currentPage * 5
                const showData = this.allData.slice(start, end)
                const dataOption = {
                    yAxis: {
                        data: showData.map(item => item.name)
                    },
                    series: [
                        {
                            data: showData.map(item => item.value),
                        }
                    ]
                }
                this.chartInstance.setOption(dataOption)
            },
            //窗口适配器
            screenAdapter() {
                //标题文字大小
                const titleFontSize = this.$refs.chart_ref.offsetWidth / 100 * 3.6
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
                                borderRadius: [0, titleFontSize / 2, titleFontSize / 2, 0],
                            }
                        }
                    ]
                }

                console.log(adapterOption)
                this.chartInstance.setOption(adapterOption)
                //重置图表
                this.chartInstance.resize()
            },
            //定时修改数据页码
            startInterval() {
                if (this.timerId) clearInterval(this.timerId)
                this.timerId = setInterval(() => {
                    this.currentPage++
                    if (this.currentPage > this.totalPage) this.currentPage = 1
                    this.updateChart()
                }, 3000)
            },
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
            this.$socket.unRegisterCallBack('sellerData')
            this.destroyInstance()
        }

    }
</script>

<style scoped>

</style>