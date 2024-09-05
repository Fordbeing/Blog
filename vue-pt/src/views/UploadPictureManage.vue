<template>
    <div class="header">
        <h2>图片管理</h2>
        <el-dropdown @command="handleCommand">
            <el-button type="primary">
                图片分类查看<el-icon class="el-icon--right"><arrow-down /></el-icon>
            </el-button>
            <template #dropdown>
                <el-dropdown-menu>
                    <el-dropdown-item v-for="(item, index) in dropdownItems" :key="index" :command="item.name">
                        {{ item.name }}
                    </el-dropdown-item>
                </el-dropdown-menu>
            </template>
        </el-dropdown>
        <!-- 添加按钮 -->
        <el-button type="primary" @click="showAddDialog = true">
            添加图片
        </el-button>
    </div>

    <!-- 分类列表 -->
    <el-table :data="pictures" style="width: 100%" stripe>
        <!-- 动态生成列 -->
        <el-table-column v-for="item in pictureLabel" :key="item.prop" :prop="item.prop" :label="item.label"
            :width="item.width ? item.width : 125">
            <template v-if="item.prop === 'filepath'" #default="{ row }">
                <img :src="row.filepath" alt="图片" style="max-width: 400px; max-height: 200px;" />
            </template>
            <template v-else #default="{ row }">
                {{ row[item.prop] }}
            </template>
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
                <el-button @click="handleViewPicture(row)" type="primary" size="small">
                    查看
                </el-button>
                <el-button @click="handleDeletePicture(row)" type="danger" size="small">
                    删除
                </el-button>
            </template>
        </el-table-column>
    </el-table>


    <!-- 评论详情对话框 -->
    <el-dialog title="评论详情" v-model="showDetailDialog" width="50%">
        <el-form :model="currentPicture" label-width="120px">
            <el-form-item label="图片名称">
                <el-input v-model="currentPicture.filename" disabled></el-input>
            </el-form-item>
            <el-form-item label="图片描述">
                <el-input type="textarea" v-model="currentPicture.description" disabled></el-input>
            </el-form-item>
            <el-form-item label="图片分类">
                <el-input v-model="currentPicture.category" disabled></el-input>
            </el-form-item>
            <el-form-item label="上传时间">
                <el-input v-model="currentPicture.uploadTime" disabled></el-input>
            </el-form-item>
            <el-form-item label="图片">
                <el-image :src="currentPicture.filepath" style="width: auto; height: auto;"></el-image>
            </el-form-item>
            <!-- 其他需要显示的详细信息 -->
        </el-form>
        <template #footer>
            <el-button @click="showDetailDialog = false">关闭</el-button>
        </template>
    </el-dialog>

    <!-- 添加图片对话框 -->
    <el-dialog title="添加图片" v-model="showAddDialog" width="50%">
        <el-form :model="newPicture" ref="addPictureForm" label-width="120px">
            <el-form-item label="图片名称" :rules="[{ required: true, message: '请输入图片名称', trigger: 'blur' }]">
                <el-input v-model="newPicture.filename"></el-input>
            </el-form-item>
            <el-form-item label="图片类型" :rules="[{ required: true, message: '请选择图片类型', trigger: 'change' }]">
                <el-select v-model="newPicture.category" placeholder="选择图片类型" @change="handleCategoryChange">
                    <el-option v-for="option in categories" :key="option.name" :label="option.name"
                        :value="option.name">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="图片描述">
                <el-input type="textarea" v-model="newPicture.description"></el-input>
            </el-form-item>
            <el-form-item label="上传图片">
                <el-upload class="upload-demo" drag :action="uploadAction" :show-file-list="false" accept="image/*"
                    :before-upload="beforeUpload" :on-change="handleFileChange" :on-preview="handlePreview">
                    <i class="el-icon-upload"></i>
                    <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
                </el-upload>
                <div v-if="previewImage" class="preview-container">
                    <img :src="previewImage" alt="Preview" class="preview-image">
                    <el-button @click="handleCancelPreview" type="danger" size="small">取消图片</el-button>
                </div>
            </el-form-item>
        </el-form>
        <template #footer>
            <el-button @click="handleClearData">取消</el-button>
            <el-button type="primary" @click="handleAddPicture">确定</el-button>
        </template>
    </el-dialog>
</template>

<script setup>
import { ref, computed, getCurrentInstance, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useAllDataStore } from '@/stores'
const { proxy } = getCurrentInstance()

const dataStore = useAllDataStore()

const pictureLabel = dataStore.state.PictureLabelData


// 模拟分类数据
const dropdownItems = ref([])

const handleCommand = (command) => {
    if(command ==='全部'){
        getAllPicture()
    }else{
        getAllPictureByLabel(command)
    }
    
}

const getAllPictureByLabel = async (label) => {
    proxy.$api.getAllPictureByLabel(label).then((res) => {
        pictures.value = res.map(picture => ({
        ...picture,
        uploadTime: formatDate(picture.uploadTime),
        enabled: picture.status === 1
    }))
    })

}


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
const pictures = ref([])
const currentPicture = ref({})

