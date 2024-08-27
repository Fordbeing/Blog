/*
整个项目的api接口统一管理

*/
import { pa } from 'element-plus/es/locale/index.mjs'
import request from './request'

export default{
    getPostData: () => {
      return request({
        url: `/article/findByPage`,
        method: 'get',
      })
    },
    getCategoryInfo:() =>{
      return request({
        url: `/categoryInfo/getAllCategoryInfo`,
        method: 'get',
      })
    },
    getArticleListByName:(categoryName) =>{
      return request({
        url: `/articleList/getArticleListByName/${categoryName}`,
        method: 'get',
      })
    },
    getArticleList:() =>{
      return request({
        url: `/articleList/getArticleList`,
        method: 'get',
      })
    },
    getArticleDetailById:(postID) =>{
      return request({
        url: `/articleList/getArticleDetailById/${postID}`,
        method: 'get',
      })
    },
    
    
    
}