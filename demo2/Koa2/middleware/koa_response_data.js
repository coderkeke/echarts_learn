const path = require('path')
const fileUtils = require('../utils/file_utils')
//处理业务逻辑的中间件
module.exports = async (ctx, next) => {
    //根据url
    const url = ctx.request.url;
    let filePath = url.replace('/api', '')
    filePath = '../data' + filePath + '.json'
    filePath = path.join(__dirname, filePath)
    try {
        ctx.response.body = await fileUtils.getFileJsonData(filePath)
    } catch (error) {
        ctx.response.body = {
            message: '读取文件错误,文件资源不存在',
            state: 400
        }
    }
    await next()
}