<template>
  <el-container style="height: 100vh; position: relative;">
    <el-header>
      <Header />
    </el-header>
    <el-main>
      <el-row :gutter="20">
        <!-- 左侧留言展示区域 -->
        <el-col :span="19">
          <el-row :gutter="20">
            <el-col v-for="(comment, index) in comments" :key="index" :span="8">
              <el-card class="comment-card" @click="showDetails(comment)">
                <div slot="header" class="card-header">
                  <h3 class="comment-name">{{ comment.author }}</h3>
                  <p class="comment-email">{{ comment.email }}</p>
                </div>
                <p class="comment-message">
                  <span v-if="comment.content.length > 50">
                    {{ comment.content.slice(0, 25) }}...
                  </span>
                  <span v-else>
                    {{ comment.content }}
                  </span>
                </p>
                <p class="comment-time">{{ formatDate(comment.date) }}</p>
              </el-card>
            </el-col>
          </el-row>
        </el-col>

        <!-- 右侧留言板区域 -->
        <el-col :span="5">
          <el-button type="primary" class="show-form-button" @click="showForm = !showForm">
            {{ showForm ? '隐藏留言板' : '显示留言板' }}
          </el-button>
          <div v-if="showForm" class="form-box">
            <el-form ref="form" label-width="80px">
              <el-form-item label="姓名">
                <el-input v-model="author1" placeholder="请输入姓名"></el-input>
              </el-form-item>
              <el-form-item label="邮箱">
                <el-input v-model="email1" placeholder="请输入邮箱"></el-input>
              </el-form-item>
              <el-form-item label="留言">
                <el-input type="textarea" v-model="content1" placeholder="请输入留言" class="textarea"></el-input>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="submitForm">提交</el-button>
                <el-button @click="resetForm">重置</el-button>
              </el-form-item>
            </el-form>
          </div>
        </el-col>
      </el-row>

      <!-- 详细信息展示 -->
      <el-dialog v-model="dialogVisible" width="60%" center class="custom-dialog">
        <template #title>
          <h3 class="dialog-title">{{ currentComment.author }}</h3>
        </template>
        <div class="dialog-content">
          <p><strong>邮箱：</strong>{{ currentComment.email }}</p>
          <p><strong>留言：</strong>{{ currentComment.content }}</p>
          <p><strong>日期：</strong>{{ formatDate(currentComment.date) }}</p>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">关闭</el-button>
        </span>
      </el-dialog>
    </el-main>
  </el-container>
</template>

<script setup>
import Header from '../components/Header.vue';
import { ref, getCurrentInstance, onMounted, nextTick } from 'vue';
import { ElMessage, ElNotification } from 'element-plus';

const { proxy } = getCurrentInstance();

const comments = ref([]);
const author1 = ref('');
const email1 = ref('');
const content1 = ref('');
const showForm = ref(false);
const currentComment = ref(null);
const dialogVisible = ref(false);

const data = ref([]);
const formData = ref({});

const validateEmail = (email) => {
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailPattern.test(email);
};

const submitForm = () => {
  if (!author1.value) {
    ElNotification({
      title: '提示',
      message: '姓名不得为空',
      type: 'warning',
      position: 'bottom-right'
    });
    nextTick(() => {
      document.querySelector('input[placeholder="请输入姓名"]').focus();
    });
    return;
  }

  if (!email1.value) {
    ElNotification({
      title: '提示',
      message: '邮箱不得为空',
      type: 'warning',
      position: 'bottom-right'
    });
    nextTick(() => {
      document.querySelector('input[placeholder="请输入邮箱"]').focus();
    });
    return;
  }

  if (!validateEmail(email1.value)) {
    ElNotification({
      title: '提示',
      message: '邮箱格式不正确',
      type: 'warning',
      position: 'bottom-right'
    });
    nextTick(() => {
      document.querySelector('input[placeholder="请输入邮箱"]').focus();
    });
    return;
  }

  if (!content1.value) {
    ElNotification({
      title: '提示',
      message: '留言不得为空',
      type: 'warning',
      position: 'bottom-right'
    });
    nextTick(() => {
      document.querySelector('textarea[placeholder="请输入留言"]').focus();
    });
    return;
  }

  formData.value = { author: author1.value, email: email1.value, content: content1.value };
  addComment(formData.value);
};

