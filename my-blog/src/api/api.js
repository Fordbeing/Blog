/*
整个项目的api接口统一管理

*/
import { pa } from 'element-plus/es/locale/index.mjs'
import request from './request'

export default{
    getPostData: () => {
      return request({
        url: `/api/article/findByPage`,
        method: 'get',
      })
    },
    getCategoryInfo:() =>{
      return request({
        url: `/api/categoryInfo/getAllCategoryInfo`,
        method: 'get',
      })
    },
    getArticleListByName:(categoryName) =>{
      return request({
        url: `/api/articleList/getArticleListByName/${categoryName}`,
        method: 'get',
      })
    },
    getArticleList:() =>{
      return request({
        url: `/api/articleList/getArticleList`,
        method: 'get',
      })
    },
    getArticleDetailById:(postID) =>{
      return request({
        url: `/api/articleList/getArticleDetailById/${postID}`,
        method: 'get',
      })
    },
    // 获取评论
    getAllComment:() =>{
      return request({
        url: `/api/comment/getAllComment`,
        method: 'get',
      })
    },
    // 添加评论
    addComment:(comment) =>{
      return request({
        url: `/api/comment/addComment`,
        method: 'post',
        data: comment
      })
    },
    // 分页获取评论
    
    getComments:(pageNum,pageSize) =>{
      return request({
        url: `/api/comment/getComments/${pageNum}/${pageSize}`,
        method: 'get',
      })
    },
    getAllPicture: () => {  // 得到所有图片
      return request({
        url: `/api/pictureInfo/getAllPicture`,
        method: 'get',
      })
    },
    
}