<template>
    <el-container>
        <el-main>
            <div class="header">
                <el-row class="title-row">
                    文章修改
                </el-row>
            </div>

            <div class="search-section">
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

            <div class="table-section">
                <el-table :data="postData.list" style="width: 100%">
                    <el-table-column v-for="item in tableLabel" :prop="item.prop" :label="item.label"
                        :width="item.width ? item.width : 125" />
                    <el-table-column fixed="right" label="操作" min-width="200">
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

            <div class="article-details">
                <el-row class="details-row">
                    <el-col :span="6" class="details-item">
                        <el-statistic :value="mdTitle">
                            <template #title>
                                <div class="statistic-title">文章标题</div>
                            </template>
                        </el-statistic>
                    </el-col>
                    <el-col :span="6" class="details-item">
                        <el-statistic :value="mdAuthor">
                            <template #title>
                                <div class="statistic-title">作者</div>
                            </template>
                        </el-statistic>
                    </el-col>
                    <el-col :span="6" class="details-item">
                        <el-statistic :value="outputValue">
                            <template #title>
                                <div class="statistic-title">预估阅读时长</div>
                            </template>
                        </el-statistic>
                    </el-col>
                    <el-col :span="6" class="details-item">
                        <el-statistic :value="createTime">
                            <template #title>
                                <div class="statistic-title">创建时间</div>
                            </template>
                        </el-statistic>
                    </el-col>
                </el-row>
            </div>

            <div class="article-content">
                <md-editor v-model="text" :config="editorConfig" theme="dark" class="editor" />
                <div class="update-btn">
                    <el-button type="primary" @click="handleUpdate" size="large">修改</el-button>
                </div>
            </div>
        </el-main>
    </el-container>
</template>

<script setup>
import { ref, getCurrentInstance, onMounted, reactive, nextTick } from 'vue'
import { useAllDataStore } from '@/stores'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useTransition } from '@vueuse/core'
import { MdEditor } from 'md-editor-v3';
import 'md-editor-v3/lib/style.css';

const text = ref('# Hello Editor');
const mdTitle = ref('');
const mdAuthor = ref('')
const createTime = ref('')

const source = ref(0)
const outputValue = useTransition(source, {
    duration: 1500,
})


const { proxy } = getCurrentInstance()

const store = useAllDataStore()

const tableLabel = store.state.PostTableLabelData;

const Title = ref('')
const Author = ref('')

const globalID = ref(0)

const bottomElement = ref(null)

const handleEdit = (row) => {
    globalID.value = row.postID
    mdTitle.value = row.title
    mdAuthor.value = row.author
    text.value = row.content
    createTime.value = row.publishDate
    if (text.value.length < 200) {
        source.value = 1
    } else {
        source.value = text.value.length / 200
    }

    nextTick(() => {
        bottomElement.value.scrollIntoView({ behavior: 'smooth' });
    });
}

const handleClear = () => {
    globalID.value = ''
    Title.value = ''
    Author.value = ''
    configA.page = 1
    GetPostByTitle(Title, Author)
}

const handleClick = () => {
    console.log('click')
}

const handleChange = (page) => {
    configA.page = page
}

const handlePage = () => {
    getPostData((configA.page - 1) * 10, 10)
}

const handleUpdate = () => {
    let data = {
        postID: globalID.value,
        title: mdTitle.value,
        content: text.value,
    }
    PostUpdate(data)
    getPostData(configA.page, 10)
}

const handleSearch = async () => {
    let data = "";
    if (Title.value === '' && Author.value === '') {
        data = await getPostData(0, 10);
        postData.list = data.list;
        configA.total = data.total;  // 确保这里的 total 被正确设置
    } else {
        data = await GetPostByTitle(Title, Author);
    }
}

const GetPostByTitle = async (Title, Author) => {
    let Fdata = '';
    if (Title.value === '' && Author.value !== '') {
        Fdata = await proxy.$api.GetPostByTitle('default-title', Author.value)
    } else if (Title.value !== '' && Author.value === '') {
        Fdata = await proxy.$api.GetPostByTitle(Title.value, 'default-authorName')
    } else if (Title.value === '' && Author.value === '') {
        getPostData(0, 10)
    } else {
        Fdata = await proxy.$api.GetPostByTitle(Title.value, Author.value)
    }
    postData.list = Fdata
    configA.total = Fdata.length
}

const PostUpdate = async (postVo) => {
    try {
        await proxy.$api.PostUpdate(postVo)
        ElMessage({
            type: 'success',
            message: 'Update completed',
        });
    } catch (error) {
        ElMessage({
            type: 'error',
            message: 'Update failed: ' + error.message,
        });
    }
}

const configA = reactive({
    name: '',
    total: 10,
    page: 1
})

const postData = reactive({
    list: []
});

const getPostData = async (current, limit) => {
    let data = await proxy.$api.getPostData(current, limit);
    console.log(data);
    postData.list = data.list;
    configA.total = data.total;  // 确保这里的 total 被正确设置
}

const deletePostData = async (id) => {
    try {
        await proxy.$api.deletePost(id);
        await getPostData(configA.page, 10);
        ElMessage({
            type: 'success',
            message: 'Delete completed',
        });
    } catch (error) {
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
                    ElMessage({
                        type: 'error',
                        message: 'Failed to delete post: ' + err.message,
                    });
                });
        })
        .catch(() => {
            ElMessage({
                type: 'info',
                message: 'Delete canceled',
            });
        });
}

onMounted(() => {
    getPostData(0, 10)
})
</script>

<style scoped lang="less">
.el-container {
    min-height: 100vh;
}

.header {
    background-color: #333;
    color: white;
    padding: 10px;
    font-size: 20px;
}

.title-row {
    font-weight: bold;
}

.search-section {
    margin: 20px 0;
}

.table-section {
    margin-bottom: 20px;

}

.article-details {
    margin-bottom: 20px;
    background-color: #fff;
    padding: 20px;
    border-radius: 10px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.details-row {
    margin: 0;
    padding: 0;
}

.details-item {
    display: flex;
    justify-content: center;
    align-items: center;

}

.statistic-title {
    font-size: 20px;
    color: #3cc4ce;
    font-weight: bold;
}

.article-content {
    // padding: 20px;
    background: #f9f9f9;
}

.editor {
    height: 800px;
    /* Adjust height as needed */
    margin-bottom: 20px;
}

.update-btn {
    display: flex;
    justify-content: flex-end;
    margin-top: 20px;
}

.pager {
    margin-top: 20px;
}

.pagerA {
    display: flex;
    justify-content: center;
}

.article-head,
.article-detail {
    background: rgba(255, 255, 255, 0.8);
}

.scrollbar {
    scrollbar-width: thin;
    scrollbar-color: transparent transparent;
}

.scrollbar::-webkit-scrollbar {
    width: 8px;
}

.scrollbar::-webkit-scrollbar-thumb {
    background-color: transparent;
}

.scrollbar::-webkit-scrollbar-track {
    background: transparent;
}
</style>
