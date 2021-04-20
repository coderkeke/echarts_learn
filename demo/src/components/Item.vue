<template>
    <div>
        <div :ref="uid" style="width: 90vw;height:80vh;"></div>
    </div>
</template>

<script>
    import * as echarts from 'echarts';
    import {list} from '../network/api'

    let myChart;

    export default {
        name: 'item-component',
        props: {
            uid: {}
        },
        data() {
            return {}
        },
        mounted() {
            myChart = echarts.init(this.$refs[this.uid], 'dark')
            list().then(res => {
                // echarts.registerMap('chinaMap', res.data.mapJson)
                this.initEchart()
            })
        },

        methods: {
            initEchart() {
                // 指定图表的配置项和数据
                const option = {}
                myChart.setOption(option, true)
                window.addEventListener("resize", function () {
                    myChart.resize();
                });
            },

        }
    }

</script>

