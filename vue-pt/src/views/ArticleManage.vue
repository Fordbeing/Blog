<template>
    <el-container>
        <el-main>
            <div class="header">
                <el-row class="title-row">
                    文章修改
                </el-row>
            </div>

            <div class="search-section">
                <el-form :inline="true">
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
                    <el-form-item>
                        <el-dropdown @command="handleCommand">
                            <el-button type="primary">
                                分类查看<el-icon class="el-icon--right"><arrow-down /></el-icon>
                            </el-button>
                            <template #dropdown>
                                <el-dropdown-menu>
                                    <el-dropdown-item v-for="(item, index) in dropdownItems" :key="index"
                                        :command="item.name">
                                        {{ item.name }}
                                    </el-dropdown-item>
                                </el-dropdown-menu>
                            </template>
                        </el-dropdown>
                    </el-form-item>
                </el-form>
            </div>

            <div class="table-section">
                <el-table :data="postData.list" style="width: 100%" border stripe>
                    <el-table-column v-for="item in tableLabel" :prop="item.prop" :label="item.label"
                        :width="item.width ? item.width : 125" />

                    <!-- 启用栏 -->
                    <el-table-column label="热门" width="100">
                        <template #default="{ row }">
                            <el-switch v-model="row.enabled" @change="handleStatusChange(row)"></el-switch>
                        </template>
                    </el-table-column>

                    <el-table-column fixed="right" label="操作" min-width="200">
                        <template v-slot:default="scope">
                            <el-button size="small" @click="handleClick(scope.row)">
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


        </el-main>

        <el-dialog title="查看文章" v-model="dialogVisible" width="80%" @close="handleDialogClose">
            <el-form>
                <el-form-item label="标题">
                    <el-input v-model="dialogTitle" :disabled="show"></el-input>
                </el-form-item>
                <el-form-item label="作者">
                    <el-input v-model="dialogAuthor" :disabled="show"></el-input>
                </el-form-item>
                <el-form-item label="分类">
                    <el-input v-model="dialogCategory" :disabled="show"></el-input>
                </el-form-item>
                <el-form-item label="发布时间">
                    <el-input v-model="dialogPublishDate" disabled></el-input>
                </el-form-item>
                <el-form-item v-if="action === 'click'" label="内容">
                    <MdPreview v-model="dialogContent" :config="editorConfig" :disabled="show" theme="dark" />
                </el-form-item>
                <el-form-item v-else label="内容">
                    <MdEditor v-model="dialogContent" :config="editorConfig" :disabled="show" theme="dark" />
                </el-form-item>
            </el-form>

            <!-- Dialog footer for 'click' action -->
            <span class="dialog-footer footer-align-right" v-if="action === 'click'" slot="footer">
                <el-button @click="dialogVisible = false">关闭</el-button>
            </span>

            <!-- Dialog footer for 'edit' action -->
            <span class="dialog-footer footer-align-right" v-else slot="footer">
                <el-button type="primary" @click="handleSave">保存</el-button>
                <el-button @click="dialogVisible = false">关闭</el-button>
            </span>
        </el-dialog>

    </el-container>
</template>

<script setup>
import { ref, getCurrentInstance, onMounted, reactive, nextTick } from 'vue'
import { useAllDataStore } from '@/stores'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useTransition } from '@vueuse/core'
import { MdPreview, MdEditor } from 'md-editor-v3';
import 'md-editor-v3/lib/style.css';

const text = ref('# Hello Editor');
const mdTitle = ref('');
const mdAuthor = ref('')
const createTime = ref('')

const action = ref('')

const dialogVisible = ref(false);
const dialogTitle = ref('');
const dialogAuthor = ref('');
const dialogPublishDate = ref('');
const dialogCategory = ref('');
const dialogContent = ref('');
const editorConfig = {}; // 根据需要自定义编辑器配置

const show = ref('')

const handleClick = (row) => {
    dialogTitle.value = row.title;
    dialogAuthor.value = row.author;
    dialogPublishDate.value = formatDate(row.publishDate);
    dialogContent.value = row.content;
    dialogCategory.value = row.categoryName;
    action.value = 'click';
    show.value = true;
    dialogVisible.value = true;
}

const formData = ref({})

const handleEdit = (row) => {
    formData.value.postID = row.postID;
    dialogTitle.value = row.title;
    dialogAuthor.value = row.author;
    dialogPublishDate.value = formatDate(row.publishDate);
    dialogContent.value = row.content;
    dialogCategory.value = row.categoryName;
    action.value = '';
    show.value = false;
    dialogVisible.value = true;
}

const handleSave = () => {
    formData.value.title = dialogTitle.value;
    formData.value.author = dialogAuthor.value;
    formData.value.content = dialogContent.value;
    formData.value.categoryName = dialogCategory.value;
    PostUpdate(formData.value)

    dialogVisible.value = false;
}


