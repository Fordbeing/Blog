<template>
  <div class="login-container">
    <div class="login-card">
      <h2 class="login-title">Welcome Back!</h2>
      <form @submit.prevent="handleLogin" class="login-form">
        <div class="form-group">
          <label for="email">UserName:</label>
          <input v-model="email" type="input" id="email" placeholder="Enter your username" required
            :class="{ 'input-error': errors.email }" />
          <transition name="fade">
            <span v-if="errors.email" class="error-message">{{ errors.email }}</span>
          </transition>
        </div>
        <div class="form-group">
          <label for="password">Password:</label>
          <input v-model="password" type="password" id="password" placeholder="Enter your password" required
            :class="{ 'input-error': errors.password }" />
          <transition name="fade">
            <span v-if="errors.password" class="error-message">{{ errors.password }}</span>
          </transition>
        </div>

        <button type="submit" :disabled="loading">Login</button>
        <transition name="fade">
          <div v-if="errorMessage" class="error-message">{{ errorMessage }}</div>
        </transition>
        <transition name="fade">
          <div v-if="loading" class="loading">Loading...</div>
        </transition>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, getCurrentInstance,onMounted } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';
import { ElMessage } from 'element-plus'

// 获取当前实例的 proxy 对象
const { proxy } = getCurrentInstance();
const email = ref('');  // 邮箱字段
const password = ref('');  // 密码字段
const loading = ref(false);  // 加载状态
const errorMessage = ref('');  // 错误消息
const errors = ref({});  // 验证错误

// 使用 Vue Router 进行路由跳转
const router = useRouter();

// 验证邮箱和密码输入
const validate = () => {
  errors.value = {};

  // 验证邮箱
  if (!email.value) {
    errors.value.email = '用户名不能为空。';
  }

  // 验证密码
  if (!password.value) {
    errors.value.password = '密码不能为空。';
  } else if (password.value.length < 6) {
    errors.value.password = '密码长度不能少于6个字符。';
  }

  // 如果没有错误，返回 true，否则返回 false
  return Object.keys(errors.value).length === 0;
};
const loginDto = ref({});
// 处理登录逻辑
const handleLogin = async () => {
  // 如果验证不通过，直接返回
  if (!validate()) return;

  loading.value = true;  // 设置加载状态为 true
  errorMessage.value = '';  // 清空错误消息
  try {
    // 调用登录 API
    loginDto.value = { username: email.value, password: password.value };
    // 调用 API
    const response = await proxy.$api.login(loginDto.value);

    
    email.value = '';  // 清空输入框
    password.value = '';  // 清空输入框

    console.log(response.data);

    // 假设 API 返回的 token 在 response.data.token 中
    const token = response.token;

    // 将 token 存储在 localStorage 中
    localStorage.setItem('authToken', token);
    // 存储用户信息 暂时先这样
    localStorage.setItem('userInfo', JSON.stringify(response.data));
    if (localStorage.getItem('userInfo') == null) {
      localStorage.removeItem('userInfo');
      router.push('/login');
      errorMessage.value = '登录失败，请检查您的凭证。';
    } else if (localStorage.getItem('userInfo') != null) {
      // 跳转到主页
      ElMessage({
            type: 'success',
            message: '登录成功',
        });
      console.log(localStorage.getItem('userInfo'))
      router.push('/home');
    }


    // 设置请求头
    // axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

    // 跳转到主页
    // router.push('/home');
  } catch (error) {
    // 捕获错误并设置错误消息
    ElMessage({
            type: 'error',
            message: '账号或者密码错误: ' + error.message,
        });
    errorMessage.value = '登录失败，请检查您的凭证。';
  } finally {
    // 无论成功还是失败，最后都取消加载状态
    loading.value = false;
  }
};

onMounted(() => {
  localStorage.removeItem('userInfo'); // 清空用户信息
});

</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-image: url('@/assets/images/loginBack.png');
}

.login-card {
  background: rgba(36, 35, 35, 0.5);
  border-radius: 15px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  padding: 30px;
  width: 100%;
  max-width: 400px;
}

.login-title {
  text-align: center;
  margin-bottom: 20px;
  color: #2b805f;
  font-size: 24px;
}

.login-form {
  display: flex;
  flex-direction: column;
}

.form-group {
  margin-bottom: 15px;
}

label {
  display: block;
  margin-bottom: 5px;
  color: #b8859a;
}

input[type="input"],
input[type="password"] {
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 8px;
  box-sizing: border-box;
  transition: border-color 0.3s;
}

input[type="input"]:focus,
input[type="password"]:focus {
  border-color: #243a61;
  outline: none;
}

.input-error {
  border-color: #f44336 !important;
}

button {
  padding: 12px;
  background-color: #556580;
  color: #c57ebc;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 20px;
  font-weight: bold;
  transition: background-color 0.3s, transform 0.2s;
}

button:hover {
  background-color: #926bb6;
  transform: scale(1.02);
}

button:disabled {
  background-color: #943d3d;
}

.error-message {
  color: #f44336;
  font-size: 14px;
}

.loading {
  font-size: 16px;
  color: #34808a;
  font-weight: bold;
  text-align: center;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>
