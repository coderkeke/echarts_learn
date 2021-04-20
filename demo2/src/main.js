import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import * as echarts from 'echarts'
import SocketService from "@/utils/socket_service";
//连接服务端websocket
SocketService.Instance.connect()
//挂载SocketService的Instance
Vue.prototype.$socket = SocketService.Instance
//引入字体文件
import '@/assets/font/iconfont.css'
//引入全局样式
import '@/assets/css/global.less'
//echarts主题
import "./assets/theme/chalk"
//挂载到vue原型上
Vue.prototype.$echarts = echarts

Vue.config.productionTip = false;

new Vue({
    router,
    store,
    render: (h) => h(App),
}).$mount("#app");
