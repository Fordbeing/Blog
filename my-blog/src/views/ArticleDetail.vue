<template>
  <el-container>
    <el-header>
      <Header />
    </el-header>
    
    <el-main>
      <el-card class="article-detail">
        <h2>{{ article.title }}</h2>
        <edmitor-vue3 v-model="article.content" readonly />
      </el-card>
    </el-main>
  </el-container>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import Header from '../components/Header.vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const article = ref({ title: '', content: '' });

onMounted(() => {
  const articleId = route.params.id;
  // 模拟数据获取
  if (articleId === '1') {
    article.value = { title: 'My First Blog', content: '## This is the content of my first blog.' };
  }
});
</script>

<style scoped>
.article-detail {
  padding: 20px;
}
h2 {
  margin-bottom: 20px;
  font-size: 24px;
}
</style>
