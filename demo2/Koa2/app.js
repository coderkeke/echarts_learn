'use strict'

const Koa = require('koa')
const respDurationMiddleware = require('./middleware/koa_response_duration')
const respHeaderMiddleware = require('./middleware/koa_response_header')
const respDataMiddleware = require('./middleware/koa_response_data')
//创建实例对象
const app = new Koa();

//绑定中间件
//第一层
app.use(respDurationMiddleware);
//第二层
app.use(respHeaderMiddleware);
//第三层
app.use(respDataMiddleware);

//绑定端口号
app.listen(8082);

const webSocketService = require('./server/web_socket_service')
//开启服务端的监听
webSocketService.listen()