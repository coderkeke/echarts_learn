<template>
    <div class="com-container">
        <div ref="chart_ref" class="com-chart"></div>
    </div>
</template>

<script>
    import {stock} from "@/network/api";

    export default {
        name: "Stock",
        data() {
            return {
                chartInstance: null,//echarts实例
                allData: null,//服务器返回的数据
                titleFontSize: 0, //标题的大小
                currentIndex: 0,
                timerId: null//定时器id
            }
        },
        created() {
            //注册回调函数
            this.$socket.registerCallBack("stockData", this.getData)
        },
        mounted() {
            //初始化Echarts
            this.initChart()
            //获取数据
            // this.getData()
            this.$socket.send({
                action: 'getData',
                socketType: 'stockData',
                chartName: 'stock',
                value: ''
            })
            // //窗口变化时
            addEventListener('resize', this.screenAdapter)
            //页面加载完时，主动进行屏幕适配
            this.screenAdapter()
            this.startInterval()
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
                        text: "| 库存和销量分析",
                        left: 20,
                        top: 20
                    },
                }
                this.chartInstance.setOption(initOption)
                //对图表对象进行鼠标事件监听
                this.chartInstance.on('mouseover', () => clearInterval(this.timerId))
                this.chartInstance.on('mouseout', this.startInterval)
            },
            //获取服务器数据
            async getData(ret) {
                // const {data: ret} = await stock()
                this.allData = JSON.parse(ret)
                //更新图表
                this.updateChart()
            },
            //更新图表
            updateChart() {
                const centerArr = [
                    ["18%", "40%"],
                    ["50%", "40%"],
                    ["82%", "40%"],
                    ["34%", "75%"],
                    ["66%", "75%"],
                ]
                const colorArr = [
                    ["#4ff778", "#0864a1"],
                    ["#c54ff7", "#f74f9d"],
                    ["#f7634f", "#e6f74f"],
                    ["#d8f74f", "#4fbcf7"],
                    ["#7c4ff7", "#f7db4f"]
                ]
                const start = this.currentIndex * 5
                const end = (this.currentIndex + 1) * 5
                const showData = this.allData.slice(start, end)
                //图例的数据
                const dataOption = {
                    series: showData.map((item, index) => {
                        return {
                            type: 'pie',
                            hoverAnimation: false,
                            labelLine: {
                                show: false
                            },
                            center: centerArr[index],
                            label: {
                                show: true,
                                position: 'center',
                                formatter: () => {
                                    return `${item.name}\n\n${item.sales}`
                                },
                                emphasis: {
                                    show: true, // 文字至于中间时，这里需为true
                                },
                                color: colorArr[index][0]
                            },
                            data: [
                                {
                                    value: item.sales,
                                    itemStyle: {
                                        color: new this.$echarts.graphic.LinearGradient(0, 1, 0, 0, [
                                            {
                                                offset: 0,
                                                color: colorArr[index][0]
                                            },
                                            {
                                                offset: 1,
                                                color: colorArr[index][1]
                                            }
                                        ])
                                    }
                                }, {
                                    value: item.stock,
                                    itemStyle: {
                                        color: '#ccc'
                                    }
                                }
                            ]
                        }
                    }),
                }
                this.chartInstance.setOption(dataOption)
            },

            //窗口适配器
            screenAdapter() {
                //标题文字大小
                this.titleFontSize = this.$refs.chart_ref.offsetWidth / 100 * 3.6
                const innerRadius = this.titleFontSize * 2.8
                const outerRadius = innerRadius * 1.125
                //跟分辨率大小相关的配置项
                const adapterOption = {
                    title: {
                        textStyle: {
                            fontSize: this.titleFontSize
                        }
                    },
                    series: [
                        {type: 'pie', radius: [outerRadius, innerRadius], label: {fontSize: this.titleFontSize / 2}},
                        {type: 'pie', radius: [outerRadius, innerRadius], label: {fontSize: this.titleFontSize / 2}},
                        {type: 'pie', radius: [outerRadius, innerRadius], label: {fontSize: this.titleFontSize / 2}},
                        {type: 'pie', radius: [outerRadius, innerRadius], label: {fontSize: this.titleFontSize / 2}},
                        {type: 'pie', radius: [outerRadius, innerRadius], label: {fontSize: this.titleFontSize / 2}}
                    ]
                }
                this.chartInstance.setOption(adapterOption)
                //重置图表
                this.chartInstance.resize()
            },
            destroyInstance() {
                if (this.chartInstance) {
                    this.$echarts.dispose(this.chartInstance)
                    this.chartInstance = null
                }
            },
            startInterval() {
                this.timerId = setInterval(() => {
                    this.currentIndex++
                    if (this.currentIndex > 1) {
                        this.currentIndex = 0
                    }
                    this.updateChart()
                }, 5000)
            }
        },

        destroyed() {
            removeEventListener('resize', this.screenAdapter)
            clearInterval(this.timerId)
            this.$socket.unRegisterCallBack('stockData')
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