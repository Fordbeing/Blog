<template>
  <div class="home">
    <el-row :gutter="20">
      <!-- 左侧用户信息与表格 -->
      <el-col :span="8" class="left-section">
        <el-card shadow="hover" class="box-card">
          <div class="user">
            <img :src="userData.avatar" class="user-avatar" />
            <div class="user-info">
              <p class="user-info-admin">{{userData.username}}</p>
              <p class="user-info-role">管理员</p>
            </div>
          </div>
          <div class="login-info">
            <p>注册时间：<span>{{ userData.registrationTime }}</span></p>
            <p>上次登陆地点：<span>北京</span></p>
          </div>
        </el-card>
        <!-- 消息通知模块 -->
        <el-card shadow="hover" class="notifications">
          <h3>消息通知</h3>
          <el-card v-for="(notification, index) in notifications" :key="index" class="notification-card">
            <p class="notification-title">{{ notification.title }}</p>
            <p class="notification-description">{{ notification.description }}</p>
          </el-card>
        </el-card>


      </el-col>

      <!-- 右侧消息通知与最近动态 -->
      <el-col :span="16" class="right-section">
        <el-row :gutter="20">
          <el-col :span="12">
            <!-- 日历模块 -->
            <el-card shadow="hover" class="calendar">
              <h3>日历</h3>
              <el-calendar v-model:date="selectedDate" />
            </el-card>
            <!-- 目标模块 -->
            <el-card shadow="hover" class="target">
              <div class="target-header">
                <h3>心中所想</h3>
                <el-icon class="target-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm0 18a8 8 0 1 1 0-16 8 8 0 0 1 0 16zm-1-13h2v6h-2zm0 8h2v2h-2z" fill="#409EFF"/>
                  </svg>
                </el-icon>
              </div>
              <div class="target-content">
                <p>谁言凡俗不入眼，曾为少年志满天！</p>
              </div>
            </el-card>




          </el-col>

          <el-col :span="12">
            <!-- 最近动态模块 -->
            <el-card shadow="hover" class="recent-activities">
              <h3>最近动态</h3>
              <el-card class="recent-articles">
                <h4>最近发布的文章</h4>
                <ul>
                  <li v-for="article in recentArticles" :key="article.id">
                    {{ article.title }}
                    <span class="article-time">{{ article.time }}</span>
                  </li>
                </ul>
              </el-card>

              <el-card class="recent-comments">
                <h4>最新评论</h4>
                <ul>
                  <li v-for="comment in recentComments" :key="comment.id">
                    {{ comment.content }}
                    <span class="comment-time">{{ comment.time }}</span>
                  </li>
                </ul>
              </el-card>

              <el-card class="recent-visits">
                <h4>近期访问记录</h4>
                <ul>
                  <li v-for="visit in recentVisits" :key="visit.id">
                    IP: {{ visit.ip }} - 页面: {{ visit.page }} - 时间: {{ visit.time }}
                  </li>
                </ul>
              </el-card>
              <!-- 待办事项模块 -->
              <el-card shadow="hover" class="to-do-list">
                <h3>待办事项</h3>
                <el-checkbox-group v-model="toDoList">
                  <el-checkbox v-for="task in tasks" :label="task" :key="task">{{ task }}</el-checkbox>
                </el-checkbox-group>
              </el-card>
            </el-card>
          </el-col>
        </el-row>
      </el-col>
    </el-row>
  </div>
</template>


<script setup>
import { ref, getCurrentInstance, onMounted } from 'vue'
import { ElCalendar } from 'element-plus'
import router from '../router';

const { proxy } = getCurrentInstance()

const userData = ref({})

const tableData = ref([])

const tableLabel = ref({
  userID: 'ID',
  username: '姓名',
  email: '邮箱',
  registrationTime: '注册时间',
})

const recentArticles = ref([
  { id: 1, title: '如何优化网站性能', time: '1小时前' },
  { id: 2, title: 'Vue 3的新特性', time: '3小时前' },
  { id: 3, title: 'Element Plus组件使用教程', time: '1天前' },
])

const recentComments = ref([
  { id: 1, content: '这篇文章很有帮助！', time: '2小时前' },
  { id: 2, content: '谢谢分享！', time: '1天前' },
  { id: 3, content: '很详细的教程，谢谢！', time: '3天前' },
])

