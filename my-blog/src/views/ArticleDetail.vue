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
                <span class="value">{{ article.category }}</span>
              </div>
              <div class="info-item">
                <span class="label">Reading Time:</span>
                <span class="value">{{ estimatedReadingTime }} mins</span>
              </div>
              <div class="info-item">
                <span class="label">Word Count:</span>
                <span class="value">{{ wordCount }} words</span>
              </div>
            </div>
            <!-- 右边的简介 -->
            <div class="article-summary">
              <div class="summary-title">Summary</div>
              <div class="summary-content">{{ article.summary }}</div>
            </div>
          </div>
        </el-card>
        <el-card class="article-detail">
          <div class="md-preview-container">
            <MdPreview :editorId="id" :modelValue="text" theme="dark" />
          </div>
        </el-card>
      </div>
    </el-main>
    <el-button  
      type="primary"  
      icon="el-icon-arrow-up"  
      v-show="isScrolled"  
      @click="scrollToTop"  
      class="scroll-to-top"  
    >  
      Top 
    </el-button>  
  </el-container>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import Header from '../components/Header.vue';
import { useRoute } from 'vue-router';
import { MdPreview } from 'md-editor-v3';
import 'md-editor-v3/lib/preview.css';
import { onUnmounted } from 'vue';  

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

const id = 'preview-only';
const text = ref('# 科技化布局\n这是一篇关于科技化布局的文章，详细探讨了如何使用 Vue 和 Element Plus 进行布局设计。\n ```java \nprint```# 科技化布局\n这是一篇关于科技化布局的文章，详细探讨了如何使用 Vue 和 Element Plus 进行布局设计。\n ```java \nprint```# 科技化布局\n这是一篇关于科技化布局的文章，详细探讨了如何使用 Vue 和 Element Plus 进行布局设计。\n ```java \nprint```# 科技化布局\n这是一篇关于科技化布局的文章，详细探讨了如何使用 Vue 和 Element Plus 进行布局设计。\n ```java \nprint```# 科技化布局\n这是一篇关于科技化布局的文章，详细探讨了如何使用 Vue 和 Element Plus 进行布局设计。\n ```java \nprint```# 科技化布局\n这是一篇关于科技化布局的文章，详细探讨了如何使用 Vue 和 Element Plus 进行布局设计。\n ```java \nprint```# 科技化布局\n这是一篇关于科技化布局的文章，详细探讨了如何使用 Vue 和 Element Plus 进行布局设计。\n ```java \nprint```# 科技化布局\n这是一篇关于科技化布局的文章，详细探讨了如何使用 Vue 和 Element Plus 进行布局设计。\n ```java \nprint```');
const route = useRoute();
const article = ref({
  title: '科技化布局',
  author: 'Ford',
  category: 'Tech',
  summary: '这是一篇关于科技化布局的文章，详细探讨了如何使用 Vue 和 Element Plus 进行布局设计。',
  content: '# 小天才'
});

const wordCount = computed(() => text.value.length);
const estimatedReadingTime = computed(() => Math.ceil(wordCount.value / 200));
</script>

<style scoped>



.scroll-to-top {
  position: fixed;
  bottom: 100px;
  right: 150px;
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




.el-main{
  padding: 0px;
}
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: calc(100vh - 60px);
  /* padding: 20px; */
  background-image: url('@/assets/img/ArticleDetailBack.png'); /* 设置背景图片 */
  background-size: cover; /* 调整背景图片大小 */
  background-position: center; /* 调整背景图片位置 */
  background-repeat: no-repeat; /* 防止背景图片重复 */
  background-attachment: fixed; /* 背景图片保持不动 */
}

.article-head {
  margin-top: 30px;
  width: 70%;
  padding: 20px;
  margin-bottom: 20px;
  background-color: rgba(82, 73, 73, 0.3); /* 设置背景颜色并调整透明度 */
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
  
}

.article-detail {
  width: 70%;
  /* padding: 20px; */
  margin-bottom: 20px;
  background-color: rgba(255, 255, 255, 0.02); /* 设置背景颜色并调整透明度 */
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
