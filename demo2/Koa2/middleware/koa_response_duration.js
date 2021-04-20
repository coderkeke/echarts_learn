//计算时长的中间件
module.exports = async (ctx, next) => {
    //记录开始时间
    const start = Date.now()
    //进入内层中间件
    await next()
    //结束时间
    const end = Date.now()
    const duration = end - start
    //设置响应头
    ctx.set('X-Response-Time', duration + 'ms')
}