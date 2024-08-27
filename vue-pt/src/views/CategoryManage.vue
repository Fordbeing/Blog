<template>
  <div class="category-management">
    <div class="header">
      <h2>分类管理</h2>
      <el-button type="primary" @click="openAddCategoryDialog">添加分类</el-button>
    </div>

    <!-- 分类列表 -->
    <el-table :data="categories" style="width: 100%" stripe>
      <!-- 动态生成列 -->
      <el-table-column v-for="item in categoryLabel" :key="item.prop" :prop="item.prop" :label="item.label"
        :width="item.width ? item.width : 125">
      </el-table-column>

      <!-- 操作列 -->
      <el-table-column label="操作" width="200">
        <template #default="{ row }">

          <el-button type="primary" size="small" @click="openAddCategoryDialog(row)">
            编辑
          </el-button>
          <el-button @click="handleDeleteCategory(row)" type="danger" size="small">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 添加分类对话框 -->
    <el-dialog title="添加分类" v-model="showAddDialog" @close="resetForm">
      <el-form :model="newCategory" ref="addForm" label-width="120px">
        <el-form-item label="分类名称" :rules="[{ required: true, message: '请输入分类名称', trigger: 'blur' }]" prop="name">
          <el-input v-model="newCategory.name"></el-input>
        </el-form-item>
        <el-form-item label="分类描述" :rules="[{ required: true, message: '请输入分类描述', trigger: 'blur' }]"
          prop="description">
          <el-input v-model="newCategory.description"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showAddDialog = false">取消</el-button>
        <el-button type="primary" @click="HandleaddCategory">确定</el-button>
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

const categoryLabel = dataStore.state.CategoryLabelData


// 分类数据
const categories = ref([])

// 对话框控制
const showAddDialog = ref(false)
const showEditDialog = ref(false)

// 表单数据
const newCategory = ref({ categoryID: '', name: '', description: '', createTime: '' })
const editingCategory = ref({ id: '', name: '' })

// 打开添加分类对话框
const openAddCategoryDialog = (category) => {
  if (category.categoryID !== undefined) {
    // 在这里填写更新分类数据逻辑
    newCategory.value = { categoryID: category.categoryID, name: category.name, description: category.description } // 到时候更新直接用这个就可以
    console.log(newCategory.value.name)
  } else {
    newCategory.value = { categoryID: '', name: '', description: '' }
  }
  showAddDialog.value = true

}

// 添加分类
const HandleaddCategory = () => {
  if (!newCategory.value.name) {
    ElMessage.error('分类名称不能为空')
    return
  }
  if (!newCategory.value.description) {
    ElMessage.error('分类描述不能为空')
    return
  }
  if (newCategory.value.categoryID !== '') {
    updateCategory(newCategory.value)
  } else {
    addCategory(newCategory.value)
  }
  getCategoryList()
  showAddDialog.value = false
}

// 删除分类
const handleDeleteCategory = (category) => {
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
      return deleteCategory(category.categoryID)
        .then(() => {
          ElMessage({
            type: 'success',
            message: 'Delete Success',
          });
          // 在这里执行删除成功后的逻辑，例如从UI中移除该分类
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

// 分类管理
const getCategoryList = async () => {
  const data = await proxy.$api.getCategoryList()
  console.log(data)
  categories.value = data
}

const addCategory = async (category) => {

  try {
    await proxy.$api.addCategory(category)
    getCategoryList()
    ElMessage({
      type: 'success',
      message: 'Add Success',
    });
  } catch (error) {
    ElMessage({
      type: 'error',
      message: 'Add Failed: ' + error.message,
    });
  }
}

const deleteCategory = async (categoryID) => {
  await proxy.$api.deleteCategory(categoryID)
  getCategoryList()
}

const updateCategory = async (category) => {
  try {
    await proxy.$api.updateCategory(category)
    ElMessage({
      type: 'success',
      message: 'Update Success',
    });
  } catch (error) {
    ElMessage({
      type: 'error',
      message: 'Update Failed: ' + error.message,
    });
  }

}



// 重置表单
const resetForm = () => {
  newCategory.value = { name: '' }
  editingCategory.value = { id: '', name: '' }
}

onMounted(() => {
  getCategoryList()
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
