<template>
      <div class="header">
        <h2>分类管理</h2>
        <el-button type="primary" @click="openAddCategoryDialog">添加分类</el-button>
      </div>
  
      <!-- 分类列表 -->
      <el-table :data="categories" style="width: 100%" stripe>
        <!-- 动态生成列 -->
        <el-table-column  v-for="item in categoryLabel" :key="item.prop" :prop="item.prop" :label="item.label === '文章数量' ? '图片数量' : item.label"
          :width="item.width ? item.width : 125">
        </el-table-column>
  
        <!-- 启用栏 -->
        <el-table-column label="启用" width="100">
          <template #default="{ row }">
            <el-switch v-model="row.enabled" @change="handleStatusChange(row)"></el-switch>
          </template>
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

      <div class="pager">
      <el-pagination class="pagerA" background layout="prev, pager, next" :total='configA.total'
        @current-change="handleChange" @click="handlePage" />
    </div>
  
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

  </template>
  
  
  <script setup>
  import { ref,reactive, getCurrentInstance, onMounted } from 'vue'
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

  const categoryNameAndCount = ref({})


// 获取分类对应数据条数
const getCategoryPictureCount = async() =>{
  const res = await proxy.$api.getCategoryPictureCount()
  
  for (const categoryName in res) {
  if (res.hasOwnProperty(categoryName)) {
    const item = res[categoryName];
    categoryNameAndCount.value[item.categoryName] = item.categoryCount
  }
}
}


// 分页

const configA = reactive({
  name: '',
  total: 10,
  page: 1
})
const handleChange = (page) => {
  configA.page = page
  getPictureCategoryList(page, 10)
}

const handlePage = () => {
  getPictureCategoryList(configA.page, 10)
}


  
  // 打开添加分类对话框
  const openAddCategoryDialog = (category) => {
    if (category.categoryID !== undefined) {
      newCategory.value = { categoryID: category.categoryID, name: category.name, description: category.description }
      console.log(newCategory.value.name)
    } else {
      newCategory.value = { categoryID: '', name: '', description: '' }
    }
    showAddDialog.value = true
  }
  
  // 处理启用状态的变化
  const handleStatusChange = (category) => {
    const enable = category.enabled ? "1" : "0"
    // 发送状态更新请求
    updatePictureCategoryStatus(category.categoryID, enable)
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
      updatePictureCategory(newCategory.value)
    } else {
      addPictureCategory(newCategory.value)
    }
    getPictureCategoryList(configA.page, 10)
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
        return deletePictureCategory(category.categoryID)
          .then(() => {
            getPictureCategoryList(configA.page, 10)
  
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
  
  // 分类管理
  const getPictureCategoryList = async (page,limit) => {
    const data = await proxy.$api.getPictureCategoryList(page,limit)
    console.log(data)
    categories.value = data.records.map(category => ({
      ...category,
      enabled: category.enable === 1,
      count: categoryNameAndCount.value[category.name] || 0,
    }))
    configA.total = data.total
  }
  
  
  
  const updatePictureCategoryStatus = async (categoryID, status) => {
  
    try {
      await proxy.$api.updatePictureCategoryStatus(categoryID, status)
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
  
  const addPictureCategory = async (category) => {
    try {
      await proxy.$api.addPictureCategory(category)
      getPictureCategoryList(configA.page,10)
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
  
  const deletePictureCategory = async (categoryID) => {
    await proxy.$api.deletePictureCategory(categoryID)
    getPictureCategoryList(configA.page,10)
  }
  
  const updatePictureCategory = async (category) => {
    try {
      await proxy.$api.updatePictureCategory(category)
      getPictureCategoryList(configA.page,10)
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
    getPictureCategoryList(1,10)
    getCategoryPictureCount()
  })
  </script>
  
  
  <style scoped lang="less">
  
  
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

  .pager {
  margin-top: 20px;
}

.pagerA {
  display: flex;
  justify-content: center;
}
  </style>
  