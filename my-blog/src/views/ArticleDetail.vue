<template>
  <el-container>
    <el-header>
      <Header />
    </el-header>

    <el-main>
      <div class="container">
        <el-card class="article-head">
          <div class="article-head-content">
            <!-- 左边的文章信息 -->
            <div class="article-info">
              <div class="info-item">
                <span class="label">Author:</span>
                <span class="value">{{ article.author }}</span>
              </div>
              <div class="info-item">
                <span class="label">Title:</span>
                <span class="value">{{ article.title }}</span>
              </div>
              <div class="info-item">
                <span class="label">Category:</span>
                <span class="value">{{ article.categoryName }}</span>
              </div>
              <div class="info-item">
                <span class="label">Reading Time:</span>
                <span class="value">{{ article.readingTime }} mins</span>
              </div>
              <div class="info-item">
                <span class="label">Word Count:</span>
                <span class="value">{{ article.wordCount }} words</span>
              </div>
              <div class="info-item">
                <span class="label">Release Date:</span>
                <span class="value">{{ formatDate(article.publishDate) }} </span>
              </div>
              <div class="info-item">
                <span class="label">Views</span>
                <span class="value">{{ article.views }} times</span>
              </div>
            </div>
            <!-- 右边的简介 -->
            <div class="article-summary">
              <div class="summary-title">Summary</div>
              <div class="summary-content">{{ article.summary }}</div>
              <div class="info-item">
                <span class="label">Action:</span>
                <span class="value">点赞：{{ article.likes }} </span>
                <span class="value">
                  <el-button type="text" @click="shareLink" class="share-button">Share</el-button>
                </span>
              </div>
            </div>
          </div>
        </el-card>
        <el-card class="article-detail">
          <div class="md-preview-container">
            <MdPreview :editorId="id" :modelValue="article.content" theme="dark" />
          </div>
        </el-card>
      </div>
    </el-main>
    <el-button type="primary" icon="el-icon-arrow-up" v-show="isScrolled" @click="scrollToTop" class="scroll-to-top">
      TOP
    </el-button>

    <el-button type="primary" icon="el-icon-arrow-up" v-show="isScrolled" @click="LikeBtn" class="like">
      Like
    </el-button>
    <!-- 动态生成的 +1 动画效果 -->
    <transition name="fade">
      <div v-if="showPlusOne" class="plus-one">+1</div>
    </transition>

  </el-container>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import Header from '../components/Header.vue';
import { useRoute } from 'vue-router';
import { MdPreview } from 'md-editor-v3';
import { ElMessage, ElMessageBox } from 'element-plus'
import 'md-editor-v3/lib/preview.css';
import { onUnmounted, getCurrentInstance } from 'vue';
const { proxy } = getCurrentInstance();


// 分享文章
const shareLink = () => {
  const url = window.location.href;
  navigator.clipboard.writeText(url).then(() => {
    ElMessage({
      type: 'success',
      message: 'Link Copy Success',
    });

  }).catch((err) => {
    ElMessage({
      type: 'error',
      message: 'Copy Failed',
    });
  });
};


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


const isScrolled = ref(false);
const handleScroll = () => {
  isScrolled.value = window.scrollY > 100;
};
const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth',
  });
};
onMounted(() => {
  window.addEventListener('scroll', handleScroll);
});
onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
});
const showPlusOne = ref(false);

const LikeBtn = () => {
  article.value.likes += 1;
  showPlusOne.value = true;
  setTimeout(() => {
    showPlusOne.value = false;
  }, 800);  // 动画显示时间
}

const id = 'preview-only';
const route = useRoute();
const articleId = route.params.id;

const article = ref({});


const getArticleDetailById = async (postID) => {
  const data = await proxy.$api.getArticleDetailById(postID)
  article.value = data
  article.value.views += 1;

}

onMounted(() => {
  getArticleDetailById(articleId);
});

</script>

<style scoped>


.share-button {
  color: #17b3a6;
  font-weight: bold;
  font-size: 16px;
  padding: 0;
}

