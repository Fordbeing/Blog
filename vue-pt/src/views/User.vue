<template>
    <div class="user-header">
        <el-button type="primary" @click="handleAdd">新增</el-button>
        <el-form :inline="true" :model="formInline" class="search-form">
            <el-form-item label="用户名">
                <el-input placeholder="请输入用户名" v-model="formInline.keyWord" prefix-icon="el-icon-user"></el-input>
            </el-form-item>
            <el-form-item label="邮箱">
                <el-input placeholder="请输入邮箱" v-model="formInline.email" prefix-icon="el-icon-message"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="handleSearch">查询</el-button>
                <el-button type="primary" @click="handleClearSearch">清空</el-button>
            </el-form-item>
        </el-form>
    </div>

    <div class="table">
        <el-table :data="userData.list" style="width: 100%" border stripe>
            <el-table-column v-for="item in tableLabel" :prop="item.prop" :label="item.label"
                :width="item.width ? item.width : 125">
                <!-- 展示图片 -->
                <!-- <template v-if="item.prop === 'avatar'" #default="{ row }">
                    <img :src="row.avatar" alt="图片" style="max-width: 400px; max-height: 200px;" />
                </template>
<template v-else #default="{ row }">
                    {{ row[item.prop] }}
                </template> -->
            </el-table-column>
            <el-table-column fixed="right" label="操作" min-width="160">
                <template v-slot:default="scope">
                    <el-button size="small" @click="handleClick(scope.row)" plain>查看</el-button>
                    <el-button type="primary" size="small" @click="handleEdit(scope.row)">编辑</el-button>
                    <el-button @click="deleteUser(scope.row)" type="danger" size="small">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <div class="page">
            <el-pagination class="pagerA" background layout="prev, pager, next" :total='configA.total'
                @current-change="handleChange" />
        </div>
    </div>



    <el-dialog v-model="dialogVisible" :title="action == 'add' ? '新增用户' : '编辑用户'" width="35%"
        :before-close="handleClose" class="dialog-form">
        <el-form :inline="false" :model="formUser" :rules="rules" ref="userForm" label-width="80px">
            <el-row gutter="20">
                <el-col :span="12">
                    <el-form-item label="姓名" prop="username">
                        <el-input v-model="formUser.username" ref="usernameInput" placeholder="请输入姓名" />
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="密码" prop="password">
                        <el-input type="password" v-model="formUser.password" ref="passwordInput" placeholder="请输入密码" />
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row gutter="20">
                <el-col :span="12">
                    <el-form-item label="邮箱" prop="email">
                        <el-input v-model="formUser.email" ref="emailInput" placeholder="请输入邮箱" />
                    </el-form-item>
                </el-col>
            </el-row>

            <el-row gutter="20">
                <el-col :span="12">
                    <el-form-item label="上传图片">
                        <el-upload class="upload-demo" drag :action="uploadAction" :show-file-list="false"
                            accept="image/*" :before-upload="beforeUpload" :on-change="handleFileChange"
                            :on-preview="handlePreview">
                            <i class="el-icon-upload"></i>
                            <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
                        </el-upload>
                        <div v-if="previewImage" class="preview-container">
                            <img :src="previewImage" alt="Preview" class="preview-image">
                            <el-button @click="handleCancelPreview" type="danger" size="small">取消图片</el-button>
                        </div>
                    </el-form-item>
                </el-col>
            </el-row>


            <el-row gutter="20" justify="end">
                <el-form-item>
                    <el-button @click="handleCancel">取消</el-button>
                    <el-button type="primary" @click="onSubmit">确定</el-button>
                </el-form-item>
            </el-row>
        </el-form>
    </el-dialog>


    <!-- 评论详情对话框 -->
    <el-dialog title="用户详情" v-model="showDetailDialog" width="50%">
        <el-form :model="currentUser" label-width="120px">
            <el-form-item label="用户ID">
                <el-input v-model="currentUser.userID" disabled></el-input>
            </el-form-item>
            <el-form-item label="用户名">
                <el-input type="textarea" v-model="currentUser.username" disabled></el-input>
            </el-form-item>
            <el-form-item label="邮箱">
                <el-input type="textarea" v-model="currentUser.email" disabled></el-input>
            </el-form-item>
            <el-form-item label="密码">
                <el-input v-model="currentUser.password" disabled></el-input>
            </el-form-item>
            <el-form-item label="权限">
                <el-input v-model="currentUser.permissions" disabled></el-input>
            </el-form-item>
            <el-form-item label="上传时间">
                <el-input v-model="currentUser.registrationTime" disabled></el-input>
            </el-form-item>
            <el-form-item label="图片">
                <el-image :src="currentUser.avatar" style="width: auto; height: auto;"></el-image>
            </el-form-item>
            <!-- 其他需要显示的详细信息 -->
        </el-form>
        <template #footer>
            <el-button @click="showDetailDialog = false">关闭</el-button>
        </template>
    </el-dialog>



