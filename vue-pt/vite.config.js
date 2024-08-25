import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  // 别名配置
  resolve:{
    alias:[
      {
        find:'@',
        replacement:'/src',
      }
    ]
  }
},

)
