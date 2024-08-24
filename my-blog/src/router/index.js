import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/Home.vue';
import ArticleDetail from '../views/ArticleDetail.vue';

const routes = [
  { path: '/', component: Home },
  { path: '/article/:id', component: ArticleDetail },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
