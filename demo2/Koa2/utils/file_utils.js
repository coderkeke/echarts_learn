const fs = require('fs')

//读取文件的工具
module.exports.getFileJsonData = filePath => {
    return new Promise((resolve, reject) => {
        //根据文件路径读取文件内容
        fs.readFile(filePath, 'utf-8', (err, data) => {
            if (err) {
                //读取文件失败
                reject(err)
            } else {
                resolve(data)
            }
        })
    })
}