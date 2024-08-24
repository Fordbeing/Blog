<template>
  <el-container>
    <el-header>
      <Header />
    </el-header>
    
    <el-main>
      <div class="container">
        <el-card class="article-head">
          <h2>{{ article.title }}</h2>
        </el-card>
        <el-card class="article-detail">
          <MdPreview :editorId="id" :modelValue="text" theme="dark" />
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
import { ref, onMounted } from 'vue';
import Header from '../components/Header.vue';
import { useRoute } from 'vue-router';
import { MdPreview, MdCatalog } from 'md-editor-v3';
import 'md-editor-v3/lib/preview.css';
import { onUnmounted } from 'vue';  
  
// ... 其他代码 ...  
  
const isScrolled = ref(false);  
  
// 监听滚动事件  
const handleScroll = () => {  
  isScrolled.value = window.scrollY > 100; // 当滚动超过100px时显示按钮  
};  
  
// 滚动到顶部  
const scrollToTop = () => {  
  window.scrollTo({  
    top: 0,  
    behavior: 'smooth', // 平滑滚动  
  });  
};  
  
// 组件挂载时添加监听器  
onMounted(() => {  
  window.addEventListener('scroll', handleScroll);  
});  
  
// 组件卸载时移除监听器  
onUnmounted(() => {  
  window.removeEventListener('scroll', handleScroll);  
});  

const id = 'preview-only';
const text = ref('# Hello Editor v3\n\nWelcome to use md-editor-v3! # Hello Editor v3\n\nWelcome to use md-editor-v3! # Hello Editor v3\n\nWelcome to use md-editor-v3! # Hello Editor v3\n\nWelcome to use md-editor-v3! # Hello Editor v3\n\nWelcome to use md-editor-v3! # Hello Editor v3\n\nWelcome to use md-editor-v3! # Hello Editor v3\n\nWelcome to use md-editor-v3! # Hello Editor v3\n\nWelcome to use md-editor-v3! # Hello Editor v3\n\nWelcome to use md-editor-v3! # Hello Editor v3\n\nWelcome to use md-editor-v3! # Hello Editor v3\n\nWelcome to use md-editor-v3! # Hello Editor v3\n\nWelcome to use md-editor-v3! # Hello Editor v3\n\nWelcome to use md-editor-v3! # Hello Editor v3\n\nWelcome to use md-editor-v3! # Hello Editor v3\n\nWelcome to use md-editor-v3! # Hello Editor v3\n\nWelcome to use md-editor-v3! # Hello Editor v3\n\nWelcome to use md-editor-v3! # Hello Editor v3\n\nWelcome to use md-editor-v3! # Hello Editor v3\n\nWelcome to use md-editor-v3! # Hello Editor v3\n\nWelcome to use md-editor-v3! # Hello Editor v3\n\nWelcome to use md-editor-v3! # Hello Editor v3\n\nWelcome to use md-editor-v3! # Hello Editor v3\n\nWelcome to use md-editor-v3! # Hello Editor v3\n\nWelcome to use md-editor-v3! # Hello Editor v3\n\nWelcome to use md-editor-v3! # Hello Editor v3\n\nWelcome to use md-editor-v3! # Hello Editor v3\n\nWelcome to use md-editor-v3! # Hello Editor v3\n\nWelcome to use md-editor-v3! # Hello Editor v3\n\nWelcome to use md-editor-v3! # Hello Editor v3\n\nWelcome to use md-editor-v3! # Hello Editor v3\n\nWelcome to use md-editor-v3! # Hello Editor v3\n\nWelcome to use md-editor-v3! # Hello Editor v3\n\nWelcome to use md-editor-v3! # Hello Editor v3\n\nWelcome to use md-editor-v3! # Hello Editor v3\n\nWelcome to use md-editor-v3! # Hello Editor v3\n\nWelcome to use md-editor-v3! # Hello Editor v3\n\nWelcome to use md-editor-v3! # Hello Editor v3\n\nWelcome to use md-editor-v3! # Hello Editor v3\n\nWelcome to use md-editor-v3! # Hello Editor v3\n\nWelcome to use md-editor-v3! ');
const scrollElement = document.documentElement;

const route = useRoute();
const article = ref({ title: '', content: '# 小天才' });

onMounted(() => {
  const articleId = route.params.id;
  console.log(articleId);
  // 模拟数据获取
  if (articleId === '1') {
    article.value = { title: 'My First Blog', content: '## This is the content of my first blog.' };
  }
});
</script>

<style scoped>

.scroll-to-top {
  position: fixed;
  bottom: 100px;
  right: 150px;
  width: 100px; /* 调整尺寸 */
  height: 100px; /* 调整尺寸 */
  border-radius: 50%;
  background: linear-gradient(135deg, #815f5f, #8d3636);
  color: #241036;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  transition: background 0.3s, transform 0.3s, box-shadow 0.3s;
  z-index: 1000;
  font-family: 'Orbitron', sans-serif; /* 使用科技感字体 */
  font-size: 25px; /* 调整字体大小 */
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
  font-size: 24px; /* 调整图标大小 */
}


.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  /* justify-content: center; */ /* Center vertically */
  min-height: calc(100vh - 64px); /* Adjust for header height */
  padding: 20px;
}

.article-head {
  /* margin-top: -500px; */
  width: 70%;
  padding: 20px;
  /* height: 100%; */
  margin-bottom: 20px; /* Add space between cards */
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1); /* Subtle shadow for better visual separation */
}

.article-detail {
  width: 70%;
  padding: 20px;
  /* height: 100%; */
  margin-bottom: 20px; /* Add space between cards */
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1); /* Subtle shadow for better visual separation */
}

h2 {
  margin: 0 0 20px;
  font-size: 24px;
  text-align: center; /* Center align title text */
}
</style>
