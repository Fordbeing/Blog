<template>
  <el-card class="article-card" shadow="hover" @click="goToDetail">
    <div class="card-content">
      <!-- 左侧图片区域 -->
      <div class="image-container">
        <img src="@/assets/img/ArticleImg.jpg" alt="Article Image" />
      </div>

      <!-- 中间文字信息区域 -->
      <div class="info-container">
        <div>
          <h2>{{ article.title }}</h2>
          <p><strong>Author:</strong><span class="value"> {{ article.author }}</span> </p>
          <p><strong>Category: </strong> <span class="value">{{ article.categoryName }} </span></p>
          <p><strong>Reading Time:  </strong> <span class="value">{{ article.readingTime }} mins</span> </p>
          <p><strong>Word Count: </strong> <span class="value">{{ article.wordCount }}  Words</span></p>
          <p><strong>Release Date: </strong> <span class="value">{{ formatDate(article.publishDate) }} </span></p>
        </div>
      </div>

      <!-- 右侧摘要简介区域 -->
      <div class="summary-container">
        <p>{{ article.summary }}</p>
      </div>
    </div>
  </el-card>
</template>

<script setup>
import { useRouter } from 'vue-router';


// 日期格式
const formatDate = (dateString) => {
  const date = new Date(dateString);

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};

const props = defineProps({
  article: {
    type: Object,
    required: true,
  },
});

const router = useRouter();
const goToDetail = () => {
  router.push(`/article/${props.article.postID}`);
};
</script>

<style scoped>

.value {
  font-weight: bold;
  font-size: 16px;
  color: #56928d;
  /* font-family: 'Orbitron', sans-serif; */
}

.article-card {
  cursor: pointer;
  transition: transform 0.3s;
  width: 1000px;
  height: 250px;
  background-color: rgba(12, 11, 11, 0.6); /* 设置背景颜色透明度 */
  border: none; /* 可选：移除边框 */
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1); /* 可选：为卡片添加阴影 */
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
  height: 150px;
  border-radius: 8px;
}

.info-container {
  
  flex: 1; /* 中间信息区域占据剩余空间 */
  padding: 0 20px;
}

.summary-container {
  flex: 1; /* 右侧摘要区域占据剩余空间 */
  padding: 0 20px;
}

h2 {
  color: #4789e0;
  margin-bottom: 10px;
}

p {
  color: #a87c96;
}
</style>