const recentVisits = ref([
  { id: 1, ip: '192.168.1.1', page: '首页', time: '2小时前' },
  { id: 2, ip: '192.168.1.2', page: '文章页面', time: '1天前' },
  { id: 3, ip: '192.168.1.3', page: '评论页面', time: '3天前' },
])

const notifications = ref([
  { title: '系统更新', description: '我们刚刚进行了系统更新，您可能需要重新登录。' },
  { title: '新评论', description: '有新的评论等待审核。' },
])

const tasks = ref([
  '完成系统更新',
  '审阅新注册用户',
  '发布新公告',
])

const toDoList = ref([])

const selectedDate = ref(new Date())

// 日期格式 - 年月日时分秒
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

onMounted(() => {
  const data = localStorage.getItem('userInfo');
  
  if (data == null) {
    localStorage.removeItem('userInfo');
    router.push('/login');
  } else {
    const parsedData = JSON.parse(data);
    
    // 格式化 registrationTime
    parsedData.registrationTime = formatDate(parsedData.registrationTime);
    
    userData.value = parsedData;
  }
});
</script>

<style scoped lang="less">
.home {
  height: 100%;
  padding: 0px;

  background-size: cover;

  .left-section,
  .right-section {
    margin-top: 0px;
  }

  .user {
    display: flex;
    align-items: center;
    border-bottom: 1px solid #e0e0e0;
    padding-bottom: 15px;
    margin-bottom: 20px;

    .user-avatar {
      width: 100px;
      height: 100px;
      border-radius: 50%;
      margin-right: 20px;
    }

    .user-info {
      .user-info-admin {
        font-size: 28px;
        color: #333;
        margin-bottom: 5px;
      }

      .user-info-role {
        font-size: 16px;
        color: #666;
      }
    }
  }

  .login-info {
    p {
      line-height: 24px;
      font-size: 14px;
      color: #999;

      span {
        color: #555;
        margin-left: 15px;
      }
    }
  }

  .user-table {
    margin-top: 20px;

    .el-table {
      font-size: 14px;
      color: #333;
    }

    max-height: 440px;
  }

  .el-card {
    transition: transform 0.3s ease, box-shadow 0.3s ease;
  }

  .el-card:hover {
    transform: scale(1.05) !important;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2) !important;
  }

  .target {
    margin-top: 5px;
    padding: 20px;
    width: 550px;

    h3 {
      font-weight: bold;
      font-size: 18px;
      margin-bottom: 0px;
      color: #333;
    }
  }

  .calendar {
    margin-top: 0px;
    padding: 10px;
    width: 550px;
    height: 610px;

    h3 {
      font-weight: bold;
      font-size: 18px;
      margin-bottom: 0px;
      color: #333;
    }

    .el-calendar {
      width: 100%;
    }
  }

  .notifications {
    margin-top: 20px;
    padding: 10px;

    h3 {
      font-weight: bold;
      font-size: 18px;
      margin-bottom: 10px;
      color: #333;
    }

    .notification-card {
      padding: 10px;
      margin-bottom: 10px;
      border: 1px solid #e0e0e0;
      border-radius: 4px;

      .notification-title {
        font-weight: bold;
      }

      .notification-description {
        font-size: 14px;
        color: #666;
      }
    }
  }

  .recent-activities {
    margin-top: 0px;
    padding: 10px;

    h3 {
      font-weight: bold;
      font-size: 18px;
      margin-bottom: 10px;
      color: #333;
    }

    .recent-articles,
    .recent-comments,
    .recent-visits {
      margin-bottom: 20px;
      padding: 10px;

      h4 {
        font-weight: bold;
        font-size: 16px;
        margin-bottom: 10px;
        color: #333;
      }

      ul {
        list-style: none;
        padding: 0;

        li {
          line-height: 24px;
          font-size: 14px;
          color: #666;

          .article-time,
          .comment-time {
            color: #999;
            margin-left: 10px;
          }
        }
      }
    }
  }

  .to-do-list {
    margin-top: 5px;
    padding: 10px;
    width: 490px;

    h3 {
      font-weight: bold;
      font-size: 18px;
      margin-bottom: 0px;
      color: #333;
    }
  }
}
</style>


