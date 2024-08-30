<template>
    <el-container style="height: 100vh; position: relative;">
      <el-header>
        <Header />
      </el-header>
  
      <el-main class="main-content">
        
      </el-main>
      <el-aside class="aside">
        <PersonalInfo />
        <Information /> 
      </el-aside>
    </el-container>
  </template>
  
  <script setup>
  import Header from '../components/Header.vue';
  import PersonalInfo from '../components/PersonalInfo.vue';
  import ArticleList from '../components/ArticleList.vue';
  import Information from '../components/Information.vue';
  </script>
  
  <style scoped>
  el-header {
    background-color: #282c34;
    color: #ffffff;
    padding: 20px;
  }
  
  el-container {
    display: flex;
  }
  
  .main-content {
    background-color: #ffffff;
    padding: 20px; /* 增加内边距以防内容被 aside 遮挡 */
    background-image: url('@/assets/img/back.jpg'); /* 设置背景图片 */
    background-size: cover; /* 确保背景图片覆盖整个区域 */
    background-position: center; /* 使背景图片居中 */
    background-repeat: no-repeat; /* 防止背景图片重复 */
    position: relative;
  }
  
  .aside {
    background-color: rgba(15, 12, 12, 0.2); /* 设置背景颜色透明度 */
    padding: 20px;
    width: 400px; /* 调整宽度 */
    height: 800px; /* 调整高度 */
    box-shadow: -2px 0 5px rgba(0, 0, 0, 0.1);
    position: absolute; /* 绝对定位 */
    top: 90px; /* 距离顶部 30px */
    right: 30px; /* 距离右侧 30px */
  }
  
  @media (max-width: 768px) {
    el-aside {
      display: none;
    }
  }
  </style>
  