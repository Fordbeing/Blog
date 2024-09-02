<template>
  <el-container>
    <el-header>
      <Header />
    </el-header>

    <el-main>
      <div class="container">
        <!-- 照片展示区域 -->
        <div class="photo-section">
          <el-row :gutter="20">
            <el-col :span="5" v-for="(photo, index) in photos" :key="index" class="photo-col">
              <el-card :body-style="{ padding: '0px' }" class="photo-card" @click="openDialog(photo)">
                <img :src="photo.url" class="photo-image" />
                <div class="photo-info">
                  <span class="photo-title">{{ photo.title }}</span>
                </div>
              </el-card>
            </el-col>
          </el-row>
        </div>
      </div>

      <!-- 图片放大展示弹窗 -->
      <el-dialog v-model="dialogVisible" :before-close="handleClose" class="dialog-container">
        <img :src="selectedPhoto?.url" class="dialog-image" ref="dialogImage" />
      </el-dialog>
    </el-main>
  </el-container>
</template>

<script setup>
import { ref, onUpdated } from 'vue';
import Header from '../components/Header.vue';

const photos = ref([
  { url: 'https://cdn.pixabay.com/photo/2016/11/29/04/23/little-girl-1867297_640.jpg', title: '照片 1' },
  { url: 'http://sj4yi8qby.hd-bkt.clouddn.com/personBack.png?e=1725198078&token=-vMAs8IW8oZeUbaUtjRtUR9qh292_fMkreo7iPwT:sGa1T-GwFriY8iHef0HvGq2aloQ=', title: '照片 2' },
  { url: 'https://cdn.pixabay.com/photo/2016/11/29/04/54/photographer-1867417_640.jpg', title: '照片 3' },
  { url: 'https://cdn.pixabay.com/photo/2022/08/28/18/03/dog-7417233_640.jpg', title: '照片 1' },
  { url: 'https://cdn.pixabay.com/photo/2016/12/23/12/40/night-1927265_640.jpg', title: '照片 2' },
  { url: 'https://haowallpaper.com/link/common/file/previewFileImg/15189043253972288', title: '照片 1' },
  { url: 'https://haowallpaper.com/link/common/file/previewFileImg/15189043253972288', title: '照片 2' },
  { url: 'https://cdn.pixabay.com/photo/2022/11/09/21/12/candle-7581472_640.jpg', title: '照片 3' },
  { url: 'https://haowallpaper.com/link/common/file/previewFileImg/15189043253972288', title: '照片 1' },
  { url: 'https://img.tukuppt.com/bg_grid/00/12/95/Slv0hNR0gN.jpg!/fh/350', title: '照片 2' },
]);

const dialogVisible = ref(false);
const selectedPhoto = ref(null);
const dialogImage = ref(null);

const openDialog = (photo) => {
  selectedPhoto.value = photo;
  dialogVisible.value = true;
};

const handleClose = () => {
  dialogVisible.value = false;
};

// 使用 onUpdated 钩子来处理弹窗打开后的图片尺寸调整
onUpdated(() => {
  if (dialogVisible.value && dialogImage.value) {
    const img = dialogImage.value;
    img.onload = () => {
      img.style.maxHeight = 'none';
      img.style.width = '100%';
    };
  }
});
</script>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: calc(100vh - 60px);
  background-image: url('@/assets/img/back.jpg');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}

.el-main {
  padding: 0;
}

.photo-section {
  padding: 20px; /* 去掉额外的内边距 */
  margin-left: 200px; /* 去掉左边距 */
}

.photo-col {
  padding: 0; /* 去掉列的内边距 */
  margin-bottom: 20px; /* 去掉底部外边距 */
}

.photo-card {
  border: none; /* 去掉边框 */
  border-radius: 0; /* 如果有圆角边框的话也去掉 */
  box-shadow: none; /* 去掉阴影效果 */
  height: 100%; /* 让卡片高度填充父元素 */
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 0; /* 去掉内边距 */
}

.photo-card:hover {
  transform: scale(1.05);
  cursor: pointer;
}

.photo-image {
  width: 100%;
  height: 200px;
  object-fit: cover;
  margin: 0; /* 去掉外边距 */
  padding: 0; /* 去掉内边距 */
  box-sizing: border-box; /* 确保包括边框和内边距 */
}

.photo-info {
  padding: 10px;
  text-align: center;
}

.photo-title {
  font-size: 16px;
  color: #333;
}


.dialog-container .el-dialog {
  padding: 0;
}

.dialog-image {
  width: 100%;
  height: 100%;
  object-fit: contain;
}
</style>
