<template>
  <el-card class="article-card" shadow="hover" @click="goToDetail">
    <div class="card-content">
      <div class="image-container">
        <img :src="article.image" alt="Article Image" />
      </div>
      <div class="text-content">
        <h3>{{ article.title }}</h3>
        <p>{{ article.summary }}</p>
      </div>
    </div>
  </el-card>
</template>

<script setup>
import { useRouter } from 'vue-router';

const props = defineProps({
  article: {
    type: Object,
    required: true,
  },
});

const router = useRouter();
const goToDetail = () => {
  router.push(`/article/${props.article.id}`);
};
</script>

<style scoped>
.article-card {
  cursor: pointer;
  transition: transform 0.3s;
  width: 1000px;
  height: 250px;
  /* margin: 10px auto; */
}

.article-card:hover {
  transform: scale(1.02);
}

.card-content {
  display: flex;
  align-items: center;
}

.image-container {
  flex: 0 0 200px; /* 固定图片区域宽度 */
  margin-right: 20px;
}

.image-container img {
  width: 100%;
  height: auto;
  border-radius: 8px;
}

.text-content {
  flex: 1; /* 右侧文本区域占据剩余空间 */
}

h3 {
  color: #409EFF;
  margin-bottom: 10px;
}

p {
  color: #666;
}
</style>
