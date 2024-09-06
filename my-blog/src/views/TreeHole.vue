<template>
  <el-container>
    <el-header>
      <Header />
    </el-header>

    <el-container class="container">
      <el-main>
        <div class="main-content">
          <div class="custom-sidebar">
            <ul class="sidebar-menu">
              <li
                v-for="category in categories"
                :key="category"
                :class="{ active: category === selectedCategory }"
                @click="handleCategoryChange(category)"
                class="sidebar-item"
              >
                <el-icon v-if="category === 'All'"><HomeFilled /></el-icon>
                <el-icon v-else><Picture /></el-icon>
                <span class="sidebar-text">{{ category }}</span>
              </li>
            </ul>
          </div>

          <div class="photo-section">
            <el-row :gutter="20">
              <el-col
                :span="24"
                :md="8"
                :lg="6"
                v-for="(photo, index) in filteredPhotos"
                :key="index"
                class="photo-col"
              >
                <el-card
                  :body-style="{ padding: '0px' }"
                  class="photo-card"
                  @click="openDialog(photo)"
                >
                  <img :src="photo.filepath" class="photo-image" />
                  <div class="photo-info">
                    <div class="photo-details">
                      <span class="photo-filename">{{ photo.filename }}</span>
                      <span class="photo-category">{{ photo.category }}</span>
                    </div>
                    <span class="photo-description">描述：{{ photo.description }}</span>
                    <span class="photo-upload-time">上传时间：{{ photo.uploadTime }}</span>
                  </div>
                </el-card>
              </el-col>
            </el-row>
          </div>
        </div>

        <!-- 图片放大展示弹窗 -->
        <el-dialog v-model="dialogVisible" :before-close="handleClose" class="dialog-container">
          <img :src="selectedPhoto?.filepath" class="dialog-image" ref="dialogImage" />
          <div class="dialog-footer">
            <el-button type="primary" @click="downloadImage">下载图片</el-button>
          </div>
        </el-dialog>
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup>
import { ref, onUpdated, onMounted, getCurrentInstance, computed } from 'vue';
import Header from '../components/Header.vue';
import { HomeFilled, Picture } from '@element-plus/icons-vue'; // 引入图标

const { proxy } = getCurrentInstance();

const categories = ref([]);
const photos = ref([]);
const dialogVisible = ref(false);
const selectedPhoto = ref(null);
const dialogImage = ref(null);
const selectedCategory = ref(''); // Default category or 'All' for no filter

const filteredPhotos = computed(() => {
  return selectedCategory.value
    ? photos.value.filter(photo => photo.category === selectedCategory.value)
    : photos.value;
});

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

const getAllPicture = async () => {
  try {
    const res = await proxy.$api.getAllPicture();
    console.log(res);
    photos.value = res.map(photo => ({
      ...photo,
      uploadTime: formatDate(photo.uploadTime),
    }));

    // Extract unique categories
    const allCategories = Array.from(new Set(res.map(photo => photo.category)));
    categories.value = ['All', ...allCategories];
  } catch (error) {
    console.error('获取图片失败', error);
  }
};

const openDialog = (photo) => {
  selectedPhoto.value = photo;
  dialogVisible.value = true;
};

const handleCategoryChange = (category) => {
  // Check if "All" is selected
  selectedCategory.value = category === 'All' ? '' : category;
};

const handleClose = () => {
  dialogVisible.value = false;
};

const downloadImage = async () => {
  try {
    const response = await fetch(selectedPhoto.value.filepath);
    const blob = await response.blob();
    const link = document.createElement('a');
    const objectUrl = URL.createObjectURL(blob);
    
    link.href = objectUrl;
    link.setAttribute('download', selectedPhoto.value.filename || 'image');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(objectUrl);
  } catch (error) {
    console.error('下载图片失败', error);
  }
};

onUpdated(() => {
  if (dialogVisible.value && dialogImage.value) {
    const img = dialogImage.value;
    img.onload = () => {
      img.style.maxHeight = 'none';
      img.style.width = '100%';
    };
  }
});

onMounted(() => {
  getAllPicture();
});
</script>

<style scoped>
.container {
  display: flex;
  flex-direction: row;
  min-height: calc(100vh - 60px); /* This ensures the container takes up the full viewport height minus the header */
  background-image: url('@/assets/img/back.jpg');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}

.el-main {
  /* flex: 1; */
  padding: 0;
  display: flex;
}

.main-content {
  display: flex;
  flex-direction: row;
  width: 100%;
  height: 830px; /* Ensure the content takes up the full available height */
}

.custom-sidebar {
  height: 800px; /* Set sidebar height to match el-main height */
  background-color: rgba(41, 43, 46, 0.5);
  display: flex;
  flex-direction: column;
  padding: 0px;
  box-shadow: 2px 0 12px rgba(0, 0, 0, 0.1);
  transition: width 0.3s ease;
  overflow: hidden;
  width: 40px; /* Initial collapsed width */
}

.custom-sidebar:hover {
  width: 200px; /* Expanded width on hover */
  transition: width 0.3s ease;
}

.photo-section {
  flex: 1;
  padding: 10px;
  overflow-y: auto; /* Allow scrolling if content is too long */
}

.sidebar-menu {
  list-style-type: none;
  padding: 0;
  margin: 0;
  flex: 1; /* This makes the menu items take up remaining space */
}

.sidebar-item {
  display: flex;
  align-items: center;
  font-size: 16px;
  font-weight: 500;
  padding: 12px 20px;
  color: #ecf0f1; /* Light text color */
  margin-bottom: 10px;
  border-radius: 8px;
  transition: background-color 0.3s ease, padding-left 0.3s ease;
  cursor: pointer;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.sidebar-text {
  display: inline-block;
  margin-left: 10px;
}

.custom-sidebar:hover .sidebar-item {
  padding-left: 20px; /* Adjust padding when expanded */
}

.sidebar-item:hover {
  background-color: #34495e; /* Darker background on hover */
}

.sidebar-item.active {
  background-color: #2980b9; /* Highlighted color for the active item */
  color: #fff;
}

.sidebar-item:last-child {
  margin-bottom: 0;
}

.photo-col {
  padding: 0px;
  margin-bottom: 10px;
}

.photo-card {
  border: 3px solid #262627;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  overflow: hidden;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.photo-card:hover {
  transform: scale(1.03);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.2);
  cursor: pointer;
}

.photo-image {
  width: 100%;
  height: 250px;
  object-fit: cover;
}

.photo-info {
  padding: 15px;
  border-top: 1px solid #e0e0e0;
  display: flex;
  flex-direction: column;
  background-color: #ffffff;
}

.photo-info:first-of-type {
  border-top: none;
}

.photo-details {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 12px;
  border-bottom: 1px solid #e0e0e0;
}

.photo-filename, .photo-category {
  font-size: 16px;
  font-weight: 600;
  color: #333333;
  margin: 0;
  line-height: 1.4;
}

.photo-description, .photo-upload-time {
  font-size: 14px;
  color: #666666;
  margin: 0;
  padding-top: 10px;
  line-height: 1.5;
}

.photo-description {
  padding-top: 15px;
}

.dialog-container .el-dialog {
  padding: 0;
}

.dialog-footer {
  text-align: center;
  margin-top: 10px;
}

.dialog-image {
  width: 100%;
  height: auto;
  max-height: 80vh;
  object-fit: contain;
}

</style>

