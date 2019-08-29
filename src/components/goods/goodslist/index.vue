<template>
  <el-card>
    <my-bread level1="商品管理" level2="商品列表"></my-bread>
    <el-row>
      <el-col>
        <el-input v-model="query" placeholder="请输入内容" clearable @clear="clearGoods()">
            <el-button slot="append" icon="el-icon-search" @click="searchGoodlist()"></el-button>
        </el-input>
        <el-button type="success" class="goodsSearch" @click="$router.push({name:'goodsadd'})">添加商品</el-button>
      </el-col>
    </el-row>
    <el-table :data="goodslist" border style="width: 100%" max-height="800px" height="720px">
      <el-table-column type="index" label="#" width="60"></el-table-column>
      <el-table-column prop="goods_name" label="商品名称" width="880"></el-table-column>
      <el-table-column prop="goods_price" label="商品价格"></el-table-column>
      <el-table-column prop="goods_weight" label="商品重量"></el-table-column>
      <el-table-column prop="add_time" label="创建时间">
          <template slot-scope="goodslist">{{goodslist.row.add_time | fmtdate}}</template>
      </el-table-column>
      <el-table-column prop="address" label="操作">
          <template slot-scope="goodslist">
              <el-button type="primary" icon="el-icon-edit" size="mini"></el-button>
              <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeGoods(goodslist.row.goods_id)"></el-button>
          </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pagenum"
      :page-sizes="[2, 4, 6, 8, 10]"
      :page-size="10"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
  </el-card>
</template>
<script>
export default {
  data() {
    return {
      query: '',
      goodslist:[],
      pagenum: 1,
      pagesize: 10,
      total: -1
    };
  },
  methods:{
      //获取表格数据query	查询参数	可以为空
    // pagenum	当前页码	不能为空
    // pagesize
    async getGoodsList(){
        const res = await this.$http.get(`goods?query=${this.query}&pagenum=${this.pagenum}&pagesize=${this.pagesize}`)
        const {data:{goods,pagenum,total},meta:{msg,status}} = res.data
        if (status === 200) {
            this.$message.success(msg)
            this.goodslist = goods
            this.total = total
        }
        
    },
    //页也显示个数和页码操作
    handleSizeChange(val){
        this.pagesize = val
        this.getGoodsList()
    },
    //页码操作
    handleCurrentChange(val){
        this.pagenum = val
        this.getGoodsList()
    },
    //搜索商品
    searchGoodlist(){
        this.pagenum = 1
        this.getGoodsList()
    },
    //清除搜索框
    clearGoods(){
        this.getGoodsList()
    },
    //删除商品
    async removeGoods(goodsId){
          this.$confirm('此操作将永久删除该商品, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async() => {
          const res = await this.$http.delete(`goods/${goodsId}`)          
          const {meta:{msg,status}} = res.data
          if (status === 200) {
            this.pagenum = 1
            this.getGoodsList()
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
    }
  },
  mounted(){
      this.getGoodsList()
  }
};
</script>
<style lang="scss" scoped>
.el-col {
  margin-top: 10px;
  .el-input {
    width: 300px;
  }
  .goodsSearch{
      margin-left: 8px;
  }
}
.el-table{
    margin-top: 10px;
}
</style>