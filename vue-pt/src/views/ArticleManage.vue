<template>
    <el-container>

        <el-main>
            <div>
                <el-row class="Title">
                    文章修改
                </el-row>
            </div>

            <div class="user-header">

                <el-form :inline="true" :model="formInline">
                    <el-form-item label="文章标题">
                        <el-input placeholder="请输入文章标题" v-model="Title"></el-input>
                    </el-form-item>
                    <el-form-item label="用户名">
                        <el-input placeholder="请输入用户名" v-model="Author"></el-input>
                    </el-form-item>

                    <el-form-item>
                        <el-button type="primary" @click="handleSearch">查询</el-button>
                    </el-form-item>

                    <el-form-item>
                        <el-button type="primary" @click="handleClear">清空</el-button>
                    </el-form-item>
                </el-form>
            </div>

            <div class="table">
                <el-table :data="postData.list" style="width: 100%">
                    <el-table-column v-for="item in tableLabel" :prop="item.prop" :label="item.label"
                        :width="item.width ? item.width : 125" />
                    <el-table-column fixed="right" label="Operations" min-width="200">
                        <template v-slot:default="scope">
                            <el-button size="small" @click="handleClick">
                                查看
                            </el-button>
                            <el-button type="primary" size="small" @click="handleEdit(scope.row)">
                                编辑
                            </el-button>
                            <el-button @click="deletePost(scope.row)" type="danger" size="small">删除</el-button>
                        </template>
                    </el-table-column>
                    
                </el-table>
                <div class="pager">
                    <el-pagination class="pagerA" background layout="prev, pager, next" :total='configA.total' 
                    @current-change="handleChange" @click="handlePage" />
                </div>

                
            </div>

            

            <div class="articleUpdateTitle">
                <el-row>
                    <el-col :span="6">
                        <div style="display: inline-flex; align-items: center; font-size: 20px; margin-bottom: 12px;">
                            文章标题
                        </div>
                        <el-statistic :value="mdTitle" />
                    </el-col>
                    <el-col :span="6">
                        <el-statistic :value="mdAuthor">
                            <template #title>
                                <div
                                    style="display: inline-flex; align-items: center; font-size: 20px;margin-bottom: 8px;">
                                    作者
                                </div>
                            </template>
                            
                        </el-statistic>
                    </el-col>
                    <el-col :span="6">
                        <div style="display: inline-flex; align-items: center; font-size: 20px; margin-bottom: 12px;">
                            预估阅读时长
                        </div>
                        <el-statistic :value="outputValue" />
                    </el-col>
                    <el-col :span="6">
                        <div style="display: inline-flex; align-items: center; font-size: 20px; margin-bottom: 12px;">
                            创建时间
                        </div>
                        <el-statistic :value="createTime">
                        </el-statistic>
                    </el-col>
                </el-row>
            </div>

            <div class="articleUpdateContent" >
                <md-editor v-model="text" :config="editorConfig" theme="dark" ref="bottomElement" />
                <div class="articleUpdateBtn" >
                    <el-button type="primary" @click="handleUpdate()" size="large" style="
                        height: 100%;
                        width: 100%;
                        background-color: var(--el-bg-color-overlay);
                        box-shadow: var(--el-box-shadow-lighter);
                        text-align: center;
                        line-height: 50px;
                        color: #666;
                        font-size: 20px;
                        font-weight: bold;
                        border-radius: 50%;
                    ">修改</el-button>
                </div>
            </div>
        </el-main>
    </el-container>
</template>


<script setup>
import { ref, getCurrentInstance, onMounted, reactive } from 'vue'
import { useAllDataStore } from '@/stores'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useTransition } from '@vueuse/core'
import { MdEditor } from 'md-editor-v3';
// import { readingTimePlugin } from '@vuepress/plugin-reading-time'
import 'md-editor-v3/lib/style.css';
import { id } from 'element-plus/es/locale/index.mjs';
// 假设 md-editor-v3 支持通过 config prop 传递配置  
const text = ref('# Hello Editor');
const mdTitle = ref('');
const mdAuthor = ref('')
const createTime = ref('')

const source = ref(0)
const outputValue = useTransition(source, {
    duration: 1500,
})
source.value = 172000

const { proxy } = getCurrentInstance()

const store = useAllDataStore()

const tableLabel = store.state.PostTableLabelData;

const Title = ref('')
const Author = ref('')


const globalID = ref(0) // 获取全局ID 用于更新文章内容

const bottomElement = ref(null) // 用于跳转到页面最低位置
// 编辑按钮
const handleEdit = (row) => {
    globalID.value = row.postID
    mdTitle.value = row.title
    mdAuthor.value = row.author
    text.value = row.content
    createTime.value = row.publishDate
    bottomElement.scrollIntoView({ behavior: 'smooth' }); // 页面跳转
}

const handleClear =() =>{
    globalID.value = ''
    Title.value = ''
    Author.value = ''
    configA.page = 1
    GetPostByTitle(Title, Author)
}

