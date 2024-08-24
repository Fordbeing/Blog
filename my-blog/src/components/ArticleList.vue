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
  // 更多文章数据
];
</script>

<style scoped>
.article-list {
  display: grid;
  grid-template-columns: 1fr; /* 只有一列，所有文章卡片在同一列上 */
  grid-gap: 20px; /* 行间距和列间距都为20px */
  padding: 10px; /* 可选：增加一些内边距 */
  margin-left: 400px;
}
</style>
