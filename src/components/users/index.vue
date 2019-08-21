<template>
  <el-card class="box-card">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item>首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-row>
      <el-col>
        <el-input placeholder="请输入内容" class="input-with-select" v-model="query" clearable @clear="clearUser()">
          <el-button slot="append" icon="el-icon-search" @click="searchUser()"></el-button>
        </el-input>
        <el-button type="success" class="userSearch" @click="handleAdd()">添加用户</el-button>
      </el-col>
    </el-row>

    <el-table :data="tableData" style="width: 100%" max-height="800px">
      <el-table-column type="index" label="#" width="60"></el-table-column>
      <el-table-column prop="username" label="姓名" width="180"></el-table-column>
      <el-table-column prop="email" label="邮箱"></el-table-column>
      <el-table-column prop="mobile" label="电话"></el-table-column>
      <!-- 如果单元格内显示的内容不是字符串
                需要给被显示的内容外层嵌套一个标签
                如果在template内部要用数据，设置slot-scope属性
                slot-scope会自动去找上一级的数据源
                该属性的值是外部数据的数据源 == tableData
                tableDate有一个自带对象.row数组中的每个对象
      -->
      <el-table-column label="创建日期">
        <template slot-scope="tableData">{{ tableData.row.create_time | fmtdate}}</template>
      </el-table-column>
      <el-table-column prop="address" label="用户状态">
        <template slot-scope="tableData">
          <el-switch
            v-model="tableData.row.mg_state"
            active-color="#13ce66"
            inactive-color="#ff4949"
            @change="changeMgState(tableData.row)"
          ></el-switch>
        </template>
      </el-table-column>
      <el-table-column prop="address" label="操作">
        <template slot-scope="tableData">
          <el-button type="primary" icon="el-icon-edit" circle plain="plain" @click="handleUserEdit(tableData.row)"></el-button>
          <el-button type="success" icon="el-icon-check" circle plain="plain" @click="handleUserRol(tableData.row)"></el-button>
          <el-button type="danger" icon="el-icon-delete" circle plain="plain" @click="handleUserDel(tableData.row.id)"></el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pagenum"
      :page-sizes="[ 2, 4, 6, 8, 10]"
      :page-size="10"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    ></el-pagination>

    <el-dialog title="添加用户" :visible.sync="dialogFormVisible" :width="diaLogWidth">
      <el-form :model="form">
        <el-form-item label="用户名" :label-width="formLabelWidth">
          <el-input v-model="form.username" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="密码" :label-width="formLabelWidth">
          <el-input v-model="form.password" autocomplete="off" type="password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" :label-width="formLabelWidth">
          <el-input v-model="form.email" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="电话" :label-width="formLabelWidth">
          <el-input v-model="form.mobile" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser()">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 编辑用户 -->
    <el-dialog title="编辑用户" :visible.sync="dialogFormVisibleEdit" :width="diaLogWidth">
      <el-form :model="form">
        <el-form-item label="用户名" :label-width="formLabelWidth">
          <el-input v-model="form.username" autocomplete="off" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱" :label-width="formLabelWidth">
          <el-input v-model="form.email" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="电话" :label-width="formLabelWidth">
          <el-input v-model="form.mobile" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisibleEdit = false">取 消</el-button>
        <el-button type="primary" @click="editUser()">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 分配权限 -->
    <el-dialog title="分配角色" :visible.sync="dialogFormVisibleRol" width="30%">
      <el-form :model="form">
        <el-form-item label="用户名" label-width="100px">
          {{ currUserName }}
        </el-form-item>
        <el-form-item label="活动区域" label-width="100px">
          <el-select v-model="currRoleId">
            <el-option :label="item.roleName" :value="item.id" v-for="(item,i) in roles" :key="i"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisibleRol = false">取 消</el-button>
        <el-button type="primary" @click="setRole">确 定</el-button>
      </div>
    </el-dialog>
  </el-card>
</template>
<script>
export default {
  data() {
    return {
      tableData: [],
      query: "",
      pagenum: 1,
      pagesize: 10,
      total: -1,
      plain:true,
      dialogFormVisible: false,
      dialogFormVisibleEdit: false,
      dialogFormVisibleRol: false,
      formLabelWidth:"100px",
      diaLogWidth: '30%',
      form:{
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      //分配角色
      currRoleId:34,
      currUserName: '',
      currUserId: '',
      roles:[]
    };
  },
  created() {
    this.getUserList();
  },
  methods: {
    async getUserList() {
      //获取token
      const AUTH_TOKEN = localStorage.getItem("token");
      //使用axios文档中的携带请求头key和token value发送请求
      this.$http.defaults.headers.common["Authorization"] = AUTH_TOKEN;

      const res = await this.$http.get(
        `users?query=${this.query}&pagenum=${this.pagenum}&pagesize=${this.pagesize}`
      );
      const {
        data: { total, users },
        meta: { msg, status }
      } = res.data;
      if (status === 200) {
        this.tableData = users;
        this.total = total;
        this.$message.success(msg);
      } else {
        this.$message.warning(msg);
      }
    },
    handleSizeChange(val) {
      this.pagesize = val
      this.pagenum = 1
      this.getUserList()
    },
    handleCurrentChange(val) {
      this.pagenum = val
      this.getUserList()
    },
    searchUser(){
      this.getUserList()
    },
    clearUser(){
      this.getUserList()
    },
    handleAdd(){
      this.dialogFormVisible = true
    },
    async addUser(){
      this.dialogFormVisible = false
      const res = await this.$http.post(`users`,this.form)
      const {meta:{status,msg}} = res.data
      if (status === 201) {
        this.$message.success(msg)
        this.form = {}
        this.getUserList()
      }else{
        this.$message.warning(msg)
      }
    },
    handleUserDel(userDelId){
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async() => {
          const res = await this.$http.delete(`users/${userDelId}`)
          const {meta:{msg,status}} = res.data
          if (status === 200) {
            this.pagenum = 1
            this.getUserList()
            this.$message({
              type: 'success',
              message: msg
            });
          }
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });
    },
    handleUserEdit(user){
      this.form = user
      this.dialogFormVisibleEdit = true
    },
    async editUser(){
      const res = await this.$http.put(`users/${this.form.id}`,this.form)
      this.form = {}
      this.dialogFormVisibleEdit = false
      this.getUserList()
    },
    async changeMgState(user){
      //users/:uId/state/:type
      const res = await this.$http.put(`users/${user.id}/state/${user.mg_state}`)
      console.log(res);
      
      this.getUserList()
    },
    async handleUserRol(user){
      this.currUserName = user.username
      this.dialogFormVisibleRol = true
      this.currUserId = user.id
      const res = await this.$http.get(`roles`)
      console.log(res);
      
      this.roles = res.data.data
      const res1 = await this.$http.get(`users/530`)
      //此处权限问题，无法将uid赋值给currRoleId
      //this.currRoleId = res1.data.data.rid
    },
    async setRole(){
      const res = await this.$http.put(`users/${this.currRoleId}/role`,{
        rid: this.currRoleId
      })
      console.log(res);
      
      this.dialogFormVisibleRol = false
    }
  }
};
</script>
<style lang="scss" scoped>
.box-card {
  height: 100%;
  .el-input {
    width: 300px;
  }
  .userSearch {
    margin-left: 8px;
  }
  .userSearch,
  .el-input {
    margin-top: 10px;
  }
}
</style>