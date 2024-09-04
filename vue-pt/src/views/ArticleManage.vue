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



// 启用热点
const handleStatusChange = (row) => {
    const enable = row.enabled ? "1" : "0";
    updatePostStatus(row.postID, enable);
}

const updatePostStatus = async(postID,status) =>{

    try {
        await proxy.$api.updatePostStatus(postID,status)
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
    GetPostByTitle(Title, Author)
}

const handleClick = () => {
    console.log('click')
}

const handleChange = (page) => {
    configA.page = page
    getPostData(page, 10)
}

const handlePage = () => {
    getPostData(configA.page, 10)
}

const handleUpdate = () => {
    let data = {
        postID: globalID.value,
        author: mdAuthor.value,
        readingTime: source.value,
        wordCount: text.value.length,
        title: mdTitle.value,
        content: text.value,
    }
    PostUpdate(data)
    getPostData(configA.page, 10)
}

const handleSearch = async () => {
    let data = "";
    if (Title.value === '' && Author.value === '') {
        getPostData(1, 10);
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
        configA.page = 1
        getPostData(1, 10)
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

// 启用热点// 确保 postData.list 正确设置了 enabled 属性
const getPostData = async (current, limit) => {
    try {
        let data = await proxy.$api.getPostData(current, limit);
        // 处理 data.list，将 hotArticle 转换为 true 或 false
        console.log(data)
        postData.list = data.records.map(post => ({
            ...post,
            publishDate: formatDate(post.publishDate),
            enabled: post.hotArticle === 1
        }));

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
    border-radius: 12px; /* 调整这里的值以设置圆角大小 */
    overflow: hidden; /* 让内容也遵循圆角 */
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1); /* 为表格添加阴影，使其更突出 */
}

.pager {
    margin-top: 20px;
}

.pagerA {
    display: flex;
    justify-content: center;
}
</style>

