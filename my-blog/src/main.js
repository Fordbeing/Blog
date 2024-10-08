import { createApp } from 'vue';
import App from './App.vue';
// import "@/assets/less/index.less";
import router from './router';
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';
import * as ElementPlusIconsVue from '@element-plus/icons-vue';
import { createPinia } from 'pinia';
import api from "@/api/api"
import InfiniteScroll from 'vue-infinite-scroll';

const pinia = createPinia()

const app = createApp(App)
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)}


app.config.globalProperties.$api = api
app.use(pinia)
app.use(ElementPlus)
app.use(router)
app.use(InfiniteScroll);

app.mount('#app')
