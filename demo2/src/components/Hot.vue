<template>
    <div class="com-container">
        <div ref="chart_ref" class="com-chart"></div>
        <span class="iconfont arr-left" :style="comStyle" @click="handleArrow('left')">&#xe6ef;</span>
        <span class="iconfont arr-right" :style="comStyle" @click="handleArrow('right')">&#xe6ed;</span>
        <span class="cat-name">{{catName}}</span>
    </div>
</template>

<script>
    import {hot} from "@/network/api";

    export default {
        name: "Hot",
        data() {
            return {
                chartInstance: null,//echarts实例
                allData: null,//服务器返回的数据
                currentIndex: 0, //显示的数据类型
                titleFontSize: 0 //标题的大小
            }
        },
        created() {
            //注册回调函数
            this.$socket.registerCallBack("hotData", this.getData)
        },
        mounted() {
            //初始化Echarts
            this.initChart()
            //获取数据
            // this.getData()
            this.$socket.send({
                action: 'getData',
                socketType: 'hotData',
                chartName: 'hot',
                value: ''
            })
            // //窗口变化时
            addEventListener('resize', this.screenAdapter)
            // //页面加载完时，主动进行屏幕适配
            this.screenAdapter()
        },
        computed: {
            catName() {
                if (!this.allData) return ""
                return this.allData[this.currentIndex].name
            },
            comStyle() {
                return {
                    fontSize: this.titleFontSize + 'px'
                }
            }
        },
        methods: {
            //初始化echartInstance
            initChart: function () {
                this.destroyInstance()
                const {chart_ref} = this.$refs;
                this.chartInstance = this.$echarts.init(chart_ref, 'chalk')
                //对图表初始化配置的控制
                const initOption = {
                    title: {
                        text: "|  热销商品的占比",
                        top: '2%',
                        left: '2%',
                    },
                    legend: {
                        top: '15%',
                        left: "1%",
                        icon: "circle",
                        // orient: 'vertical'
                    },
                    tooltip: {
                        show: true,
                        formatter: (arg) => {
                            const thirdCategory = arg.data.children
                            //计算出所有三级分类的数值综合
                            let total = 0
                            thirdCategory.forEach(item => {
                                total += item.value
                            })
                            let retStr = ''
                            //占比数
                            let currentProportion = 0;
                            let length = thirdCategory.length
                            thirdCategory.forEach((item, index) => {
                                if (index === length - 1) {
                                    retStr += `${item.name} : ${100 - currentProportion}%<br/>`
                                } else {
                                    let number = Math.round(item.value / total * 100)
                                    currentProportion += number
                                    retStr += `${item.name} : ${number}%<br/>`
                                }
                            })
                            return retStr
                        }
                    },
                    series: [
                        {
                            type: 'pie',
                            label: {
                                show: false
                            },
                            emphasis: {
                                label: {
                                    show: true
                                },
                                labelLine: {
                                    show: false
                                }
                            }
                        }
                    ]

                }
                this.chartInstance.setOption(initOption)
            },

            //获取服务器数据
            async getData(ret) {
                // const {data: ret} = await hot()
                this.allData = JSON.parse(ret)
                //更新图表
                this.updateChart()
            },
            //更新图表
            updateChart() {
                const dataOption = {
                    series: [{
                        data: this.allData[this.currentIndex].children.map(item => {
                            return {
                                name: item.name,
                                value: item.value,
                                children: item.children
                            }
                        })
                    }],
                    legend: {
                        data: this.allData[this.currentIndex].children.map(item => {
                            return item.name
                        })
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
                    title: {
                        textStyle: {
                            fontSize: this.titleFontSize
                        }
                    },
                    series: [
                        {
                            radius: this.titleFontSize * 4.5,
                            center: ['50%', '50%']
                        }
                    ],
                    legend: {
                        itemWidth: this.titleFontSize,
                        itemHeight: this.titleFontSize,
                        itemGap: this.titleFontSize,
                        textStyle: {
                            fontSize: this.titleFontSize,
                        }
                    }
                }
                this.chartInstance.setOption(adapterOption)
                //重置图表
                this.chartInstance.resize()
            },

            //选择
            handleArrow(direction) {
                const length = this.allData.length
                switch (direction) {
                    case 'left':
                        this.currentIndex--
                        if (this.currentIndex < 0) this.currentIndex = length - 1
                        break
                    case 'right':
                        this.currentIndex++
                        if (this.currentIndex >= length) this.currentIndex = 0
                        break
                }
                this.updateChart()
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
            this.$socket.unRegisterCallBack('hotData')
            this.destroyInstance()
        }
    }
</script>

<style lang="less" scoped>
    .com-container {
        .arr-left, .arr-right {
            position: absolute;
            top: 50%;
            transform: translateY(-50%);
            cursor: pointer;
            font-size: 20px;
            color: #ffffff;
            user-select: none;
        }

        .arr-left {
            left: 10%;
        }

        .arr-right {
            right: 10%;
        }

        .cat-name {
            position: absolute;
            left: 80%;
            bottom: 5%;
            font-size: 20px;
            color: #ffffff;
        }
    }
</style>