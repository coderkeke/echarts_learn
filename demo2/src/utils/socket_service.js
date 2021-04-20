'use strict'

export default class SocketService {
    constructor() {
        //和服务端连接的socket对象
        this.ws = null
        //存储回调函数
        this.callBackMapping = new Map()
        //是否连接成功
        this.connected = false
        //记录重试的次数
        this.sendRetryCount = 0
        //重连次数
        this.connectRetryCount = 0
    }

    /**
     * 单例
     */
    static _instance = null

    static get Instance() {
        if (!this._instance) {
            this._instance = new SocketService()
        }
        return this._instance
    }

    //定义链接服务器的方法
    connect() {
        //连接服务器
        if (!window.WebSocket) {
            return console.log("浏览器不支持WebSocket")
        }
        this.ws = new WebSocket('ws://192.168.5.152:9998')

        //链接成功的事件
        this.ws.onopen = () => {
            console.log('服务器连接成功了')
            this.connected = true
            this.connectRetryCount = 0
        }

        //连接服务端失败
        this.ws.onclose = (err) => {
            console.log("服务器连接失败了", err)
            this.connected = false
            this.connectRetryCount++
            //失败重连
            setTimeout(() => {
                this.connect()
            }, this.connectRetryCount * 500)
        }
        //得到服务器发送过来的数据
        this.ws.onmessage = message => {
            const receivedData = JSON.parse(message.data)
            const {socketType, action, data} = receivedData
            //判断回调函数是否存在
            if (this.callBackMapping.has(socketType)) {
                switch (action) {
                    case 'getData':
                        //调用
                        this.callBackMapping.get(socketType).call(this, data)
                        break
                    case 'fullScreen':
                        break
                    case 'themeChange':
                        break
                    default:
                        break
                }
            }
        }
    }

    //回调函数的注册
    registerCallBack(socketType, callback) {
        this.callBackMapping.set(socketType, callback)
    }

    //取消某一个回调函数
    unRegisterCallBack(socketType) {
        this.callBackMapping.delete(socketType)
    }

    //发送数据的方法
    send(data) {
        console.log('发送数据的方法', data)
        //判断是否连接成功
        if (this.connected) {
            this.sendRetryCount = 0
            this.ws.send(JSON.stringify(data))
        } else {
            this.sendRetryCount++
            //延迟重试
            setTimeout(() => {
                this.send(data)
            }, this.sendRetryCount * 500)
        }
    }
}
