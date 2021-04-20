import originJsonp from 'jsonp'

export default function jsonp(url, data, option) {
    url += (url.indexOf('?') < 0 ? "?" : '&') + param(data)

    return new Promise((resolve, reject) => {
        //调用originJsonp()来捉取数据
        originJsonp(url, option, (err, data) => {
            //callback是捉取数据结果
            if (!err) {
                resolve(data)
            } else {
                reject(err)
            }
        })

    })
}

export function param(data) {
    let url = '';
    for (const dataKey in data) {
        if (data.hasOwnProperty(dataKey)) {
            let value = data[dataKey] !== void 0 ? data[dataKey] : '' //判断data是否为空
            //将data拼接起来
            if (value) {
                url += `&${dataKey}=${encodeURIComponent(value)}`
            }
        }
    }
    //去除url中的第一个& 避免重复
    return url ? url.substring(1) : ''
}