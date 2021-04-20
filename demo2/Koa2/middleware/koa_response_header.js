//设置响应头的中间件
module.exports = async (ctx, next) => {
    ctx.set('Content-Type', 'application/json;charset=utf-8')
    ctx.set("Access-Control-Allow-Origin", "http://192.168.5.152:8000")
    ctx.set('Access-Control-Allow-Credentials', true)
    ctx.set("Access-Control-Allow-Headers", "X-Requested-With");
    ctx.set("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
    ctx.set("X-Powered-By", ' 3.2.1')
    await next()
}
