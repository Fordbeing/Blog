import { createRouter, createWebHashHistory } from 'vue-router';
import axios from 'axios';

// 从 localStorage 获取认证状态
const isAuthenticated = () => {
  const token = localStorage.getItem('authToken');
  return token && token !== '';
};

// 定义路由
const routes = [
  {
    path: '/login',
    name: "login",
    component: () => import("@/views/Login.vue"),
  },
  {
    path: '/',
    name: "main",
    component: () => import("@/views/Main.vue"),
    redirect: '/home',
    children: [
      {
        path: 'home',
        name: "home",
        component: () => import("@/views/Home.vue"),
      },
      {
        path: 'user',
        name: "user",
        component: () => import("@/views/User.vue"),
      },
      {
        path: 'category',
        name: "category",
        component: () => import("@/views/CategoryManage.vue"),
      },
      {
        path: 'articleManage',
        name: "articleManage",
        component: () => import("@/views/ArticleManage.vue"),
      },
      {
        path: 'articleRelease',
        name: "articleRelease",
        component: () => import("@/views/ArticleRelase.vue"),
      },
      {
        path: 'commentManage',
        name: "commentManage",
        component: () => import("@/views/CommentManage.vue"),
      },
      {
        path: 'uploadPictureManage',
        name: "uploadPictureManage",
        component: () => import("@/views/UploadPictureManage.vue"),
      },
      {
        path: 'pictureCategoryManage',
        name: "pictureCategoryManage",
        component: () => import("@/views/PictureCategoryManage.vue"),
      }
    ]
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/login',
  }
];

// 创建路由实例
const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

// 添加路由守卫
// router.beforeEach((to, from, next) => {
//   if (to.path === '/login') {
//     next();
//   } else {
//     const token = localStorage.getItem('authToken');
//     if (isAuthenticated()) {
//       // 设置默认的请求头
//       axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
//       next();
//     } else {
//       next('/login');
//     }
//   }
// });

// // 处理JWT过期的情况
// axios.interceptors.response.use(
//   response => response,
//   error => {
//     if (error.response && error.response.status === 401) {
//       // 当JWT过期或无效时，清除登录状态并重定向到登录页
//       localStorage.removeItem('authToken');
//       localStorage.removeItem('isAuthenticated');
//       delete axios.defaults.headers.common['Authorization'];
//       router.push('/login');
//     }
//     return Promise.reject(error);
//   }
// );

export default router;
