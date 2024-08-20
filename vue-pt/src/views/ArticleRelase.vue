<template>

    <div class="articleUpdateHeader">
        <el-form :inline="true" :model="formInline">
            <el-form-item label="文章标题">
                <el-input placeholder="请输入文章标题" v-model="Title" ref="articleTitleInput"></el-input>
            </el-form-item>
            <el-form-item label="作者">
                <el-input placeholder="请输入作者名称" v-model="Author" ref="articleAuthorInput"></el-input>
            </el-form-item>

            <!-- <el-form-item>
                        <el-button type="primary" @click="handleSearch">查询</el-button>
                    </el-form-item> -->

            <el-form-item>
                <el-button type="primary" @click="handleRealse">发布</el-button>
            </el-form-item>
        </el-form>
    </div>

    <div class="articleUpdateTitle">
        <el-row>
            <el-col :span="6">
                <div style="display: inline-flex; align-items: center; font-size: 20px; margin-bottom: 12px;">
                    文章标题
                </div>
                <el-statistic :value="268500" />
            </el-col>
            <el-col :span="6">
                <el-statistic :value="138">
                    <template #title>
                        <div style="display: inline-flex; align-items: center; font-size: 20px;margin-bottom: 8px;">
                            作者
                            <el-icon style="margin-left: 4px" :size="12">
                                <Male />
                            </el-icon>
                        </div>
                    </template>
                    <template #suffix>/100</template>
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
                <el-statistic :value="562">
                </el-statistic>
            </el-col>
        </el-row>
    </div>

    <div class="articleUpdateContent">
        <md-editor v-model="text" :config="editorConfig" theme="dark" />
    </div>
</template>

<script setup>

import { ref, getCurrentInstance, onMounted, reactive } from 'vue'
import { MdEditor } from 'md-editor-v3';
import { ElMessage } from 'element-plus'
import { h } from 'vue'
import 'md-editor-v3/lib/style.css';

const { proxy } = getCurrentInstance()

// 假设 md-editor-v3 支持通过 config prop 传递配置  
const text = ref('# Hello Editor');

const Title = ref('')
const Author = ref('')
const articleTitleInput = ref(null)
const articleAuthorInput = ref(null)

const postDto = reactive({
    'title': Title,
    'content': text,
    'author': Author,
})
const handleRealse = () => {
    if (Title.value == '') {
        ElMessage({
            message: '请输入文章标题！',
            type: 'warning',
        })
        articleTitleInput.value.focus()

    } else if (Author.value == '') {
        ElMessage({
            message: '请输入作者名称！',
            type: 'warning',
        })
        articleAuthorInput.value.focus()
    } else {
        ElMessage({
            message: '发布成功！',
            type: 'success',
        })
        savePost(postDto)
    }


}
// 获取表格数据
const savePost = async (postDto) => {
    await proxy.$api.savePost(postDto)
}



</script>

<style scoped lang="less">
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
    height: 650px;
    background-color: #fff;

}

.md-editor {
    height: 720px;
    width: 100%;
}
</style>