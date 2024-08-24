/*
整个项目的api接口统一管理

*/
import { pa } from 'element-plus/es/locale/index.mjs'
import request from './request'

// 请求首页左侧的表格
export default{
    getPostData: () => {
      return request({
        url: `/article/findByPage`,
        method: 'get',
      })
    },
    
    
    
}