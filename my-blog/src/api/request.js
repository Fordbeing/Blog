import axios from  'axios';
import {ElMessage} from 'element-plus';
import config from '@/config'
config.env = 'prod'
// 设置默认header
axios.defaults.headers = { 'Content-Type': 'application/json;charset=utf-8' }
console.log(config.baseApi)
const service = axios.create({
    baseURL:config.baseApi,
    timeout:10000,
})
const NETWORK_ERROR = '网络错误，请稍后重试';

service.interceptors.request.use(
    config => {
        // 在发送请求之前做些什么
        return config
    },
    error => {
        // 对请求错误做些什么
        return Promise.reject(error)
    }
);

// 添加响应拦截器
service.interceptors.response.use(
    response => {
        // 对响应数据做点什么
        const {code,data,msg} = response.data
        if(code === 200){
            return data
        }else{
            ElMessage.error(NETWORK_ERROR)
            return Promise.reject(new Error(msg))
        }
    },
    error => {
        // 对响应错误做点什么
        
        ElMessage.error(msg || NETWORK_ERROR)
        return Promise.reject(msg || NETWORK_ERROR)
    }
);

function request(options){
    options.method = options.method || 'get';
    // 关于get请求的参数处理
    if(options.method.toLowerCase() === 'get'){
        options.params = options.data
    }
    // 统一加上mock
    let isMock = config.mock;
    if(typeof options.mock !== 'undefined'){
        isMock = options.mock;
    }

    // 针对线上环境，如果开启了mock，那么需要将mock设为false
    if(config.env === 'prod'){
        service.defaults.baseURL = config.baseApi;
    }else{
        service.defaults.baseURL = isMock ? config.mockApi : config.baseApi;
    }

    return service(options);
}

export default request;