const resetForm = () => {
  author1.value = '';
  email1.value = '';
  content1.value = '';
};

const formatDate = (date) => {
  const options = { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric' };
  return new Date(date).toLocaleDateString(undefined, options);
};

const showDetails = (comment) => {
  currentComment.value = comment;
  dialogVisible.value = true;
};

const getAllComment = async () => {
  try {
    comments.value = await proxy.$api.getAllComment();
  } catch (error) {
    console.error('Error fetching comments:', error);
  }
};

const addComment = async (comment) => {
  let response = await proxy.$api.addComment(comment);
  data.value = response;

  if (response[0] === 'True') {
    ElNotification({
      title: 'Ai检测您的内容有违法违规内容',
      message: response[1],
      type: 'danger',
      position: 'bottom-right'
    });
    content1.value = '';
    nextTick(() => {
      document.querySelector('textarea[placeholder="请输入留言"]').focus();
    });
  } else if (response[0] === 'False') {
    ElNotification({
      title: '提示',
      message: '留言成功，感谢您的留言',
      type: 'success',
      position: 'bottom-right'
    });
    comments.value.push({
      author: author1.value,
      email: email1.value,
      content: content1.value,
      date: Date.now()
    });
    resetForm();
  } else if (response[0] === 'Middle') {
    ElNotification({
      title: 'Ai检测到您的内容过于随便',
      message: response[1],
      type: 'warning',
      position: 'bottom-right'
    });
    content1.value = '';
    nextTick(() => {
      document.querySelector('textarea[placeholder="请输入留言"]').focus();
    });
  }
};

onMounted(() => {
  getAllComment();
});
</script>

<style scoped>
.el-container {
  background-image: url('@/assets/img/peosonBack1.png');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}

.comment-card {
  background-color: rgba(0, 6, 14, 0.5);
  border-radius: 8px;
  margin-bottom: 20px;
  border: 5px solid #18191a;
  box-shadow: 0 2px 8px rgba(150, 76, 76, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.comment-card:hover {
  transform: scale(1.02);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.comment-name {
  font-size: 20px;
  font-weight: 700;
  color: #7b73c7;
}

.comment-email {
  font-size: 16px;
  color: #b66391;
}

.comment-message {
  font-size: 16px;
  color: #a982aa;
  line-height: 1.6;
}

.comment-time {
  font-size: 15px;
  color: #ac9595;
  text-align: right;
  font-weight: bold;
  margin-top: 12px;
}

.form-box {
  padding: 30px;
  background-color: rgba(0, 6, 14, 0.5);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  border-radius: 12px;
  position: sticky;
  top: 20px;
  height: 500px;
  border: 1px solid #221c1c;
}

.form-box el-form-item {
  margin-bottom: 20px;
}

.show-form-button {
  background: linear-gradient(45deg, #424446, #8a5779);
  color: #201b1b;
  border: none;
  height: 40px;
  border-radius: 20px;
  font-weight: bold;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;
}

.show-form-button:hover {
  background: linear-gradient(45deg, #34393f, #409eff);
  transform: translateY(-2px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.3);
  color: #b440e2;
}

.custom-dialog .el-dialog__header {
  background: rgba(173, 151, 151, 0.1); /* 透明背景 */
  border-bottom: 1px solid rgba(53, 38, 38, 0.3);
  color: #3a2727;
}

.custom-dialog .el-dialog__body {
  background: rgba(0, 0, 0, 0.3); /* 透明背景 */
  color: #f0f0f0;
}

.custom-dialog .el-dialog__footer {
  background: rgba(0, 0, 0, 0.3); /* 透明背景 */
  border-top: 1px solid rgba(255, 255, 255, 0.3);
  text-align: right;
}

.dialog-title {
  font-size: 22px;
  font-weight: bold;
  color: #c07b7b;
}

.dialog-content {
  font-size: 16px;
  color: #8b60af;
  line-height: 1.6;
  padding: 20px;
  border-radius: 8px;
}

.dialog-footer {
  text-align: right;
  padding: 10px;
}
</style>
