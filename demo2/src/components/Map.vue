<!--商家销量统计的横向柱状图-->
<template>
    <div class="com-container" @dblclick="revertMap">
        <div ref="chart_ref" class="com-chart"></div>
    </div>
</template>

<script>
    import {map} from '@/network/api'
    import {getStaticResources} from '@/network/staticResource'
    import {getProvinceMapInfo} from '@/utils/map_utils'

    export default {
        name: "Map",
        data() {
            return {
                chartInstance: null,//echarts实例
                allData: null,//服务器返回的数据
                mapData: new Map() //所获取的省份的地图矢量数据
            }
        },
        created() {
            //注册回调函数
            this.$socket.registerCallBack("mapData", this.getData)
        },
        mounted() {
            //初始化Echarts
            this.initChart()
            //获取数据
            // this.getData()
            //发送数据给服务器,告诉服务器，我现在需要数据
            this.$socket.send({
                action: 'getData',
                socketType: 'mapData',
                chartName: 'map',
                value: ''
            })
            //窗口变化时
            addEventListener('resize', this.screenAdapter)
            //页面加载完时，主动进行屏幕适配
            this.screenAdapter()
        },

        methods: {
            //初始化echartInstance
            initChart: async function () {
                this.destroyInstance()
                const {chart_ref} = this.$refs;
                this.chartInstance = this.$echarts.init(chart_ref, 'chalk')
                //获取中国地图的矢量数据
                // const ret = await getStaticResources('/static/map/china.json')
                const ret = require('@/assets/map/china.json')
                //注册地图
                this.$echarts.registerMap('china', ret)
                //对图表初始化配置的控制
                const initOption = {
                    title: {
                        text: '|  商家分布',
                        top: 20,
                        left: 20,
                    },
                    legend: {
                        left: '5%',
                        bottom: '5%',
                        orient: 'vertical'
                    },
                    geo: {
                        type: 'map',
                        map: "china",
                        layoutCenter: ['50%', '50%'],
                        itemStyle: {
                            areaColor: '#2172bf',
                            borderColor: '#333',
                            shadowColor: 'rgba(0, 0, 0, 0.5)',
                            shadowBlur: 10,
                            shadowOffsetX: -5,
                            shadowOffsetY: 5
                        }
                    }
                }
                this.chartInstance.setOption(initOption)
                //地图点击数据
                this.chartInstance.on('click', this.handleMap)
            },
            //获取服务器数据
            async getData(ret) {
                // const {data: aaa} = await map()
                // console.log(JSON.parse(ret), aaa)
                this.allData = JSON.parse(ret)
                //更新图表
                this.updateChart()
            },
            //更新图表
            updateChart() {
                console.log(this.allData)
                //图例的数据
                const legendArr = this.allData.map(item => item.name)
                const seriesArr = this.allData.map(item => {
                    //一个类别下的所有散点数据
                    return {
                        type: 'effectScatter',
                        name: item.name,
                        data: item.children,
                        coordinateSystem: 'geo',
                        rippleEffect: {
                            scale: 5,
                            brushType: 'stroke'
                        }
                    }
                })
                const dataOption = {
                    legend: {
                        data: legendArr
                    },
                    series: seriesArr,
                }
                this.chartInstance.setOption(dataOption)
            },
            //窗口适配器
            screenAdapter() {
                const titleFontSize = this.$refs.chart_ref.offsetWidth / 100 * 3.6
                //跟分辨率大小相关的配置项
                const adapterOption = {
                    title: {
                        textStyle: {
                            fontSize: titleFontSize
                        }
                    },
                    legend: {
                        itemWidth: titleFontSize / 2,
                        itemHeight: titleFontSize / 2,
                        itemGap: titleFontSize,
                        textStyle: {
                            fontSize: titleFontSize / 2
                        }
                    },
                }
                this.chartInstance.setOption(adapterOption)
                //重置图表
                this.chartInstance.resize()
            },
            //地图点击事件
            async handleMap(arg) {
                //非地图点击时
                if (arg.componentType !== 'geo') return
                //判断当前所点击的这个
                const {key, data} = getProvinceMapInfo(arg.name)
                //如果地图数据已经存在，则不再请求
                if (!this.mapData.has(key)) {
                    //注册地图
                    this.$echarts.registerMap(key, data)
                    this.mapData.set(key, data)
                }
                //修改
                const changeOption = {
                    geo: {
                        map: key
                    }
                }
                this.chartInstance.setOption(changeOption)
            },
            //回到中国地图
            revertMap() {
                const revertOption = {
                    geo: {
                        map: 'china'
                    }
                }
                this.chartInstance.setOption(revertOption)
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
            removeEventListener('resize', this.screenAdapter)
            this.chartInstance.off('click', this.handleMap)
            this.$socket.unRegisterCallBack('mapData')
            this.destroyInstance()
        }

    }
</script>

<style scoped>

</style>