<template>
    <div class="category-management">
        <div class="header">
            <h2>评论管理</h2>
        </div>

        <!-- 分类列表 -->
        <el-table :data="comments" style="width: 100%" stripe>
            <!-- 动态生成列 -->
            <el-table-column v-for="item in commentLabel" :key="item.prop" :prop="item.prop" :label="item.label"
                :width="item.width ? item.width : 125">
            </el-table-column>

            <!-- 启用栏 -->
            <el-table-column label="启用" width="100">
                <template #default="{ row }">
                    <el-switch v-model="row.enabled" @change="handleStatusChange(row)"></el-switch>
                </template>
            </el-table-column>

            <!-- 操作列 -->
            <el-table-column label="操作" width="300">
                <template #default="{ row }">
                    <el-button @click="handleViewComment(row)" type="primary" size="small">
                        查看
                    </el-button>
                    <el-button @click="handleDeleteComment(row)" type="danger" size="small">
                        删除
                    </el-button>
                </template>
            </el-table-column>
        </el-table>

        <!-- 评论详情对话框 -->
        <el-dialog title="评论详情" v-model="showDetailDialog" width="50%">
            <el-form :model="currentComment" label-width="120px">
                <el-form-item label="评论ID">
                    <el-input v-model="currentComment.commentID" disabled></el-input>
                </el-form-item>
                <el-form-item label="用户名">
                    <el-input v-model="currentComment.author" disabled></el-input>
                </el-form-item>
                <el-form-item label="邮箱">
                    <el-input v-model="currentComment.email" disabled></el-input>
                </el-form-item>
                <el-form-item label="内容">
                    <el-input type="textarea" v-model="currentComment.content" disabled></el-input>
                </el-form-item>
                <el-form-item label="发布时间">
                    <el-input v-model="currentComment.date" disabled></el-input>
                </el-form-item>
                <!-- 其他需要显示的详细信息 -->
            </el-form>
            <template #footer>
                <el-button @click="showDetailDialog = false">关闭</el-button>
            </template>
        </el-dialog>
    </div>
</template>

<script setup>
import { ref, getCurrentInstance, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useAllDataStore } from '@/stores'
const { proxy } = getCurrentInstance()

const dataStore = useAllDataStore()

const commentLabel = dataStore.state.CommentLabelData

// 日期格式 - 年月日时分秒
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

// 评论数据
const comments = ref([])

// 当前查看的评论详细信息
const currentComment = ref({})

// 控制详情对话框显示与隐藏
const showDetailDialog = ref(false)

// 处理启用状态的变化
const handleStatusChange = (comment) => {
    const enable = comment.enabled ? "1" : "0"
    UpdateCommentStatus(comment.commentID, enable)
}

const UpdateCommentStatus = async (commentID, status) => {
    try {
        await proxy.$api.UpdateCommentStatus(commentID, status)
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

// 删除评论
const handleDeleteComment = (comment) => {
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
            return DeleteComment(comment.commentID)
                .then(() => {
                    getAllComment()
                    ElMessage({
                        type: 'success',
                        message: 'Delete Success',
                    });
                })
                .catch(err => {
                    ElMessage({
                        type: 'error',
                        message: 'Failed to delete category: ' + err.message,
                    });
                });
        })
        .catch(() => {
            ElMessage({
                type: 'info',
                message: '删除操作已取消',
            });
        });
}

// 查看评论详细信息
const handleViewComment = (comment) => {
    currentComment.value = { 
        ...comment, 
        date: formatDate(comment.date) 
    }
    showDetailDialog.value = true
}

// 获取所有评论数据
const getAllComment = async () => {
    const data = await proxy.$api.getAllComment()
    comments.value = data.map(comment => ({
        ...comment,
        date: formatDate(comment.date) ,
        enabled: comment.status === 1
    }))
}

// 删除评论
const DeleteComment = async (commentID) => {
    await proxy.$api.DeleteComment(commentID)
    getAllComment()
}

onMounted(() => {
    getAllComment()
})
</script>


<style scoped lang="less">
.category-management {
    padding: 20px;
    background: #f5f5f5;
    border-radius: 8px;
}

.header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
}

.el-table {
    background: #ffffff;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.dialog-footer {
    text-align: right;
}

.el-dialog {
    .el-dialog__header {
        background-color: #f0f0f0;
    }

    .el-dialog__footer {
        background-color: #f9f9f9;
    }
}
</style>