</template>

<script setup>
import { ref, getCurrentInstance, onMounted, reactive } from 'vue'
import { useAllDataStore } from '@/stores'
import { ElMessage, ElMessageBox } from 'element-plus'
const { proxy } = getCurrentInstance()

const store = useAllDataStore()

const tableLabel = store.state.tableLabelData;

const formInline = reactive({
    keyWord: '',
    email: '',
})

const formUser = reactive({})


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
const handleEdit = (row) => {
    formUser.username = row.username;
    formUser.password = row.password;
    formUser.email = row.email;
    formUser.userID = row.userID;

    action.value = 'edit';
    dialogVisible.value = true;
    getUserData(configA.page, 10)
};

const currentUser = ref({})
const showDetailDialog = ref(false)
const handleClick = (row) => {
    // 控制详情对话框显示与隐藏
    console.log(row)
    showDetailDialog.value = !showDetailDialog.value
    currentUser.value = row;
}


const handleChange = (page) => {
    configA.page = page
    getUserData(page, 10)
}

const handleSearch = () => {
    getByUsernameAndEmail(formInline.keyWord, formInline.email)
}

const handleClearSearch = () => {
    formInline.keyWord = '';
    formInline.email = '';
    configA.page = 1
    getUserData(1, 10)

}

const getByUsernameAndEmail = async (username, email) => {
    let data = [];
    try {
        if (username === '' && email === '') {
            configA.page = 1
            return getUserData(1, 10)
        } else if (username === '' && email !== '') {
            username = 'default-name';
        } else if (username !== '' && email === '') {
            email = 'default-email';
        }

        const response = await proxy.$api.getByUsernameAndEmail(username, email);
        userData.list = response.data;

        // 判断数据是否存在
        if (response.data && response.data.length > 0) {

        } else {
            ElMessage({
                type: 'info',
                message: '未找到匹配的用户',
            });
        }
    } catch (error) {
        ElMessage({
            type: 'error',
            message: '查询失败: ' + error.message,
        });
    }
}

const configA = reactive({
    name: '',
    total: 10, // 总记录数
    page: 1 // 当前页码
})

const userData = reactive({
    list: []
});

const getUserData = async (current, limit) => {
    let data = await proxy.$api.getUserData(current, limit)
    console.log(data)
    userData.list = data.records.map(item => ({
        ...item,
        registrationTime: formatDate(item.registrationTime),
    }))
    configA.total = data.total
}

const deleteUserData = async (id) => {
    try {
        let data = await proxy.$api.deleteUser(id);
        configA.page = 1
        await getUserData(1, 10);
        ElMessage({
            type: 'success',
            message: '删除成功',
        });
    } catch (error) {
        ElMessage({
            type: 'error',
            message: '删除失败: ' + error.message,
        });
    }
};

const deleteUser = (row) => {
    ElMessageBox.confirm(
        '确定要删除此用户吗?',
        '警告',
        {
            confirmButtonText: '确认',
            cancelButtonText: '取消',
            type: 'warning',
        }
    )
        .then(() => {
            deleteUserData(row.userID)
                .catch(err => {
                    ElMessage({
                        type: 'error',
                        message: '删除失败: ' + err.message,
                    });
                });
        })
        .catch(() => {
            ElMessage({
                type: 'info',
                message: '删除已取消',
            });
        });
};


const usernameInput = ref(null);
const passwordInput = ref(null);
const emailInput = ref(null);

const onSubmit = () => {
    // 先检查用户名是否为空
    if (!formUser.username) {
        ElMessage({
            type: 'warning',
            message: '请填写用户名',
        });
        // 聚焦到用户名输入框
        usernameInput.value.focus();
        return false;
    }

    // 然后检查密码是否为空
    if (!formUser.password) {
        ElMessage({
            type: 'warning',
            message: '请填写密码',
        });
        // 聚焦到密码输入框
        passwordInput.value.focus();
        return false;
    }

    // 检查邮箱是否为空
    if (!formUser.email) {
        ElMessage({
            type: 'warning',
            message: '请填写邮箱',
        });
        // 聚焦到邮箱输入框
        emailInput.value.focus();
        return false;
    }

    // 最后检查图片是否上传
    if (!selectedFile.value) {
        ElMessage({
            type: 'warning',
            message: '请上传图片',
        });
        return false;
    }

    // 如果所有字段都填写了，则保存用户信息
    saveUser();
};


