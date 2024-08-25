import { createRouter, createWebHistory } from 'vue-router';

const routes = [
  {
    path: '/',
    component: () => import("@/views/Home.vue"),
  },
  {
    path: '/article/:id',
    component: () => import("@/views/ArticleDetail.vue"),
  },
  {
    path:'/treeHole',
    component: () => import("@/views/TreeHole.vue"),
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
