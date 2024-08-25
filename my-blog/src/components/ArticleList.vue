<template>
  <div class="article-list">
    <ArticleCard v-for="article in articles" :key="article.id" :article="article" />
  </div>
</template>

<script setup>
import ArticleCard from './ArticleCard.vue';

const articles = [
  { id: 1, title: 'My First Blog', summary: 'This is the summary of my first blog.' },
  { id: 2, title: 'Learning Vue 3', summary: 'An introduction to Vue 3.' },
  { id: 3, title: 'My First Blog', summary: 'This is the summary of my first blog.' },
  { id: 4, title: 'Learning Vue 3', summary: 'An introduction to Vue 3.' },
  { id: 5, title: 'My First Blog', summary: 'This is the summary of my first blog.' },
  { id: 6, title: 'Learning Vue 3', summary: 'An introduction to Vue 3.' },
  // 更多文章数据
];
</script>

<style scoped>
.article-list {
  display: grid;
  
  grid-gap: 20px; /* 行间距和列间距都为20px */
  padding: 10px; /* 可选：增加一些内边距 */
  width: 80%;
  justify-content: center; /* 水平居中 */
  align-items: center; /* 垂直居中 */
}
</style>
