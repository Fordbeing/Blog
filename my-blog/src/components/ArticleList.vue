<template>
  <div class="article-list">
    <ArticleCard v-for="article in articles" :key="article.postID" :article="article" />
  </div>
</template>

<script setup>
import { ref, watch, onMounted, getCurrentInstance } from 'vue';
import { useAllDataStore } from '@/stores';
import ArticleCard from './ArticleCard.vue';

const { proxy } = getCurrentInstance();
const dataStore = useAllDataStore();

const articles = ref([]);

const getArticleListByName = async (categoryName) => {
  if(categoryName !== ""){
    const data = await proxy.$api.getArticleListByName(categoryName); // 使用 await 等待数据返回
    articles.value = data;
  }else{
    getArticleList()
  }
  
  
};

const getArticleList = async () => {
  const data = await proxy.$api.getArticleList(); // 使用 await 等待数据返回
  articles.value = data;
};


watch(
  () => dataStore.state.category,
  (newData) => {
    if (newData !== "") {
      getArticleListByName(dataStore.state.category);
    }else{
      getArticleList();
    }
  }
);

onMounted(() => {
  getArticleListByName(dataStore.state.category);
});
</script>

<style scoped>
.article-list {
  display: grid;
  grid-gap: 20px;
  padding: 10px;
  width: 80%;
  justify-content: center;
  align-items: center;
}
</style>
