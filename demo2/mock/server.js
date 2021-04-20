//引入express
const express = require('express')
const compression = require('compression')
const mapJson = require('../../demo/src/json/map/china.json')
const gxJson = require('../../demo/src/json/map/gx.json')
//引入mockjs
const Mock = require('mockjs')
//创建服务器
const app = express()

app.use(compression())

//设置跨域访问
app.all('*', (req, res, next) => {
    res.header("Access-Control-Allow-Origin", "http://localhost:8080")
    res.header('Access-Control-Allow-Credentials', true)
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
    res.header("X-Powered-By", ' 3.2.1')
    res.header("Content-Type", "application/json;charset=utf-8");
    next()
})


//监听路由
app.get('/', (req, res) => {
    console.log(req.query)
    console.log(req.body)
    console.log(req.params)
// 准备随机数据
    let data = Mock.mock({
        'list|6': [{
            'name|3-5': /[a-z][A-Z]/,
            'value|5000-20000.1-1': 1,
        }]
    })
    let map = {
        mapJson, gxJson
    }
    res.end(JSON.stringify(data));
})


//开启服务器
app.listen(8081)