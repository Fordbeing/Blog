<template>
    <div class="articleUpdateContainer">
        <!-- 文章信息输入部分 -->
        <el-form :inline="true" :model="formInline" class="articleUpdateHeader">
            <el-form-item label="文章标题">
                <el-input placeholder="请输入文章标题" v-model="Title" ref="articleTitleInput"></el-input>
            </el-form-item>

            <el-form-item label="分类">
                <el-select v-model="Category" placeholder="请选择分类" ref="articleCategoryInput"
                    @change="handleCategoryChange">
                    <el-option v-for="item in categories" :key="item.categoryID" :label="item.name"
                        :value="item.name"></el-option>
                </el-select>
            </el-form-item>

            <el-form-item label="作者">
                <el-input placeholder="请输入作者名称" v-model="Author" ref="articleAuthorInput" :disabled="true"></el-input>
            </el-form-item>

            <el-form-item label="热点文章">
                <el-switch v-model="enable" @change="handleStatusChange"></el-switch>
            </el-form-item>

            <el-form-item class="summary-form-item">
                <el-input type="textarea" placeholder="请输入简介" v-model="Summary" ref="articleSummaryInput"
                    rows="4"></el-input>
            </el-form-item>

            <el-form-item>
                <el-button type="primary" @click="handleGenerateSummary">生成简介</el-button>
            </el-form-item>

            <el-form-item>
                <el-tooltip content="不满意，编辑栏有回退功能哦" placement="top">
                    <el-button type="primary" @click="handleOptimizeArticle">文章优化</el-button>
                </el-tooltip>
            </el-form-item>

            <el-form-item>
                <el-tooltip content="不满意，编辑栏有回退功能哦" placement="top">
                    <el-button type="primary" @click="handleContinueArticle">文章续写</el-button>
                </el-tooltip>
            </el-form-item>

            <el-form-item>
                <el-button type="primary" @click="handleRealse">发布</el-button>
            </el-form-item>
        </el-form>

        <!-- 文章内容编辑部分 -->
        <div class="articleUpdateContent">
            <md-editor v-model="text" :config="editorConfig" theme="dark" />
        </div>
    </div>
</template>

<script setup>
import { ref, computed, getCurrentInstance, reactive, onMounted } from 'vue'
import { MdEditor } from 'md-editor-v3';
import { ElMessage, ElLoading } from 'element-plus';

import 'md-editor-v3/lib/style.css';

const { proxy } = getCurrentInstance()

const getPostCategoryList = async () => {
    let data = await proxy.$api.getPostCategoryList()
    categories.value = data
};

const text = ref('# Hello Editor');
const Title = ref('')
const Category = ref('')
const Author = ref('')
const Summary = ref('')
const articleTitleInput = ref(null)
const articleCategoryInput = ref(null)
const articleAuthorInput = ref(null)
const articleSummaryInput = ref(null)
const enable = ref(false)


const hotArticle = ref(0)

const handleStatusChange = (value) => {
    hotArticle.value = value ? 1 : 0
    // 这里可以进行其他逻辑处理，例如将状态发送给后端
}

const categories = ref([]);

const userData = JSON.parse(localStorage.getItem('userInfo'))
Author.value = userData.username

const wordCount = computed(() => text.value.length);
const estimatedReadingTime = computed(() => Math.ceil(wordCount.value / 200));

const postDto = reactive({
    'title': Title,
    'category': Category,
    'content': text,
    'author': Author,
    'summary': Summary,
    'hotArticle': hotArticle,
    'readingTime': estimatedReadingTime,
    'wordCount': wordCount,
    'categoryName': Category,
})

const handleRealse = () => {
    if (Title.value === '') {
        ElMessage({
            message: '请输入文章标题！',
            type: 'warning',
        })
        articleTitleInput.value.focus()
    } else if (Category.value === '') {
        ElMessage({
            message: '请选择分类！',
            type: 'warning',
        })
        articleCategoryInput.value.focus()
    } else if (Author.value === '') {
        ElMessage({
            message: '请输入作者名称！',
            type: 'warning',
        })
        articleAuthorInput.value.focus()
    } else if (Summary.value === '') {
        ElMessage({
            message: '请输入简介！',
            type: 'warning',
        })
        articleSummaryInput.value.focus()
    } else if (text.value === '# Hello Editor') {
        ElMessage({
            message: '请输入内容！',
            type: 'warning',
        })
        text.value.focus()
    } else {
        ElMessage({
            message: '发布成功！',
            type: 'success',
        })
        savePost(postDto)
    }
}

