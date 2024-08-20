<template>
    <div class="user-header">
        <el-button type="primary" @click="handleAdd">新增</el-button>
        <el-form :inline="true" :model="formInline">
            <el-form-item label="用户名">
                <el-input placeholder="请输入用户名" v-model="formInline.keyWord"></el-input>
            </el-form-item>

            <el-form-item>
                <el-button type="primary" @click="handleSearch">查询</el-button>
            </el-form-item>
        </el-form>
    </div>

    <div class="table">
        <el-table :data="userData.list" style="width: 100%">
            <el-table-column v-for="item in tableLabel" :prop="item.prop" :label="item.label"
                :width="item.width ? item.width : 125" />

            <el-table-column fixed="right" label="Operations" min-width="120">
                <template v-slot:default="scope">
                    <el-button size="small" @click="handleClick">
                        查看
                    </el-button>
                    <el-button type="primary" size="small" @click="handleClick">
                        编辑
                    </el-button>
                    <el-button @click="deleteUser(scope.row)" type="danger" size="small">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination class="pagerA" background layout="prev, pager, next" :total='configA.total' size="small"
            @current-change="handleChange" />
    </div>

    <el-dialog v-model="dialogVisible" :title="action == 'add' ? '新增用户' : '编辑用户'" width="35%"
        :before-close="handleClose">
        <!--需要注意的是设置了:inline="true"，
            会对el-select的样式造成影响，我们通过给他设置一个class=select-clearn
            在css进行处理-->
        <el-form :inline="true" :model="formUser" :rules="rules" ref="userForm">
            <el-row>
                <el-col :span="12">
                    <el-form-item label="姓名" prop="name">
                        <el-input v-model="formUser.name" placeholder="请输入姓名" />
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="年龄" prop="age">
                        <el-input v-model.number="formUser.age" placeholder="请输入年龄" />
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="12">
                    <el-form-item class="select-clearn" label="性别" prop="sex">
                        <el-select v-model="formUser.sex" placeholder="请选择">
                            <el-option label="男" value="1" />
                            <el-option label="女" value="0" />
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="出生日期" prop="birth">
                        <el-date-picker v-model="formUser.birth" type="date" placeholder="请输入" style="width: 100%" />
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-form-item label="地址" prop="addr">
                    <el-input v-model="formUser.addr" placeholder="请输入地址" />
                </el-form-item>
            </el-row>
            <el-row style="justify-content: flex-end">
                <el-form-item>
                    <el-button type="primary" @click="handleCancel">取消</el-button>
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
})
const handleClick = () => {
    console.log('click')
}

const handleChange = (page) => {
    configA.page = page
    getUserData()
}

const handleSearch = () => {
    console.log(formInline.keyWord)
    configA.name = formInline.keyWord
    getUserData()
}

const configA = reactive({
    name: '',
    total: 10,
    page: 1 // 当前页码
})

const userData = reactive({
    list: []
});

const getUserData = async () => {
    let data = await proxy.$api.getUserData()
    userData.list = data.data.map(item => ({
        ...item,
        sex: item.sex === 1 ? '男' : '女'
    }))
    configA.total = data.count
}

const deleteUserData = async (id) => {
    try {
        let data = await proxy.$api.deleteUser(id);
        // 假设 deleteUser API 调用成功会返回一些确认信息，但这里我们主要关心的是删除操作本身  
        // 调用 getUserData 来更新用户列表  
        await getUserData();
        ElMessage({
            type: 'success',
            message: 'Delete completed',
        });
    } catch (error) {
        // 处理错误情况，例如显示错误信息  
        ElMessage({
            type: 'error',
            message: 'Delete failed: ' + error.message,
        });
    }
};

const deleteUser = (row) => {
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
            deleteUserData(row.userID)
                .catch(err => {
                    // 如果 deleteUserData 失败，可以在这里处理错误  
                    ElMessage({
                        type: 'error',
                        message: 'Failed to delete user: ' + err.message,
                    });
                });
        })
        .catch(() => {
            ElMessage({
                type: 'info',
                message: 'Delete canceled',
            });
        });
};


// 弹窗
//控制对话框是否显示
const dialogVisible = ref(false)

//新增和编辑共用一个窗口，所以通过设置action区分
const action = ref("add")

const formUser = reactive({})
//表单校验规则
const rules = reactive({
    name: [{ required: true, message: "姓名是必填项", trigger: "blur" }],
    age: [
        { required: true, message: "年龄是必填项", trigger: "blur" },
        { type: "number", message: "年龄必须是数字" },
    ],
    sex: [{ required: true, message: "性别是必选项", trigger: "change" }],
    birth: [{ required: true, message: "出生日期是必选项" }],
    addr: [{ required: true, message: '地址是必填项' }]
})


//这个方法之前定义过
const handleAdd = () => {
    action.value = "add"
    //打开对话窗
    dialogVisible.value = true
}

//对话框右上角的关闭事件
const handleClose = () => {
    //获取到表单dom，执行resetFields重置表单
    proxy.$refs["userForm"].resetFields()
    //关闭对话框
    dialogVisible.value = false
}

//对话框右下角的取消事件
const handleCancel = () => {
    proxy.$refs["userForm"].resetFields()
    dialogVisible.value = false
}



onMounted(() => {
    getUserData()
})

</script>

<style scoped>
.user-header {
    display: flex;
    justify-content: space-between;
}

.table {
    position: relative;
    height: 520px;
}

.el-table {
    width: 100%;
    height: 500px;
}

.pagerA {
    position: absolute;
    /* right: 10px; */
    left: 35%;
    bottom: 30px;
}

.select-clearn {
    display: flex;
}
</style>