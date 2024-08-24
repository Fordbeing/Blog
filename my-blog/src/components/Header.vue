<template>
  <el-header class="header">
    <el-container>
      <el-row type="flex" align="middle" class="header-row">
        <!-- Home Button Column -->
        <el-col :span="3" class="home-col">
          <el-button type="primary" class="home-button" @click="goHome">Home</el-button>
        </el-col>
        
        <!-- Logo Column -->
        <el-col :span="6" class="logo-col">
          <h1 class="logo">PTBlog</h1>
        </el-col>

        <!-- Additional Columns -->
        <el-col :span="3" class="logo-col">
          <h1 class="talk">Tree Hole</h1>
        </el-col>
        <el-col :span="3" class="logo-col">
          <h1 class="talk">Tree Hole</h1>
        </el-col>
        <el-col :span="3" class="logo-col">
          <h1 class="talk">Tree Hole</h1>
        </el-col>

        <!-- Categories Dropdown -->
        <!-- <el-col :span="3" class="categories">
          <el-dropdown trigger="click">
            <span class="el-dropdown-link">
              <span class="dropdown-title">
                Categories <i class="el-icon-arrow-down el-dropdown__icon"></i>
              </span>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item>Tech</el-dropdown-item>
              <el-dropdown-item>Life</el-dropdown-item>
              <el-dropdown-item>Travel</el-dropdown-item>
              <el-dropdown-item>Food</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </el-col> -->

        <!-- Search Column -->
        <el-col :span="6" class="search-col">
          <el-input placeholder="Search..." v-model="searchQuery"  class="search-input" />
          <el-button class="search-button" icon="el-icon-search" @click="handleSearch">Search</el-button>
        </el-col>
      </el-row>
    </el-container>
  </el-header>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { ref } from 'vue';

const searchQuery = ref('');

const router = useRouter();
const goHome = () => {
  router.push('/');
};
const handleSearch = () => {
  // Handle search functionality here
  console.log('Searching for: ', searchQuery);
  
};
</script>

<style scoped>
.header {
  background-color: #282c34;
  color: #ffffff;
  padding: 20px;
  width: 100%;
  display: flex;
  align-items: center;
}

.header-row {
  width: 100%;
}

.home-col {
  text-align: left;
}

.home-button {
  background: linear-gradient(45deg, #424446, #8a5779);
  color: #201b1b;
  border: none;
  height: 40px;
  border-radius: 20px;
  font-weight: bold;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;
}

.home-button:hover {
  background: linear-gradient(45deg, #34393f, #409eff);
  transform: translateY(-2px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.3);
  color: #7e15a8;
}

.logo-col {
  text-align: left;
}

.logo {
  font-size: 24px;
  font-weight: bold;
  color: #ffffff;
}

.categories {
  text-align: center;
}

.search-col {
  display: flex;
  align-items: center;
  justify-content: flex-end;
}

.search-input {
  max-width: 250px;
  margin-right: 10px;
}

.search-button {
  background: linear-gradient(45deg, #424446, #8a5779);
  color: #201b1b;
  border: none;
  height: 40px;
  border-radius: 20px;
  font-weight: bold;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;
}

.search-button:hover {
  background: linear-gradient(45deg, #34393f, #409eff);
  transform: translateY(-2px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.3);
  color: #7e15a8;
}

.el-dropdown-link {
  cursor: pointer;
  color: #ffffff;
}

.el-dropdown-menu {
  background-color: #ffffff;
  color: #000000;
}

.el-dropdown-item {
  padding: 10px 20px;
}

.el-dropdown-item:hover {
  background-color: #f5f5f5;
}
</style>