const savePost = async (postDto) => {
    await proxy.$api.savePost(postDto)
}

const aiDto1 = reactive({
    'content': text,
})

const getSummary = async (aiDto1) => {
    if (text.value === '') {
        ElMessage({
            type: 'warning',
            message: '请输入文章内容！',
        })
    } else if (text.value.length < 50) {
        ElMessage({
            type: 'warning',
            message: '文章内容字数太少！请输入50字以上！',
        })
    } else {
        // 开启加载等待框
        const loading = ElLoading.service({
            lock: true,
            text: '正在生成简介...',
            background: 'rgba(0, 0, 0, 0.7)',
        })

        try {
            let content = await proxy.$api.getSummary(aiDto1)
            Summary.value = content.content;

            ElMessage({
                type: 'success',
                message: '简介生成完成',
            });
        } catch (error) {
            ElMessage({
                type: 'error',
                message: '简介生成失败: ' + error.message,
            });
        } finally {
            // 请求完成后关闭加载框
            loading.close()
        }
    }
}


const handleGenerateSummary = () => {
    getSummary(aiDto1)
}

const handleOptimizeArticle = async () => {
    if (text.value === '') {
        ElMessage({
            type: 'warning',
            message: '请输入文章内容！',
        });
    } else if (text.value.length < 50) {
        ElMessage({
            type: 'warning',
            message: '文章内容字数太少！请输入50字以上！',
        });
    } else {
        const loading = ElLoading.service({
            lock: true,
            text: '正在优化文章...',
            background: 'rgba(0, 0, 0, 0.7)',
        })
        try {
            let optimizedContent = await proxy.$api.handleOptimizeArticle(aiDto1);
            text.value = optimizedContent.content;
            ElMessage({
                type: 'success',
                message: '文章优化完成',
            });
        } catch (error) {
            ElMessage({
                type: 'error',
                message: '文章优化失败: ' + error.message,
            });
        } finally {
            loading.close();
        }
    }
};

const handleContinueArticle = async () => {
    if (text.value === '') {
        ElMessage({
            type: 'warning',
            message: '请输入文章内容！',
        });
    } else if (text.value.length < 50) {
        ElMessage({
            type: 'warning',
            message: '文章内容字数太少！请输入50字以上！',
        });
    } else {
        const loading = ElLoading.service({
            lock: true,
            text: '正在续写文章...',
            background: 'rgba(0, 0, 0, 0.7)',
        })
        try {
            let continuedContent = await proxy.$api.handleContinueArticle(aiDto1);
            text.value += '\n\n' + continuedContent.content;
            ElMessage({
                type: 'success',
                message: '文章续写完成',
            });
        } catch (error) {
            ElMessage({
                type: 'error',
                message: '文章续写失败: ' + error.message,
            });
        } finally {
            loading.close();
        }
    }
};

const handleCategoryChange = (value) => {
    articleCategoryInput.value = value
}

onMounted(() => {
    getPostCategoryList()
})
</script>



<style scoped lang="less">
.articleUpdateContainer {
    width: 100%;
    background: url('path/to/your/background-image.jpg') no-repeat center center fixed;
    background-size: cover;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.articleUpdateHeader {
    background: rgba(216, 209, 209, 0.8);
    /* 半透明背景 */
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.05);
    margin-bottom: 20px;
}

.articleUpdateHeader .el-form-item {
    margin-bottom: 10px;
}

.summary-form-item {
    width: 100%;
    margin-bottom: 10px;
}

.el-input {
    border-radius: 8px;
    background: #9abfc4;
    border: 1px solid #5a8f7f;
    padding: 10px;
}

.el-select {
    border-radius: 8px;
    background: #9abfc4;
    border: 1px solid #5a8f7f;
    padding: 10px;
    width: 200px;
}

.el-input[type="textarea"] {
    height: 120px;
    /* 增加高度 */
    resize: vertical;
    /* 允许垂直调整大小 */
}

.el-button {
    border-radius: 8px;
    padding: 10px 20px;
}

.articleUpdateContent {
    background: rgba(187, 153, 153, 0.8);
    /* 半透明背景 */
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(26, 24, 24, 0.05);
}

.md-editor {
    height: 600px;
    width: 100%;
    border-radius: 8px;
}

.el-backtop {
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}
</style>
