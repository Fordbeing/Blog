<template>
    <div class="login-container">
      <div class="login-card">
        <h2 class="login-title">Welcome Back!</h2>
        <form @submit.prevent="handleLogin" class="login-form">
          <div class="form-group">
            <label for="email">Email:</label>
            <input
              v-model="email"
              type="email"
              id="email"
              placeholder="Enter your email"
              required
              :class="{ 'input-error': errors.email }"
            />
            <transition name="fade">
              <span v-if="errors.email" class="error-message">{{ errors.email }}</span>
            </transition>
          </div>
          <div class="form-group">
            <label for="password">Password:</label>
            <input
              v-model="password"
              type="password"
              id="password"
              placeholder="Enter your password"
              required
              :class="{ 'input-error': errors.password }"
            />
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
  import { ref } from 'vue';
  import { useRouter } from 'vue-router';
  import axios from 'axios';
  
  const email = ref('');
  const password = ref('');
  const rememberMe = ref(false);
  const loading = ref(false);
  const errorMessage = ref('');
  const errors = ref({});
  
  const router = useRouter();
  
  const validate = () => {
    errors.value = {};
    if (!email.value) {
      errors.value.email = 'Email is required.';
    } else if (!/\S+@\S+\.\S+/.test(email.value)) {
      errors.value.email = 'Email is invalid.';
    }
    if (!password.value) {
      errors.value.password = 'Password is required.';
    } else if (password.value.length < 6) {
      errors.value.password = 'Password must be at least 6 characters.';
    }
    return Object.keys(errors.value).length === 0;
  };
  
  const handleLogin = async () => {
    if (!validate()) return;
  
    loading.value = true;
    errorMessage.value = '';
  
    try {
      await axios.post('/api/login', {
        email: email.value,
        password: password.value,
        rememberMe: rememberMe.value,
      });
      localStorage.setItem('isAuthenticated', 'true');
      router.push('/');
    } catch (error) {
      errorMessage.value = 'Login failed. Please check your credentials.';
    } finally {
      loading.value = false;
    }
  };
  </script>
  
  <style scoped>
  .login-container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    background-image: url('@/assets/images/loginBack.png'); /* 设置背景图片 */
  }
  
  .login-card {
  background: rgba(36, 35, 35, 0.5); /* 半透明白色背景 */
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
    color: #555;
  }
  
  input[type="email"],
  input[type="password"] {
    width: 100%;
    padding: 12px;
    border: 1px solid #ddd;
    border-radius: 8px;
    box-sizing: border-box;
    transition: border-color 0.3s;
  }
  
  input[type="email"]:focus,
  input[type="password"]:focus {
    border-color: #243a61;
    outline: none;
  }
  
  .input-error {
    border-color: #f44336 !important;
  }
  
  input[type="checkbox"] {
    margin-right: 8px;
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
  
  .forgot-password {
    margin-top: 15px;
    text-align: center;
  }
  
  .forgot-password a {
    color: #2575fc;
    text-decoration: none;
    font-size: 14px;
  }
  
  .fade-enter-active, .fade-leave-active {
    transition: opacity 0.5s;
  }
  
  .fade-enter, .fade-leave-to /* .fade-leave-active in <2.1.8 */ {
    opacity: 0;
  }
  </style>
  