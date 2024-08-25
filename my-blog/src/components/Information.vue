<template>
    <el-card class="information" shadow="hover">
      <div class="info-section">
        <el-row class="info-row">
          <el-col :span="8" class="info-label">Name:</el-col>
          <el-col :span="16" class="info-value">Ford</el-col>
        </el-row>
        <el-row class="info-row">
          <el-col :span="8" class="info-label">QQ:</el-col>
          <el-col :span="16" class="info-value">1904943319</el-col>
        </el-row>
        <el-row class="info-row">
          <el-col :span="8" class="info-label">Email:</el-col>
          <el-col :span="16" class="info-value">19970825692@163.com</el-col>
        </el-row>
        <el-row class="info-row">
          <el-col :span="8" class="info-label">GitHub:</el-col>
          <el-col :span="16" class="info-value">
            <a href="https://github.com/Fordbeing/PTBlog-Vue" target="_blank">Click Me</a>
          </el-col>
        </el-row>

        <el-row class="info-row">
          <el-col :span="8" class="info-label">Today's Headlines</el-col>
          <el-col :span="16" class="info-value">
            <a href="https://www.toutiao.com/c/user/token/MS4wLjABAAAAW7bvP0MXdAoNsyA50m-6iLiNsYaAsMD4Jw19LNA-_uX1z6vd8c3in8tZICRylrn9/?source=tuwen_detail&entrance_gid=7405095446294626866&log_from=4c9a9d71f4df5_1724562949929" target="_blank">Click Me</a>
          </el-col>
        </el-row>

        <el-row class="info-row">
          <el-col :span="8" class="info-label">Location:</el-col>
          <el-col :span="16" class="info-value">Shang Hai</el-col>
        </el-row>
        <el-row class="info-row">
          <el-col :span="8" class="info-label">Occupation:</el-col>
          <el-col :span="16" class="info-value">Software Developer</el-col>
        </el-row>
      </div>
    </el-card>
  </template>
  
  <style scoped>
  .information {
    text-align: left; /* 更适合显示信息 */
    background-color: rgba(12, 11, 11, 0.5); /* 设置背景颜色透明度 */
    border: none; /* 去除边框 */
    border-radius: 8px; /* 保持圆角效果 */
    padding: 20px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    margin-top: 20px;
    height: 330px;
  }
  
  .info-section {
    display: flex;
    flex-direction: column;
  }
  
  .info-row {
    margin-bottom: 15px; /* 增加行间距 */
  }
  
  .info-label {
    font-weight: bold;
    color: #7e2f2f;
  }
  
  .info-value {
    font-size: 16px;
    color: #c79d9d;
  }
  
  a {
    color: #616b75;
    font-weight: bold;
    text-decoration: none;
  }
  
  a:hover {
    text-decoration: underline;
    color: #2c8fa8;
    font-weight: bold;
  }
  
  h2 {
    margin: 10px 0;
    font-size: 22px;
    color: #7e2f2f;
  }
  </style>
  