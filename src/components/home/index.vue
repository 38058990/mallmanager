<template>
  <el-container class="container">
    <el-header class="header">
      <el-row>
        <el-col :span="4">
          <div class="grid-content bg-purple">
            <img src="../../assets/image/logo.png" alt="无法显示图片" />
          </div>
        </el-col>
        <el-col :span="18">
          <h2>黑马后台管理系统</h2>
        </el-col>
        <el-col :span="2">
          <a href="#" @click.prevent="handleSignOut()">
            <el-button type="primary">退出</el-button>
          </a>
        </el-col>
      </el-row>
    </el-header>
    <el-container>
      <el-aside width="202px" class="aside">
        <el-menu
          default-active="2"
          class="el-menu-vertical-demo"
          background-color="#545c64"
          text-color="#fff"
          active-text-color="#ffd04b"
          :default-active="activerouter"
          :unique-opened="true"
          :router="true"
        >
          <el-submenu :index="item1.order + ''" v-for="(item1,i) in menuList" :key="i">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>{{ item1.authName }}</span>
            </template>
            <el-menu-item :index="item2.path" v-for="(item2,i) in item1.children" :key="i">
              <span>{{ item2.authName }}</span>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main class="main">
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>
<script>
export default {
  name: "home",
  data() {
    return {
      activerouter:'',
      menuList: []
    };
  },
  beforeCreate() {
    //此处原位判断token
  },
  mounted() {
    let currentUrl = window.location.href;
    this.activerouter = currentUrl.split("/#/")[1];
  },
  created() {
    this.getMenu();
  },
  methods: {
    handleSignOut() {
      localStorage.clear();
      this.$message.success("退出成功");
      this.$router.push({ name: "login" });
    },
    async getMenu() {
      const res = await this.$http.get(`menus`);
      this.menuList = res.data.data;
    }
  }
};
</script>
<style lang="scss" scoped>
.container {
  height: 100%;
  .header {
    background-color: #b3c0d1;
    color: #333;
    text-align: center;
    a {
      text-decoration: none;
      line-height: 60px;
    }
  }
  .aside {
    background-color: #d3dce6;
    color: #333;
  }
  .main {
    background-color: #e9eef3;
    color: #333;
  }
}
</style>