'use strict'
const fileUtils = require('../utils/file_utils')

const path = require('path')
// 导入WebSocket模块:
const WebSocket = require('ws');
// 引用Server类:
const WebSocketServer = WebSocket.Server;
// 实例化:
const wss = new WebSocketServer({
    port: 9998
});


module.exports.listen = () => {
//对客户的的链接事件进行监听
    wss.on('connection', function (client) {
        console.log('有客户端链接成功了...')
        client.on('message', async function (message) {
            console.log("客户端发送的数据", message)
            let payload = JSON.parse(message)
            const {action, chartName} = payload
            if (action === 'getData') {
                let filePath = '../data/' + chartName + '.json'
                filePath = path.join(__dirname, filePath)
                payload.data = await fileUtils.getFileJsonData(filePath)
                client.send(JSON.stringify(payload))
            } else {
                wss.clients.forEach(_client => {
                    _client.send(message)
                })
            }
        })
    });
}


