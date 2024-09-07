<template>
  <el-card class="personal-info" shadow="hover">
    <div class="avatar-container">
      <img src="@/assets/img/avatar.jpg" alt="avatar" class="avatar" />
      <div class="zoom-icon"></div>
    </div>
    <h2>Ford</h2>
    <p>A passionate developer and blogger. Welcome to my personal blog where I share my thoughts and experiences.</p>
  </el-card>
</template>

<style scoped>
.personal-info {
  text-align: center;
  background-color: rgba(12, 11, 11, 0.5); /* 设置背景颜色透明度 */
  border: none; /* 去除边框 */
  border-radius: 8px; /* 保持圆角效果 */
  padding: 20px;
}

.avatar-container {
  position: relative;
  display: inline-block;
}

.avatar {
  width: 120px;
  border-radius: 50%;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.avatar-container:hover .avatar {
  transform: scale(1.1); /* 放大效果 */
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.3); /* 添加阴影效果 */
}

.zoom-icon {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 24px;
  height: 24px;
  background-size: 24px 24px;
  transform: translate(-50%, -50%);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.avatar-container:hover .zoom-icon {
  opacity: 1; /* 显示放大镜图标 */
}

h2 {
  margin: 10px 0;
  font-size: 22px;
  color: #7e2f2f;
}

p {
  color: #666;
}
</style>
