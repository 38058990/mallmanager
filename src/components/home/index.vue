<template>
    <el-container class="container">
        <el-header class="header">
            <el-row>
                <el-col :span="4">
                    <div class="grid-content bg-purple">
                        <img src="../../assets/image/logo.png" alt="无法显示图片">
                    </div>
                </el-col>
                <el-col :span="18">
                    <h2>黑马后台管理系统</h2>
                </el-col>
                <el-col :span="2">
                    <a href="#" @click.prevent="handleSignOut()">退出</a>
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
                    :unique-opened="true"
                    :router="true">
                    <el-submenu index="1">
                        <template slot="title">
                            <i class="el-icon-location"></i>
                            <span>用户管理</span>
                        </template>
                        <el-menu-item index="users">
                            <span>用户列表</span>
                        </el-menu-item>
                    </el-submenu>

                    <el-submenu index="2">
                        <template slot="title">
                            <i class="el-icon-location"></i>
                            <span>权限管理</span>
                        </template>
                        <el-menu-item index="1-1">
                            <span>导航2</span>
                        </el-menu-item>
                        <el-menu-item index="1-2">
                            <span>导航1-2</span>
                        </el-menu-item>
                    </el-submenu>

                    <el-submenu index="3">
                        <template slot="title">
                            <i class="el-icon-location"></i>
                            <span>商品管理</span>
                        </template>
                        <el-menu-item index="1-1">
                            <span>导航3</span>
                        </el-menu-item>
                    </el-submenu>

                    <el-submenu index="4">
                        <template slot="title">
                            <i class="el-icon-location"></i>
                            <span>订单管理</span>
                        </template>
                        <el-menu-item index="1-4">
                            <span>导航3</span>
                        </el-menu-item>
                    </el-submenu>

                    <el-submenu index="5">
                        <template slot="title">
                            <i class="el-icon-location"></i>
                            <span>数据统计</span>
                        </template>
                        <el-menu-item index="1-5">
                            <span>导航3</span>
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
    name:'home',
    beforeCreate(){
        const token = localStorage.getItem('token')
        if (!token) {
            this.$router.push({name:'login'})
        }
    },
    methods:{
        handleSignOut(){
            localStorage.clear();
            this.$message.success('退出成功')
            this.$router.push({name: 'login'})
        }
    }
}
</script>
<style lang="scss" scoped>
.container{
    height: 100%;
    .header{
        background-color: #B3C0D1;
        color: #333;
        text-align: center;
        a{
            text-decoration: none;
            line-height: 60px;
        }
    }
    .aside{
        background-color: #D3DCE6;
        color: #333;
        text-align: center;
        line-height: 200px;
    }
    .main{
        background-color: #E9EEF3;
        color: #333;
        text-align: center;
        line-height: 160px;
    }
}
</style>