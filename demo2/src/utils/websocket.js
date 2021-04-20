'use strict'
//链接服务端

const WebSocket = require('ws')

const ws = new WebSocket('ws://192.168.5.152:9998')

ws.onopen = () => {
    console.log('链接服务端成功了')
}

ws.onclose = () => {
    console.log('链接服务器失败')
}

ws.onmessage = msg => {
    console.log('接收到从服务端发送过来的数据了', msg)
}

setInterval(() => ws.send('你好啊'), 3000)
