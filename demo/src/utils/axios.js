import axios from "axios";

axios.defaults.withCredentials = true; //表示跨域请求时是否需要使用凭证
axios.defaults.baseURL = 'http://192.168.5.152:8081'
axios.defaults.timeout = 500000
//请求拦截器
axios.interceptors.request.use(config => {
    //在发送请求之前做些什么
    return config
}, error => {
    //对请求错误做些什么
    return Promise.reject(error)
})

//响应拦截器
axios.interceptors.response.use(response => {
    //对响应数据做点什么
    return response
}, error => {
    //对响应错误做点什么
    return Promise.reject(error)
})

export function get(url, params = {}) {
    return axios({
        method: "get",
        url,
        params
    })
}

export function post(url, data = {}) {
    return axios({
        method: 'post',
        url,
        data
    })
}