const saveUser = async () => {
    try {
        if (action.value === 'edit') {
            const formData = new FormData();
            formData.append('file', selectedFile.value);
            formData.append('userID', formUser.userID);
            formData.append('username', formUser.username);
            formData.append('password', formUser.password);
            formData.append('email', formUser.email);
            await proxy.$api.updateUser(formData); // 更新用户信息
        } else {
            const formData = new FormData();
            formData.append('file', selectedFile.value);
            formData.append('username', formUser.username);
            formData.append('password', formUser.password);
            formData.append('email', formUser.email);
            await proxy.$api.saveUser(formData); // 保存用户信息
        }
        configA.page

        await getUserData(1, 10);
        ElMessage({
            type: 'success',
            message: action.value === 'edit' ? '编辑成功' : '新增成功',
        });

        handleClose(); // 关闭对话框并重置表单
    } catch (error) {
        ElMessage({
            type: 'error',
            message: (action.value === 'edit' ? '编辑' : '新增') + '失败: ' + error.message,
        });
    }
};

// 上传图片的 API 地址
const uploadAction = ''
// 当前选择的文件
const selectedFile = ref(null)

// 预览图片的 URL
const previewImage = ref(null)

// 图片上传
// 表单验证
const beforeUpload = (file) => {
    if (!formUser.username || !formUser.password || !formUser.email) {
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


const dialogVisible = ref(false)

const action = ref("add")


const rules = reactive({
    username: [{ required: true, message: "姓名是必填项", trigger: "blur" }],
    password: [
        { required: true, message: "密码是必填项", trigger: "blur" },
    ],
    email: [{ required: true, message: "邮箱是必选项", trigger: "blur" }],
})

const handleAdd = () => {
    action.value = "add"
    dialogVisible.value = true
}

const handleClose = () => {
    resetFormUser();
    previewImage.value = null
    selectedFile.value = null
    dialogVisible.value = false;
};

const handleCancel = () => {
    resetFormUser();
    previewImage.value = null
    selectedFile.value = null
    dialogVisible.value = false;
};

const resetFormUser = () => {
    formUser.username = '';
    formUser.password = '';
    formUser.email = '';
    formUser.id = null;
    previewImage.value = null
    selectedFile.value = null
}

onMounted(() => {
    getUserData(1, 10)
})

</script>

<style scoped>
.user-header {
    display: flex;
    justify-content: space-between;
    margin-bottom: 20px;
}

.search-form {
    display: flex;
    gap: 10px;
}

.table {
    margin-top: 20px;
}

/* 修改按钮样式 */
.el-button--primary {
    background-color: #1e90ff;
    /* 更深的蓝色 */
    border-color: #1e90ff;
    color: #fff;
    border-radius: 20px;
    /* 圆角按钮 */
    padding: 10px 20px;
    /* 调整内边距 */
    box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
    /* 添加阴影 */
    font-weight: bold;
    transition: background-color 0.3s ease, transform 0.2s ease;
}

.el-button--primary:hover {
    background-color: #007bff;
    /* hover 时的颜色 */
    transform: translateY(-2px);
    /* hover 时的轻微提升效果 */
}

.el-button--danger {
    background-color: #ff4d4f;
    /* 更现代的红色 */
    border-color: #ff4d4f;
    color: #fff;
    border-radius: 20px;
    padding: 10px 20px;
    box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
    font-weight: bold;
    transition: background-color 0.3s ease, transform 0.2s ease;
}

.el-button--danger:hover {
    background-color: #ff2a2a;
    transform: translateY(-2px);
}

/* 修改表单标签样式 */
.el-form-item__label {
    color: #333;
    /* 深灰色字体 */
    font-weight: 600;
    font-size: 16px;
    /* 增加字体大小 */
    margin-right: 10px;
    /* 调整与输入框之间的间距 */
    text-transform: uppercase;
    /* 转换为大写字母 */
}

/* 对话框表单的标签样式 */
.dialog-form .el-form-item__label {
    color: #555;
    /* 稍浅的灰色 */
    font-weight: 700;
    /* 更粗的字体 */
    font-size: 14px;
    /* 调整字体大小 */
}


.el-table {
    width: 100%;
    height: 480px;
    border-radius: 10px;
    overflow: hidden;
}

.el-table-column {
    text-align: center;
}

.el-button {
    margin-right: 10px;
}

.pagerA {
    display: flex;
    justify-content: center;
    margin-top: 20px;
}

.dialog-form .el-form-item {

    margin-bottom: 20px;
}

.select-clearn {
    display: flex;
}

.el-dialog__header {
    background: #f5f7fa;
    padding: 20px;
}

.el-dialog__body {
    padding: 20px;
}

.el-dialog__footer {
    background: #f5f7fa;
    padding: 20px;
}

.el-button--primary {
    background-color: #409eff;
    border-color: #409eff;
}

.el-button--danger {
    background-color: #f56c6c;
    border-color: #f56c6c;
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