.share-button:hover {
  color: #0d8a75;
}



.scroll-to-top {
  position: fixed;
  bottom: 100px;
  right: 100px;
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background: linear-gradient(135deg, #815f5f, #8d3636);
  color: #241036;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  transition: background 0.3s, transform 0.3s, box-shadow 0.3s;
  z-index: 1000;
  font-family: 'Orbitron', sans-serif;
  font-size: 25px;
  display: flex;
  align-items: center;
  font-weight: bold;
  justify-content: center;
  padding: 0;
}

.scroll-to-top:hover {
  background: linear-gradient(135deg, #50697a, #174385);
  transform: scale(1.1);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.3);
}

.scroll-to-top .el-icon-arrow-up {
  font-size: 24px;
}

.el-main {
  padding: 20px;
  /* 调整或恢复内边距，确保内容有足够的空间 */
}

.container {
  min-height: 100vh;
  /* 确保容器至少与视口高度相同，允许滚动 */
}


.like {
  position: fixed;
  bottom: 230px;
  right: 100px;
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background: linear-gradient(135deg, #50697a, #174385);

  color: #241036;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  transition: background 0.3s, transform 0.3s, box-shadow 0.3s;
  z-index: 1000;
  font-family: 'Orbitron', sans-serif;
  font-size: 25px;
  display: flex;
  align-items: center;
  font-weight: bold;
  justify-content: center;
  padding: 0;
}

.like:hover {
  background: linear-gradient(135deg, #50697a, #174385);
  transform: scale(1.1);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.3);
}

.like .el-icon-arrow-up {
  font-size: 24px;
}


/* +1 动画效果 */
.plus-one {
  position: fixed;
  bottom: 350px;
  right: 135px;
  animation: moveUp 1s ease-in-out;
  font-weight: bold;
  font-size: 24px;
  color: #17b3a6;
}

/* +1 的动画效果定义 */
@keyframes moveUp {
  from {
    transform: translateY(0);
    opacity: 1;
  }

  to {
    transform: translateY(-50px);
    opacity: 0;
  }
}


.el-main {
  padding: 0px;
}

.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: calc(100vh - 60px);
  /* padding: 20px; */
  background-image: url('@/assets/img/ArticleDetailBack.png');
  /* 设置背景图片 */
  background-size: cover;
  /* 调整背景图片大小 */
  background-position: center;
  /* 调整背景图片位置 */
  background-repeat: no-repeat;
  /* 防止背景图片重复 */
  background-attachment: fixed;
  /* 背景图片保持不动 */
}

.article-head {
  margin-top: 30px;
  width: 70%;
  padding: 0px;
  margin-bottom: 20px;
  background-color: rgba(82, 73, 73, 0.3);
  /* 设置背景颜色并调整透明度 */
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border: none;
}

.article-head-content {
  display: flex;
  justify-content: space-between;
}

.article-info {
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 45%;

}

.article-summary {
  width: 50%;
  /* padding: 10px; */
  background: rgba(0, 0, 0, 0.05);
  border-radius: 5px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  font-family: 'Orbitron', sans-serif;
  color: #333;
}

.summary-title {
  font-weight: bold;
  font-size: 18px;
  margin-bottom: 10px;
  color: #b34f4f;
}

.summary-content {
  font-size: 16px;
  color: #ad8181;
  height: 70%;
}

.article-detail {
  width: 70%;
  /* padding: 20px; */
  margin-bottom: 20px;
  background-color: rgba(255, 255, 255, 0.02);
  /* 设置背景颜色并调整透明度 */
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border: none;

}

.info-item {
  display: flex;
  justify-content: space-between;
  width: 100%;
  /* padding: 10px; */
  background: rgba(0, 0, 0, 0.05);
  border-radius: 5px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  font-family: 'Orbitron', sans-serif;
  color: #333;
}

.label {
  font-weight: bold;
  font-size: 14px;
  color: #b34f4f;
}

.value {
  font-weight: bold;
  font-size: 16px;
  color: #17b3a6;
}
</style>