// 查看按钮
const handleClick = () => {
    console.log('click')
}

const handleChange = (page) => {
    configA.page = page
    // getPostData((page-1) * 10,10)
}

const handlePage = () =>{
    getPostData((configA.page-1) * 10,10)
}

const handleUpdate = () => {
    let data = {
        postID: globalID.value,
        title: mdTitle.value,
        content: text.value,
    }   
    PostUpdate(data)
    getPostData(configA.page,10)
}

const handleSearch = async () => {
    // 如果标题和作者都为空，则直接获取全部数据
    if (Title.value === '' && Author.value === '') {
        await getPostData(0, 10); // 在这里等待获取数据完成
    } else {
        // 如果标题或作者不为空，则根据输入进行查询
        await GetPostByTitle(Title, Author);
    }
}

// 模糊查找
const GetPostByTitle = async (Title, Author) => {
    let Fdata = '';
    if (Title.value == '' && Author.value !== '') {
        Fdata = await proxy.$api.GetPostByTitle('default-title', Author.value)
    } else if (Title.value !== '' && Author.value == '') {
        Fdata = await proxy.$api.GetPostByTitle(Title.value, 'default-authorName')
    }else if(Title.value == '' && Author.value == ''){
        getPostData(0,10)
    }else{
        Fdata = await proxy.$api.GetPostByTitle(Title.value, Author.value)
    }
    postData.list = Fdata
    console.log(Fdata)
    configA.total = Fdata.count
}

const PostUpdate = async (postVo) => {
    
    try {
        // 假设 deleteUser API 调用成功会返回一些确认信息，但这里我们主要关心的是删除操作本身  
        // 调用 getUserData 来更新用户列表  
        await proxy.$api.PostUpdate(postVo)
        ElMessage({
            type: 'success',
            message: 'update completed',
        });
    } catch (error) {
        // 处理错误情况，例如显示错误信息  
        ElMessage({
            type: 'error',
            message: 'update failed: ' + error.message,
        });
    }
}


const configA = reactive({
    name: '',
    total: 10,
    page: 0 // 当前页码
})

const postData = reactive({
    list: []
});

const getPostData = async (current,limit) => {
    let data = await proxy.$api.getPostData(current,limit)
    // userData.list = data.data.map(item => ({
    //     ...item,
    //     sex: item.sex === 1 ? '男' : '女'
    // }))
    console.log(data)

    postData.list = data.list
    configA.total = data.total
    
}

const deletePostData = async (id) => {
    try {
        let data = await proxy.$api.deletePost(id);
        // 假设 deleteUser API 调用成功会返回一些确认信息，但这里我们主要关心的是删除操作本身  
        // 调用 getUserData 来更新用户列表  
        await getPostData(configA.page,10);
        ElMessage({
            type: 'success',
            message: 'Delete completed',
        });
    } catch (error) {
        // 处理错误情况，例如显示错误信息  
        ElMessage({
            type: 'error',
            message: 'Delete failed: ' + error.message,
        });
    }
};

const deletePost = (row) => {
    ElMessageBox.confirm(
        '请问是否要删除该行记录?',
        'Warning',
        {
            confirmButtonText: '确认',
            cancelButtonText: '取消',
            type: 'warning',
        }
    )
        .then(() => {
            deletePostData(row.postID)
                .catch(err => {
                    // 如果 deleteUserData 失败，可以在这里处理错误  
                    ElMessage({
                        type: 'error',
                        message: 'Failed to delete user: ' + err.message,
                    });
                });
        })
        .catch(() => {
            ElMessage({
                type: 'info',
                message: 'Delete canceled',
            });
        });
};


onMounted(() => {
    getPostData(0 , 10)
})

</script>


<style scoped lang="less">
.el-container {
    height: 100%;
    width: 100%;

    .Title {
        background-color: #e2e1e1;
        font-size: 30px;
        font-weight: bold;
        padding: 15px;
    }


}

.user-header {
    margin-top: 20px;
    display: flex;
    justify-content: space-between;
}

.table {
    // position: relative;
    height: 530px;
}

.el-table {
    width: 100%;
    height: 500px;
}

.pagerA {
    // position: absolute;
    right: 10px; 
    left: 40%;
    // bottom: 30px;
}

.select-clearn {
    display: flex;
}

.articleUpdateTitle {
    text-align: center;
    background-color: #e2e1e1;
    height: 70px;
    border-bottom: 5px solid #a09e9e;
    margin: 10px 0;

    .el-col {
        text-align: center;
        margin-top: 8px;
    }
}

.articleUpdateContent {

    width: 100%;
    height: 580px;
    background-color: #fff;
    position: relative;

    .articleUpdateBtn {
        position: absolute;
        right: 120px;
        bottom: 80px;
    }
}

.md-editor {
    height: 595px;
    width: 100%;
}


:deep(.el-statistic__title):deep(.el-statistic__content):deep(.el-statistic__suffix) {
    font-size: 25px;
    /* 你可以根据需要设置字体大小 */
}
</style>