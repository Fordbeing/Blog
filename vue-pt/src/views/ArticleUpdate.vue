<template>
 
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

onMounted(() => {
    getCategoryList()
});


</script>

<style scoped>
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

.article-head,
.article-detail {
    background: rgba(255, 255, 255, 0.8);
}
</style>