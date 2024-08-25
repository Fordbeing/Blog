<template>
    <el-container>
      <el-header>
        <Header />
      </el-header>
  
      <el-main>
        <div class="container">
          <div class="comment-section">
            <!-- 弹幕区域 -->
            <div class="danmaku-container">
              <transition-group name="danmaku" tag="div">
                <div
                  v-for="(comment, index) in comments"
                  :key="index"
                  class="danmaku-item"
                  :style="{ top: comment.top + 'px', left: comment.left + 'px' }"
                >
                  <span>{{ comment.text }}</span>
                  <el-button 
                    type="primary" 
                    icon="el-icon-thumb" 
                    @click="likeComment(index)" 
                    size="mini" 
                    class="like-button"
                  ></el-button>
                </div>
              </transition-group>
            </div>
  
            <!-- 评论发表区域 -->
            <div class="comment-input">
              <el-input 
                v-model="newComment" 
                placeholder="Enter your comment..." 
                class="comment-box"
              ></el-input>
              <el-button 
                type="primary" 
                @click="submitComment" 
                class="submit-button"
              >Submit</el-button>
            </div>
          </div>
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
  import { ref, onMounted, onUnmounted } from 'vue';
  import Header from '../components/Header.vue';
  
  const isScrolled = ref(false);
  const comments = ref([]);
  const newComment = ref('');
  const intervalId = ref(null);
  
  // Handle scroll event
  const handleScroll = () => {
    isScrolled.value = window.scrollY > 100;
  };
  
  // Scroll to top function
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };
  
  // Handle adding a new comment
  const submitComment = () => {
    if (newComment.value.trim() !== '') {
      comments.value.push({
        text: newComment.value,
        top: Math.random() * (window.innerHeight / 2), // 只在屏幕的上半部分随机出现
        left: window.innerWidth,
        speed: 1, // 固定速度
      });
      newComment.value = '';
  
      // 立即移动新添加的弹幕
      moveDanmaku();
  
      // 如果没有定时器，则创建一个
      if (!intervalId.value) {
        intervalId.value = setInterval(() => {
          moveDanmaku();
        }, 16);
      }
    }
  };
  
  // Move the danmaku
  const moveDanmaku = () => {
    comments.value.forEach((comment, index) => {
      comment.left -= comment.speed;
      if (comment.left < -200) {
        comments.value.splice(index, 1);
      }
    });
  
    // 如果没有弹幕，则停止定时器
    if (comments.value.length === 0) {
      clearInterval(intervalId.value);
      intervalId.value = null;
    }
  };
  
  // Like comment function
  const likeComment = (index) => {
    alert(`Liked comment: ${comments.value[index].text}`);
  };
  
  // Setup intervals and event listeners
  onMounted(() => {
    window.addEventListener('scroll', handleScroll);
  });
  
  onUnmounted(() => {
    window.removeEventListener('scroll', handleScroll);
    if (intervalId.value) {
      clearInterval(intervalId.value);
    }
  });
  </script>
  
  <style scoped>
  .container {
    display: flex;
    flex-direction: column;
    align-items: center;
    min-height: calc(100vh - 60px);
    background-image: url('@/assets/img/ArticleDetailBack.png');
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    background-attachment: fixed;
  }
  
  .comment-section {
    position: relative;
    width: 100%;
    height: 500px;
  }
  
  .danmaku-container {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    overflow: hidden;
    pointer-events: none;
  }
  
  .danmaku-item {
    position: absolute;
    white-space: nowrap;
    font-size: 20px;
    color: #ffffff;
    display: flex;
    align-items: center;
  }
  
  .like-button {
    margin-left: 10px;
  }
  
  .comment-input {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 650px;
  }
  
  .el-main {
    padding: 0px;
  }
  
  .comment-box {
    max-width: 400px;
    margin-right: 10px;
  }
  
  .submit-button {
    background: linear-gradient(135deg, #815f5f, #8d3636);
    color: #fff;
    border-radius: 20px;
    padding: 10px 20px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  }
  
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
  </style>
  