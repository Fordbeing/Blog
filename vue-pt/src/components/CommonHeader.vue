<template>
    <div class="header">
        <div class="l-content">
            <el-button size="small" @click="handleCollapse">
                <component class="icons" is="menu"></component>
            </el-button>
            <el-breadcrumb separator="/" class="bread">
                <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="r-content">
            <el-dropdown>
                <span class="el-dropdown-link">
                    <img :src="getImageUrl('user')" class="user" />
                </span>
                <template #dropdown>
                <el-dropdown-menu>
                    <el-dropdown-item>个人中心</el-dropdown-item>
                    <el-dropdown-item @click="handleLogout">退出</el-dropdown-item>
                </el-dropdown-menu>
                </template>
            </el-dropdown>
        </div>
    </div>
</template>


<script setup>
import { useAllDataStore } from '@/stores'
import { useRouter } from 'vue-router'

const getImageUrl = (user) =>{
    return new URL(`../assets/images/${user}.png`, import.meta.url).href
}

const allDataStore = useAllDataStore()
const router = useRouter()

const handleCollapse = () =>{
    allDataStore.state.isCollapse = !allDataStore.state.isCollapse
}

const handleLogout = () => {
    // 清除用户数据
    localStorage.removeItem('authToken'); // 或者使用其他方法来清除用户数据
    localStorage.removeItem('userInfo');
    
    // 跳转到登录页面或其他页面
    router.push('/login');
}
</script>



<style lang="less" scoped>
.header{
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 100%;
    width: 100%;
    background-color: #333;
}

.icons{
    width: 20px;
    height: 20px;
}

.l-content{
    display: flex;
    align-items: center;
    .el-button{
        margin-right: 20px;
    }
}

.r-content{
    .user{
        width: 40px;
        height: 40px;
        border-radius: 50%;

    }
}

:deep(.bread span){
    color: #fff !important;
    cursor: pointer !important;
}
</style>