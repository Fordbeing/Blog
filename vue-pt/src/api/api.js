/*
整个项目的api接口统一管理

*/
import { pa } from 'element-plus/es/locale/index.mjs'
import request from './request'

// 请求首页左侧的表格
export default{
    getTableData: () => {
      return request({
        url: '/manager/getAll',
        method: 'get',
      })
    },
    getCountData: () => {
      return request({
        url: '/home/getCountData/',
        method: 'get',
        mock:true
      })
    },
    getChartData: () => {
      return request({
        url: '/home/getChartData/',
        method: 'get',
        mock:true
      })
    },
    getUserData: (current,limit) => {
      return request({
        url: `/manager/findByPage/${current}/${limit}`,
        method: 'get',
      })
    },
    deleteUser: (id) => {
      return request({
        url: `/manager/deleteById/${id}`,
        method: 'delete',
      })
    },
    savePost: (postDto) => {
      return request({
        url: `/article/savePost`,
        method: 'post',
        data: postDto
      })
    },
    getPostData: (current,limit) => {
      return request({
        url: `/article/findByPage/${current}/${limit}`,
        method: 'get',
      })
    },
    deletePost: (id) => {
      return request({
        url: `/article/deletePost/${id}`,
        method: 'delete',
      })
    },
    GetPostByTitle: (postTitle,author) => {
      return request({
        url: `/article/GetPostByTitle/${postTitle}/${author}`,
        method: 'get',
      })
    },
    PostUpdate: (postVO) => {
      return request({
        url: `/article/updatePost`,
        method: 'put',
        data: postVO
      })
    },
    SaveUser: (manager) => {
      return request({
        url: `/manager/addManager`,
        method: 'post',
        data: manager
      })
    },
    
}