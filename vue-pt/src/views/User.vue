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
                :width="item.width ? item.width : 125" />

            <el-table-column fixed="right" label="操作" min-width="160">
                <template v-slot:default="scope">
                    <el-button size="small" @click="handleClick" plain>查看</el-button>
                    <el-button type="primary" size="small" @click="handleEdit(scope.row)">编辑</el-button>
                    <el-button @click="deleteUser(scope.row)" type="danger" size="small">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
    </div>

    <div class="page">
        <el-pagination class="pagerA" background layout="prev, pager, next" :total='configA.total'
            @current-change="handleChange" />
    </div>

    <el-dialog v-model="dialogVisible" :title="action == 'add' ? '新增用户' : '编辑用户'" width="35%"
        :before-close="handleClose" class="dialog-form">
        <el-form :inline="false" :model="formUser" :rules="rules" ref="userForm" label-width="80px">
            <el-row gutter="20">
                <el-col :span="12">
                    <el-form-item label="姓名" prop="username">
                        <el-input v-model="formUser.username" placeholder="请输入姓名" />
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="密码" prop="password">
                        <el-input type="password" v-model="formUser.password" placeholder="请输入密码" />
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row gutter="20">
                <el-col :span="12">
                    <el-form-item label="邮箱" prop="email">
                        <el-input v-model="formUser.email" placeholder="请输入邮箱" />
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
const handleEdit = (row) => {
    formUser.username = row.username;
    formUser.password = row.password; 
    formUser.email = row.email;
    formUser.userID = row.userID; 

    action.value = 'edit';
    dialogVisible.value = true;
};

const handleClick = () => {
    
}


const handleChange = (page) => {
    configA.page = page
    getUserData((configA.page - 1) * 10, 10)
}

const handleSearch = () => {
    getByUsernameAndEmail(formInline.keyWord, formInline.email)
}

const handleClearSearch =() =>{
    formInline.keyWord = '';
    formInline.email = '';
    getUserData(0, 10)

}

const getByUsernameAndEmail = async (username, email) => {
    let data = [];
    try {
        if (username === '' && email === '') {
            return getUserData(0, 10)
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
    userData.list = data.list.map(item => ({
        ...item,
        sex: item.sex === 1 ? '男' : '女'
    }))
    configA.total = data.total
}

const deleteUserData = async (id) => {
    try {
        let data = await proxy.$api.deleteUser(id);
        await getUserData(0, 10);
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

const onSubmit = () => {
    SaveUser()
};

const SaveUser = async () => {
    try {
        if (action.value === 'edit') {
            await proxy.$api.updateUser(formUser); // 更新用户信息
        } else {
            await proxy.$api.saveUser(formUser); // 保存用户信息
        }

        await getUserData(0, 10);
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
    dialogVisible.value = false;
};

const handleCancel = () => {
    resetFormUser();
    dialogVisible.value = false;
};

const resetFormUser = () => {
    formUser.username = '';
    formUser.password = '';
    formUser.email = '';
    formUser.id = null;
}

onMounted(() => {
    getUserData(0, 10)
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
</style>
