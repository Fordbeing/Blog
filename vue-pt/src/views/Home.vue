<template>
  <div class="home">
    <el-row :gutter="20">
      <el-col :span="8" style="margin-top: 20px;">
        <el-card shadow="hover" class="box-card">
          <div class="user">
            <img :src="getImageUrl('user')" class="user" />
            <div class="user-info">
              <p class="user-info-admin">Admin</p>
              <p class="user-info-p">管理员</p>
            </div>
          </div>
          <div class="login-info">
            <p>上次登陆时间：<span>2024年8月</span></p>
            <p>上次登陆地点：<span>北京</span></p>
          </div>
        </el-card>

        <el-card shadow="hover" class="user-table">
          <el-table :data="tableData">
            <el-table-column v-for="(val, key) in tableLabel" :prop="key" :label="val">
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>
      <el-col :span="16" style="margin-top: 20px;">
        <div class="numA">
          <el-card shadow="hover" :body-style="{ display: 'flex', padding: 0 }" v-for="item in countData"
            :key="item.name">
            <component :is="item.icon" class="icons" :style="{ background: item.color }"></component>
            <div class="detail">
              <p class="num">{{ item.value }}</p>
              <p class="txt">{{ item.name }}</p>
            </div>

          </el-card>
        </div>
      </el-col>
    </el-row>
  </div>
</template>


<script setup>
import { ref, getCurrentInstance, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
const { proxy } = getCurrentInstance()
const getImageUrl = (user) => {
  return new URL(`../assets/images/${user}.png`, import.meta.url).href;
}

const tableData = ref([])

const countData = ref([
  {
    name: "今日访者数量",
    value: 1234,
    icon: "SuccessFilled",
    color: "#2ec7c9",
  },
  {
    name: "Github Star",
    value: 210,
    icon: "StarFilled",
    color: "#ffb980",
  },
  {
    name: "总访问量",
    value: 1234,
    icon: "GoodsFilled",
    color: "#5ab1ef",
  },
])

const tableLabel = ref({
  userID: 'ID',
  username: '姓名',
  email: '邮箱',
  registrationTime: '注册时间'
})

const getTableData = async () => {
  const data = await proxy.$api.getTableData()
  console.log(data.data);
  tableData.value = data.data
}

const getCountData = async () => {
  const data = await proxy.$api.getCountData()
  // console.log(data);
  countData.value = data
}

onMounted(() => {
  getTableData();
  getCountData();
});
</script>




<style scoped lang="less">
.home {
  height: 100%;
  overflow: hidden;
  background: url('@/assets/images/background.png') no-repeat center center fixed;
  background-size: cover;

  .user {
    display: flex;
    align-items: center;
    border-bottom: 1px solid #ccc;
    margin-bottom: 20px;

    img {
      width: 150px;
      height: 150px;
      border-radius: 50%;
      margin-right: 40px;
    }

    .user-info {
      p {
        line-height: 40px;
      }

      .user-info-p {
        color: #999;
      }

      .user-info-admin {
        font-size: 35px
      }
    }
  }

  .login-info {
    p {
      line-height: 30px;
      font-size: 14px;
      color: #999;

      span {
        color: #666;
        margin-left: 60px;
      }
    }
  }

  .user-table {
    margin-top: 20px;
    height: 370px;
  }

  .numA {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;

    .el-card {
      width: 32%;
      margin-bottom: 20px;
    }

    .icons {
      width: 80px;
      height: 80px;
      font-size: 30px;
      text-align: center;
      line-height: 80px;
      color: #fff;
    }

    .detail {
      margin-left: 15px;
      display: flex;
      flex-direction: column;
      justify-content: center;

      .num {
        font-size: 30px;
        text-align: center;
        margin-bottom: 10px
      }

      .txt {
        font-size: 15px;
        text-align: center;
        color: #999;
      }
    }
  }
}
</style>
