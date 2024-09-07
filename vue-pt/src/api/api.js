/*
整个项目的api接口统一管理

*/
import { pa } from 'element-plus/es/locale/index.mjs'
import request from './request'

// 请求首页左侧的表格
export default{
  login: (loginDto) => {
    return request({
      url: `/api/index/login`,
      method: 'post',
      data: loginDto
    })
  },
    getTableData: () => {
      return request({
        url: '/api/manager/getAll',
        method: 'get',
      })
    },
    getUserData: (current,limit) => {
      return request({
        url: `/api/manager/findByPage/${current}/${limit}`,
        method: 'get',
      })
    },
    updateUser(manager) {
      return request({
        url: `/api/manager/updateManager`,
        method: 'put',
        data: manager,
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
    },
    getByUsernameAndEmail: (username,email) => {
      return request({
        url: `/api/manager/getByUsernameAndEmail/${username}/${email}`,
        method: 'get',
      })
    },
    deleteUser: (id) => {
      return request({
        url: `/api/manager/deleteById/${id}`,
        method: 'delete',
      })
    },

    savePost: (postDto) => {
      return request({
        url: `/api/article/savePost`,
        method: 'post',
        data: postDto
      })
    },
    getPostData: (current,limit) => {
      return request({
        url: `/api/article/findByPage/${current}/${limit}`,
        method: 'get',
      })
    },
    getPostCategoryList: () => {  // 获取分类列表
      return request({
        url: `/api/category/getPostCategoryList`,
        method: 'get',
      })
    },
    getAllPostByLabel: (label,current,limit) => {
      return request({
        url: `/api/article/getAllPostByLabel/${label}/${current}/${limit}`,
        method: 'get',
      })
    },
    deletePost: (id) => {
      return request({
        url: `/api/article/deletePost/${id}`,
        method: 'delete',
      })
    },
    GetPostByTitle: (postTitle,author) => {
      return request({
        url: `/api/article/GetPostByTitle/${postTitle}/${author}`,
        method: 'get',
      })
    },
    PostUpdate: (postVO) => {
      return request({
        url: `/api/article/updatePost`,
        method: 'put',
        data: postVO
      })
    },
    saveUser(manager) {
      return request({
        url: `/api/manager/AvatarUpload`,
        method: 'post',
        data: manager,
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
    },
    uploadImage(file) {
      return request({
        url: `/api/article/uploadImage`,
        method: 'post',
        data: file,
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
    },
    handleContinueArticle: (aiDto1) => {  // 调用AI接口，续写文章内容
      return request({
        url: `/api/article/handleContinueArticle`,
        method: 'post',
        data: aiDto1
      })
    },
    handleOptimizeArticle: (aiDto1) => {  // 调用AI接口，优化文章内容
      return request({
        url: `/api/article/handleOptimizeArticle`,
        method: 'post',
        data: aiDto1
      })
    },
    getSummary: (aiDto1) => {  // 调用AI接口，获得简介内容
      return request({
        url: `/api/article/getSummary`,
        method: 'post',
        data: aiDto1
      })
    },
    // 分类管理
    getCategoryList: (page,limit) => {  // 获取分类列表
      return request({
        url: `/api/category/getCategoryList/${page}/${limit}`,
        method: 'get',
      })
    },
    addCategory: (category) => {  // 添加分类
      return request({
        url: `/api/category/addCategory`,
        method: 'post',
        data: category
      })
    },
    deleteCategory: (categoryID) => {  // 删除分类
      return request({
        url: `/api/category/deleteCategory/${categoryID}`,
        method: 'delete',
      })
    },
    updateCategory: (category) => {  // 更新分类
      return request({
        url: `/api/category/updateCategory`,
        method: 'put',
        data: category
      })
    },
    updateCategoryStatus: (categoryID,status) => {  // 更新分类状态
      return request({
        url: `/api/category/updateCategoryStatus/${categoryID}/${status}`,
        method: 'put',
      })
    },
    updatePostStatus: (postID,status) => {  // 更新文章状态
      return request({
        url: `/api/article/updatePostStatus/${postID}/${status}`,
        method: 'put',
      })
    },
    getAllComment: (page,limit) => {  // 得到所有评论
      return request({
        url: `/api/comment/getAllComment/${page}/${limit}`,
        method: 'get',
      })
    },
    UpdateCommentStatus: (commentID,status) => {  // 更新评论状态
      return request({
        url: `/api/comment/UpdateCommentStatus/${commentID}/${status}`,
        method: 'put',
      })
    },
    DeleteComment: (commentID) => {  // 删除评论
      return request({
        url: `/api/comment/DeleteComment/${commentID}`,
        method: 'delete',
      })
    },
    getAllPicture: () => {  // 得到所有图片
      return request({
        url: `/api/fileUpload/getAllPicture`,
        method: 'get',
      })
    },
    UpdatePictureStatus: (imageId,status) => {  // 更新图片状态
      return request({
        url: `/api/fileUpload/UpdatePictureStatus/${imageId}/${status}`,
        method: 'put',
      })
    },
    DeletePicture: (imageId) => {  // 删除图片
      return request({
        url: `/api/fileUpload/DeletePicture/${imageId}`,
        method: 'delete',
      })
    },
    UploadPicture(picture) {
      return request({
        url: `/api/fileUpload/UploadPicture`,
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
        url: `/api/pictureCategory/getPictureCategoryList/${page}/${limit}`,
        method: 'get',
      })
    },
    getAllPictureByLabel: (label) => {  // 获取分类列表
      return request({
        url: `/api/fileUpload/getAllPictureByLabel/${label}`,
        method: 'get',
      })
    },
    addPictureCategory: (category) => {  // 添加分类
      return request({
        url: `/api/pictureCategory/addPictureCategory`,
        method: 'post',
        data: category
      })
    },
    deletePictureCategory: (categoryID) => {  // 删除分类
      return request({
        url: `/api/pictureCategory/deletePictureCategory/${categoryID}`,
        method: 'delete',
      })
    },
    updatePictureCategory: (category) => {  // 更新分类
      return request({
        url: `/api/pictureCategory/updatePictureCategory`,
        method: 'put',
        data: category
      })
    },
    updatePictureCategoryStatus: (categoryID,status) => {  // 更新分类状态
      return request({
        url: `/api/pictureCategory/updatePictureCategoryStatus/${categoryID}/${status}`,
        method: 'put',
      })
    },
    FileGetPictureCategoryList: () => {  // 获取分类列表
      return request({
        url: `/api/pictureCategory/FileGetPictureCategoryList`,
        method: 'get',
      })
    },
    getCategoryArticleCount: () => {  // 获取每个分类的文章数量
      return request({
        url: `/api/category/getCategoryArticleCount`,
        method: 'get',
      })
    },
    getCategoryPictureCount: () => {  // 获取每个分类的图片数量
      return request({
        url: `/api/pictureCategory/getCategoryPictureCount`,
        method: 'get',
      })
    },
}