/*
整个项目的api接口统一管理

*/
import { pa } from 'element-plus/es/locale/index.mjs'
import request from './request'

// 请求首页左侧的表格
export default{
  login: (loginDto) => {
    return request({
      url: `/index/login`,
      method: 'post',
      data: loginDto
    })
  },
    getTableData: () => {
      return request({
        url: '/manager/getAll',
        method: 'get',
      })
    },
    getUserData: (current,limit) => {
      return request({
        url: `/manager/findByPage/${current}/${limit}`,
        method: 'get',
      })
    },
    updateUser(manager) {
      return request({
        url: `/manager/updateManager`,
        method: 'put',
        data: manager,
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
    },
    getByUsernameAndEmail: (username,email) => {
      return request({
        url: `/manager/getByUsernameAndEmail/${username}/${email}`,
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
    getPostCategoryList: () => {  // 获取分类列表
      return request({
        url: `/category/getPostCategoryList`,
        method: 'get',
      })
    },
    getAllPostByLabel: (label,current,limit) => {
      return request({
        url: `/article/getAllPostByLabel/${label}/${current}/${limit}`,
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
    saveUser(manager) {
      return request({
        url: `/manager/AvatarUpload`,
        method: 'post',
        data: manager,
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
    },
    handleContinueArticle: (aiDto1) => {  // 调用AI接口，续写文章内容
      return request({
        url: `/article/handleContinueArticle`,
        method: 'post',
        data: aiDto1
      })
    },
    handleOptimizeArticle: (aiDto1) => {  // 调用AI接口，优化文章内容
      return request({
        url: `/article/handleOptimizeArticle`,
        method: 'post',
        data: aiDto1
      })
    },
    getSummary: (aiDto1) => {  // 调用AI接口，获得简介内容
      return request({
        url: `/article/getSummary`,
        method: 'post',
        data: aiDto1
      })
    },
    // 分类管理
    getCategoryList: (page,limit) => {  // 获取分类列表
      return request({
        url: `/category/getCategoryList/${page}/${limit}`,
        method: 'get',
      })
    },
    addCategory: (category) => {  // 添加分类
      return request({
        url: `/category/addCategory`,
        method: 'post',
        data: category
      })
    },
    deleteCategory: (categoryID) => {  // 删除分类
      return request({
        url: `/category/deleteCategory/${categoryID}`,
        method: 'delete',
      })
    },
    updateCategory: (category) => {  // 更新分类
      return request({
        url: `/category/updateCategory`,
        method: 'put',
        data: category
      })
    },
    updateCategoryStatus: (categoryID,status) => {  // 更新分类状态
      return request({
        url: `/category/updateCategoryStatus/${categoryID}/${status}`,
        method: 'put',
      })
    },
    updatePostStatus: (postID,status) => {  // 更新文章状态
      return request({
        url: `/article/updatePostStatus/${postID}/${status}`,
        method: 'put',
      })
    },
    getAllComment: (page,limit) => {  // 得到所有评论
      return request({
        url: `/comment/getAllComment/${page}/${limit}`,
        method: 'get',
      })
    },
    UpdateCommentStatus: (commentID,status) => {  // 更新评论状态
      return request({
        url: `/comment/UpdateCommentStatus/${commentID}/${status}`,
        method: 'put',
      })
    },
    DeleteComment: (commentID) => {  // 删除评论
      return request({
        url: `/comment/DeleteComment/${commentID}`,
        method: 'delete',
      })
    },
    getAllPicture: () => {  // 得到所有图片
      return request({
        url: `/fileUpload/getAllPicture`,
        method: 'get',
      })
    },
    UpdatePictureStatus: (imageId,status) => {  // 更新图片状态
      return request({
        url: `/fileUpload/UpdatePictureStatus/${imageId}/${status}`,
        method: 'put',
      })
    },
    DeletePicture: (imageId) => {  // 删除图片
      return request({
        url: `/fileUpload/DeletePicture/${imageId}`,
        method: 'delete',
      })
    },
    UploadPicture(picture) {
      return request({
        url: `/fileUpload/UploadPicture`,
        method: 'post',
        data: picture,
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
    },
    // 图片分类管理
    getPictureCategoryList: (page,limit) => {  // 获取分类列表
      return request({
        url: `/pictureCategory/getPictureCategoryList/${page}/${limit}`,
        method: 'get',
      })
    },
    getAllPictureByLabel: (label) => {  // 获取分类列表
      return request({
        url: `/fileUpload/getAllPictureByLabel/${label}`,
        method: 'get',
      })
    },
    addPictureCategory: (category) => {  // 添加分类
      return request({
        url: `/pictureCategory/addPictureCategory`,
        method: 'post',
        data: category
      })
    },
    deletePictureCategory: (categoryID) => {  // 删除分类
      return request({
        url: `/pictureCategory/deletePictureCategory/${categoryID}`,
        method: 'delete',
      })
    },
    updatePictureCategory: (category) => {  // 更新分类
      return request({
        url: `/pictureCategory/updatePictureCategory`,
        method: 'put',
        data: category
      })
    },
    updatePictureCategoryStatus: (categoryID,status) => {  // 更新分类状态
      return request({
        url: `/pictureCategory/updatePictureCategoryStatus/${categoryID}/${status}`,
        method: 'put',
      })
    },
    FileGetPictureCategoryList: () => {  // 获取分类列表
      return request({
        url: `/pictureCategory/FileGetPictureCategoryList`,
        method: 'get',
      })
    },
    
}