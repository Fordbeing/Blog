<template>
    <div class="tags">
        <el-tag
         v-for="(item,index) in tags"
          :key="item.name"
          :closable="item.name !== 'home'" 
          :effect="route.name === item.name ? 'dark' : 'plain'"
          @click="handleMenu(item)"
          @close="hancleClose(item,index)"
          >
            {{ item.label }}
        </el-tag>
    </div>
</template>

<script setup>
import {ref,computed, effect} from 'vue'
import { useRoute, useRouter } from 'vue-router';
import {useAllDataStore} from '@/stores'


const router = useRouter()

const hancleClose = (item,index)=>{
    // 通过pinia管理的
    allData.updateTags(item)
    // 如果点击关闭的tag不是对应的当前页面
    if(item.name !== route.name) return

    if(index === allData .state.tags.length){
        allData.selectMenu(allData.state.tags[index-1])
        router.push(allData.state.tags[index-1].name)
    }else{
        allData.selectMenu(allData.state.tags[index])
        router.push(allData.state.tags[index].name)
    }
}

const handleMenu = (item)=>{
    router.push(item.name)
    allData.selectMenu(item)
}

const allData = useAllDataStore()

 const tags = computed(()=> allData .state.tags)

const route = useRoute() 

</script>


<style lang="less" scoped>
.tags{
    margin:20px 0 0 20px;
}
.el-tag{
    margin-right:10px;
}
</style>