<template>
    <div class="common-layout">
        <el-container class="lay-container">
            <!-- 定义侧边栏 -->
            <common-aside />
            <el-container>

                <el-header class="lay-header">
                    <common-header />
                </el-header>
                <common-tag />
                <el-main class="right-main">
                    <router-view></router-view>
                </el-main>

            </el-container>
        </el-container>

    </div>
</template>

<script setup>
import CommonAside from '@/components/CommonAside.vue'
import CommonHeader from '@/components/CommonHeader.vue'
import CommonTag from '@/components/CommonTag.vue'
</script>



<style scoped lang="less">
.common-layout,
.lay-container {
    height: 100%;
    background-color: rgb(114, 120, 138);
    // background: url('@/assets/images/back.png') no-repeat center center fixed;
}

.lay-header {
    background-color: #333;
}
</style>