import axios from "axios";

const mapAxios = axios.create({
        baseURL: '/'
    }
)

//获取静态资源
export function getStaticResources(url) {
    return mapAxios.get(url)
}