const handleDialogClose = () => {
    dialogTitle.value = '';
    dialogAuthor.value = '';
    dialogPublishDate.value = '';
    dialogContent.value = '';
}

const getPostCategoryList = async () => {
    const data = await proxy.$api.getPostCategoryList()
    dropdownItems.value = data
    dropdownItems.value.unshift({ name: '全部', value: '' })
}

// 模拟分类数据
const dropdownItems = ref([])

const active = ref('全部')

const handleCommand = (command) => {
    if (command === '全部') {
        getPostData(1, 10)
        active.value = '全部'

    } else {
        active.value = command
        getAllPostByLabel(command, 1, 10)

    }

}


const getAllPostByLabel = async (label, pageIndex, pageSize) => {
    const data = await proxy.$api.getAllPostByLabel(label, pageIndex, pageSize)
    postData.list = data.records.map(post => ({
            ...post,
            publishDate: formatDate(post.publishDate),
            enabled: post.hotArticle === 1
        }));
    active.value = label
    configA.page = 1
    configA.total = data.total
}


// 日期格式
const formatDate = (dateString) => {
    const date = new Date(dateString);

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};

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





// 启用热点
const handleStatusChange = (row) => {
    const enable = row.enabled ? "1" : "0";
    updatePostStatus(row.postID, enable);
}

const updatePostStatus = async (postID, status) => {

    try {
        await proxy.$api.updatePostStatus(postID, status)
        
        if (status === "1") {
            ElMessage({
                type: 'success',
                message: 'enabled Success',
            });
        } else {
            ElMessage({
                type: 'warning',
                message: 'disabled Success',
            });
        }
        
    } catch (error) {
        ElMessage({
            type: 'error',
            message: 'enabled failed: ' + error.message,
        });
    }

}

const handleClear = () => {
    globalID.value = ''
    Title.value = ''
    Author.value = ''
    configA.page = 1
    active.value = '全部'
    getPostData(1, 10)
}



const handleChange = (page) => {
    if (active.value === '全部') {
        configA.page = page
        getPostData(page, 10)
    } else {
        configA.page = page
        getAllPostByLabel(active.value, page, 10)
    }
}

const handlePage = () => {

    if (active.value === '全部') {
        getPostData(configA.page, 10)
    } else {
        getAllPostByLabel(active.value, configA.page, 10)
    }
}

const handleSearch = async () => {
    let data = "";
    if (Title.value === '' && Author.value === '') {
        getPostData(1, 10);
    } else {
        data = await GetPostByTitle(Title, Author, 1, 10);
    }
}

const GetPostByTitle = async (Title, Author, page, limit) => {
    let Fdata = '';
    if (Title.value === '' && Author.value !== '') {
        Fdata = await proxy.$api.GetPostByTitle('default-title', Author.value, page, limit)
    } else if (Title.value !== '' && Author.value === '') {
        Fdata = await proxy.$api.GetPostByTitle(Title.value, 'default-authorName', page, limit)
    } else if (Title.value === '' && Author.value === '') {
        active.value = '全部'
        configA.page = 1
        getPostData(1, 10)
    } else {
        Fdata = await proxy.$api.GetPostByTitle(Title.value, Author.value, page, limit)
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
        if (active.value === '全部') {
            getPostData(1, 10)
        } else {
            getAllPostByLabel(active.value, 1, 10)
        }
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

// 启用热点// 确保 postData.list 正确设置了 enabled 属性
const getPostData = async (current, limit) => {
    try {
        let data = await proxy.$api.getPostData(current, limit);
        // 处理 data.list，将 hotArticle 转换为 true 或 false
        postData.list = data.records.map(post => ({
            ...post,
            publishDate: formatDate(post.publishDate),
            enabled: post.hotArticle === 1
        }));
        active.value = '全部';
        configA.page = 1

        configA.total = data.total;  // 确保这里的 total 被正确设置
    } catch (error) {
        console.error('Failed to fetch post data:', error);
    }
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
    getPostData(1, 10)
    getPostCategoryList()
})
</script>

<style scoped lang="less">
.el-container {
    padding: 0px;
    height: auto;
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
    border-radius: 12px;
    /* 调整这里的值以设置圆角大小 */
    overflow: hidden;
    /* 让内容也遵循圆角 */
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    /* 为表格添加阴影，使其更突出 */
}

.pager {
    margin-top: 20px;
}

.pagerA {
    display: flex;
    justify-content: center;
}


.footer-align-right {
    display: flex;
    justify-content: flex-end; /* 将按钮向右对齐 */
    padding: 10px 20px; /* 可选：增加内边距 */
}
.footer-align-right .el-button {
    margin-left: 10px; /* 按钮之间留出间距 */
}

</style>
