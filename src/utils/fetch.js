import axios from 'axios'
import router from '../router'

axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8'

// create an axios instance 创建了一个axios实例，
const fetch = axios.create({
    timeout: 30000 // request timeout  表示8s之后就会自动的请求停止，
})

// request interceptor 请求拦截器，所有发送给后台的请求，都会执行如下的过程，比如如下在请求头中的config中增加了请求头，x-Token， 值为 abc-token-123-moni-token
fetch.interceptors.request.use(
    config => {
        // 模拟token
        config.headers['X-Token'] = 'abc-token-123-moni-token'
        return config
    },
    error => {
        Promise.reject(error)
    }
)

// response interceptor 响应拦截器，所有来自后台的相应，都会执行如下的过程，比如如下，当code值为403和401的时候，跳转到首页，比如400/500/504的时候，返回报错信息，200的时候，将值继续往下执行
fetch.interceptors.response.use(
    response => {
        if (response.data) {
            switch (response.data.code) {
                case 200:
                    return Promise.resolve(response.data)
                // case 403:
                // case 401:
                //     router.push('/')
                //     break
                case 400:
                case 500:
                case 504:
                    return Promise.reject(response.data)
            }
        }
    },
    error => {
        return Promise.reject(error)
    }
)

// 将fetch暴露出去，也就是在order.service.js和user.service.js中可以通过  import fetch from '@/utils/fetch'  获取到这个fetch实例
export default fetch

// 备注： 请求拦截器和响应拦截器不是必须要写的，有些时候可以不用写。