// 控制详情对话框显示与隐藏
const showDetailDialog = ref(false)

// 控制添加对话框显示与隐藏
const showAddDialog = ref(false)

// 新增图片的数据
const newPicture = ref({
    filename: '',
    category: '',
    description: ''
})

// 上传图片的 API 地址
const uploadAction = ''

// 当前选择的文件
const selectedFile = ref(null)

// 预览图片的 URL
const previewImage = ref(null)

// 处理分类选择
const handleCategoryChange = (value) => {
    console.log(value)
    newPicture.value.category = value

}

const categories = ref({})


// 得到所有分类
const FileGetPictureCategoryList = async () => {
    const data = await proxy.$api.FileGetPictureCategoryList()
    categories.value = data
    dropdownItems.value = data
    dropdownItems.value.unshift({ name: '全部', value: '' })
}

// 表单验证
const beforeUpload = (file) => {
    if (!isFormValid.value) {
        ElMessage({
            type: 'warning',
            message: '请先填写其他信息',
        });
        return false
    }
    return true
}

// 处理文件选择变化
const handleFileChange = (file, fileList) => {
    selectedFile.value = file.raw
    previewImage.value = URL.createObjectURL(file.raw) // 创建图片预览 URL
}

// 处理图片预览
const handlePreview = (file) => {
    previewImage.value = URL.createObjectURL(file.raw)
}

// 取消图片预览
const handleCancelPreview = () => {
    previewImage.value = null
    selectedFile.value = null
}

// 处理启用状态的变化
const handleStatusChange = (picture) => {
    const enable = picture.enabled ? "1" : "0"
    UpdatePictureStatus(picture.imageId, enable)
}

const UpdatePictureStatus = async (imageId, status) => {
    try {
        await proxy.$api.UpdatePictureStatus(imageId, status)
        if (status === "1") {
            ElMessage({
                type: 'success',
                message: 'Enabled Success',
            });
        } else {
            ElMessage({
                type: 'warning',
                message: 'Disabled Success',
            });
        }
    } catch (error) {
        ElMessage({
            type: 'error',
            message: 'Enabled Failed: ' + error.message,
        });
    }
}

// 删除图片
const handleDeletePicture = (picture) => {
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
            return DeletePicture(picture.imageId)
                .then(() => {
                    getAllPicture()
                    ElMessage({
                        type: 'success',
                        message: 'Delete Success',
                    });
                })
                .catch(err => {
                    ElMessage({
                        type: 'error',
                        message: 'Failed to delete picture: ' + err.message,
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

// 查看图片详细信息
const handleViewPicture = (picture) => {
    currentPicture.value = {
        ...picture,
        uploadTime: formatDate(picture.uploadTime)
    }
    showDetailDialog.value = true
}

// 获取所有图片数据
const getAllPicture = async () => {
    const data = await proxy.$api.getAllPicture()
    pictures.value = data.map(picture => ({
        ...picture,
        uploadTime: formatDate(picture.uploadTime),
        enabled: picture.status === 1
    }))
}

// 删除图片
const DeletePicture = async (imageId) => {
    await proxy.$api.DeletePicture(imageId)
    getAllPicture()
}

// 处理添加图片
const handleAddPicture = async () => {

    if (!newPicture.value.filename) {
        ElMessage({
            type: 'warning',
            message: '请先填写文件名称',
        });
    } else if (!newPicture.value.category) {
        ElMessage({
            type: 'warning',
            message: '请先选择图片分类',
        });
    } else if (!selectedFile.value) {
        ElMessage({
            type: 'warning',
            message: '请先选择图片',
        });
    } else {
        const formData = new FormData();
        formData.append('file', selectedFile.value);
        formData.append('filename', newPicture.value.filename);
        formData.append('category', newPicture.value.category);
        formData.append('description', newPicture.value.description);

        try {
            await proxy.$api.UploadPicture(formData);
            ElMessage({
                type: 'success',
                message: 'Upload Success',
            });

            // 上传成功后，刷新图片列表
            getAllPicture();
            handleClearData(); // 清除数据
            showAddDialog.value = false;
        } catch (error) {
            ElMessage({
                type: 'error',
                message: 'Upload Failed: ' + error.message,
            });
        }
    }


}

// 清除添加图片对话框中的数据
const handleClearData = () => {
    newPicture.value = {
        filename: '',
        category: '',
        description: ''
    }
    previewImage.value = null
    selectedFile.value = null
    showAddDialog.value = false;

}

onMounted(() => {
    getAllPicture()
    FileGetPictureCategoryList()
})
</script>

<style scoped lang="less">
.header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
}
h2{
    margin: 0;
    font-size: 18px;
    font-weight: bold;
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

.preview-container {
    margin-top: 10px;
    text-align: center;
}

.preview-image {
    max-width: 100%;
    max-height: 200px;
    object-fit: contain;
}
</style>
