<template>
    <div class="category-management">
      <div class="header">
        <h2>分类管理</h2>
        <el-button type="primary" @click="openAddCategoryDialog">添加分类</el-button>
      </div>
  
      <!-- 分类列表 -->
      <el-table :data="categories" style="width: 100%" stripe>
        <el-table-column prop="name" label="分类名称" width="180">
        </el-table-column>
        <el-table-column label="操作" width="200">
          <template #default="{ row }">
            <el-button @click="openEditCategoryDialog(row)" type="text" size="small">编辑</el-button>
            <el-button @click="deleteCategory(row)" type="text" size="small" danger>删除</el-button>
          </template>
        </el-table-column>
      </el-table>
  
      <!-- 添加分类对话框 -->
      <el-dialog
        title="添加分类"
        :visible.sync="showAddDialog"
        @close="resetForm"
      >
        <el-form :model="newCategory" ref="addForm" label-width="120px">
          <el-form-item label="分类名称" :rules="[{ required: true, message: '请输入分类名称', trigger: 'blur' }]">
            <el-input v-model="newCategory.name"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="showAddDialog = false">取 消</el-button>
          <el-button type="primary" @click="addCategory">确 定</el-button>
        </div>
      </el-dialog>
  
      <!-- 编辑分类对话框 -->
      <el-dialog
        title="编辑分类"
        :visible.sync="showEditDialog"
        @close="resetForm"
      >
        <el-form :model="editingCategory" ref="editForm" label-width="120px">
          <el-form-item label="分类名称" :rules="[{ required: true, message: '请输入分类名称', trigger: 'blur' }]">
            <el-input v-model="editingCategory.name"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="showEditDialog = false">取 消</el-button>
          <el-button type="primary" @click="updateCategory">确 定</el-button>
        </div>
      </el-dialog>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  import { ElMessage } from 'element-plus'
  
  // 分类数据
  const categories = ref([
    { id: 1, name: '电子产品' },
    { id: 2, name: '家居用品' },
    { id: 3, name: '服装' },
  ])
  
  // 对话框控制
  const showAddDialog = ref(false)
  const showEditDialog = ref(false)
  
  // 表单数据
  const newCategory = ref({ name: '' })
  const editingCategory = ref({ id: '', name: '' })
  
  // 打开添加分类对话框
  const openAddCategoryDialog = () => {
    newCategory.value = { name: '' }
    showAddDialog.value = true
  }
  
  // 添加分类
  const addCategory = () => {
    if (!newCategory.value.name) {
      ElMessage.error('分类名称不能为空')
      return
    }
    categories.value.push({
      id: categories.value.length + 1,
      name: newCategory.value.name,
    })
    showAddDialog.value = false
  }
  
  // 打开编辑分类对话框
  const openEditCategoryDialog = (category) => {
    editingCategory.value = { ...category }
    showEditDialog.value = true
  }
  
  // 更新分类
  const updateCategory = () => {
    if (!editingCategory.value.name) {
      ElMessage.error('分类名称不能为空')
      return
    }
    const index = categories.value.findIndex(cat => cat.id === editingCategory.value.id)
    if (index !== -1) {
      categories.value[index] = { ...editingCategory.value }
    }
    showEditDialog.value = false
  }
  
  // 删除分类
  const deleteCategory = (category) => {
    const index = categories.value.findIndex(cat => cat.id === category.id)
    if (index !== -1) {
      categories.value.splice(index, 1)
    }
  }
  
  // 重置表单
  const resetForm = () => {
    newCategory.value = { name: '' }
    editingCategory.value = { id: '', name: '' }
  }
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
  </style>
  