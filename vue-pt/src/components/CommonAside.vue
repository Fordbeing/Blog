<template>
    <el-aside :width="width">
        <el-menu background-color="#545c64" text-color="#fff" :default-active="activeMenu" :collapse="isCollapse"
            :collapse-transition="false">
            <h3 v-show="!isCollapse">PT后端管理器</h3>
            <h3 v-show="isCollapse">PT</h3>
            <el-menu-item v-for="item in noChildren" :key="item.path" :index="item.path" @click="handleEvent(item)">
                <component class="icons" :is="item.icon"></component>
                <span>{{ item.label }}</span>
            </el-menu-item>

            <el-sub-menu v-for="item in hasChildren" :key="item.path" :index="item.path" :collapse-transition="true">
                <template #title>
                    <component class="icons" :is="item.icon"></component>
                    <span>{{ item.label }}</span>
                </template>
                <el-menu-item-group>
                    <el-menu-item v-for="(subItem, subIndex) in item.children" :key="subItem.path" :index="subItem.path"
                        @click="handleEvent(subItem)">
                        <component class="icons" :is="subItem.icon"></component>
                        <span>{{ subItem.label }}</span>
                    </el-menu-item>
                </el-menu-item-group>
            </el-sub-menu>
        </el-menu>
    </el-aside>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router';
import { useAllDataStore } from '@/stores'

const route = useRoute()
const router = useRouter()

const activeMenu = computed(() => {
    return route.path
})

const handleEvent = (item) => {
    clickMenu(item)
}

const list = ref([
    {
        path: '/home',
        name: 'home',
        label: '首页',
        icon: 'house',
        url: 'Home'
    },
    {
        path: '/category',
        name: 'category',
        label: '分类管理',
        icon: 'video-play',
        url: 'Category'
    },
    {
        path: '/user',
        name: 'user',
        label: '用户管理',
        icon: 'user',
        url: 'User'
    },
    {
        path: 'other',
        label: '文章管理',
        icon: 'Monitor',
        children: [
            {
                path: '/articleManage',
                name: 'articleManage',
                label: '文章管理',
                icon: 'folder',
                url: 'articleManage'
            },
            {
                path: '/articleRelease',
                name: 'articleRelease',
                label: '文章发布',
                icon: 'edit',
                url: 'articleRelease'
            },


        ]
    },
    {
        path: '/commentManage',
        name: 'commentManage',
        label: '评论管理',
        icon: 'edit',
        url: 'commentManage'
    },
])

const noChildren = computed(() => list.value.filter(item => !item.children))
const hasChildren = computed(() => list.value.filter(item => item.children))

const store = useAllDataStore()

const isCollapse = computed(() => store.state.isCollapse)
// width
const width = computed(() => store.state.isCollapse ? '64px' : '180px')

const clickMenu = (item) => {
    router.push(item.path)
    store.selectMenu(item)
}
</script>

<style lang="less" scoped>
.icons {
    width: 18px;
    height: 18px;
    margin-right: 5px;
}

.el-menu {
    border-right: none;

    h3 {
        line-height: 48px;
        color: #fff;
        text-align: center;
    }
}

.el-aside {
    height: 100%;
    background-color: #545c64;
}
</style>
