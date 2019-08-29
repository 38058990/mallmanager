<template>
  <el-card>
    <my-bread level1="商品管理" level2="商品分类"></my-bread>
    <el-row>
      <el-col :span="24" class="searchArea">
        <el-button type="success" @click="addGosdsCate()">添加分类</el-button>
      </el-col>
    </el-row>
    <!-- 添加分类的对话框 -->
    <el-dialog title="添加分类" :visible.sync="dialogFormVisibleAdd">
      <el-form :model="form">
        <el-form-item label="分类名称" label-width="120px">
          <el-input v-model="form.cat_name" autocomplete="off"></el-input>
        </el-form-item>
        <!-- 级联选择器 -->
        <el-form-item label="分类" label-width="120px">
          {{ selectedOptions }}
          <el-cascader
            :options="caslist"
            v-model="selectedOptions"
            expand-trigger="hover"
            change-on-select
            clearable
            :props="defaultProp"
          ></el-cascader>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisibleAdd = false">取消</el-button>
        <el-button type="primary" @click="addCate()">确定</el-button>
      </div>
    </el-dialog>
    <!-- 表格 -->
    <el-table :data="list" height="720" style="width:100%">
      <el-tree-grid
        prop="cat_name"
        label="分类名称"
        treeKey="cat_id"
        parentKey="cat_pid"
        levelKey="cat_level"
        childKey="children"
      ></el-tree-grid>
      <el-table-column label="级别">
        <template slot-scope="list">
          <span v-if="list.row.cat_level === 0">一级</span>
          <span v-else-if="list.row.cat_level === 1">二级</span>
          <span v-else-if="list.row.cat_level === 2">三级</span>
        </template>
      </el-table-column>

      <el-table-column label="是否有效">
        <template slot-scope="list">
          <span v-if="list.row.cat_deleted === false">有效</span>
          <span v-else-if="list.row.cat_deleted === true">无效</span>
        </template>
      </el-table-column>

      <el-table-column label="操作">
        <template slot-scope="list">
          <el-button
            type="primary"
            icon="el-icon-edit"
            circle
            size="mini"
            plain
            @click="showEditdia(list.row)"
          ></el-button>
          <el-button
            type="danger"
            icon="el-icon-delete"
            circle
            size="mini"
            plain
            @click="showDelefirm(list.row)"
          ></el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pagenum"
      :page-sizes="pageSizes"
      :page-size="pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
  </el-card>
</template>
<script>
var ElTreeGrid = require('element-tree-grid')
export default {
  components:{
    ElTreeGrid
  },
  data() {
    return {
      list: [],
      pagenum: 1,
      pagesize: 10,
      total: 1,
      pageSizes: [5, 10, 15, 20],
      dialogFormVisibleAdd: false,
      form: {
        cat_pid: -1,
        cat_name: "",
        cat_level: -1
      },
      caslist: [],
      selectedOptions: [],
      defaultProp: {
        value: "cat_id",
        label: "cat_name",
        children: "children"
      }
    };
  },
  methods: {
    //添加分类。显示对话框
    async addGosdsCate() {
        const res = await this.$http.get(`categories?type=2`)
        this.caslist = res.data.data
        this.dialogFormVisibleAdd = true
    },
    //添加分类，发送请求
    async addCate() {
      if (this.selectedOptions.length === 0) {
        this.form.cat_pid = 0
        this.form.cat_level = 0
      }else if (this.selectedOptions.length === 1) {
        this.form.cat_pid = this.selectedOptions[0]
        this.form.cat_level = 1
      }else if (this.selectedOptions.length === 2){
        this.form.cat_pid = this.selectedOptions[1]
        this.form.cat_level = 2
      }
      const res = await this.$http.post(`categories`,this.form)
      this.dialogFormVisibleAdd = false
      this.selectedOptions = []
      this.form.cat_name = ''
      this.getGoodsCate()
      this.$message.success(res.data.meta.msg)
    },
    //获取所有分类
    async getGoodsCate() {
      const res = await this.$http.get(
        `categories?type=3&pagenum=${this.pagenum}&pagesize=${this.pagesize}`
      );
      this.list = res.data.data.result;
      this.total = res.data.data.total;
      console.log(this.list);
    },
    //分页
    handleCurrentChange(val) {
        this.pagenum = val
        this.getGoodsCate()
    },
    handleSizeChange(val) {
        this.pagesize = val
        this.pagenum = 1
        this.getGoodsCate()
    }
  },
  created(){
      this.getGoodsCate()
  }
};
</script>
<style lang="scss" scoped>
.searchArea{
    margin-top: 20px;
}
</style>