import {get} from '@/utils/axios'

export const seller = () => {
    return get('/seller')
}
export const trend = () => {
    return get('/trend')
}
export const map = () => {
    return get('/map')
}
export const rank = () => {
    return get('/rank')
}
export const hot = () => {
    return get('/hot')
}
export const stock = () => {
    return get('/stock')
}


