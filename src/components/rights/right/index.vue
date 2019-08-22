<template>
  <el-card>
    <my-bread level1="权限管理" level2="权限列表"></my-bread>
    <el-table :data="rightlist" border style="width: 100%" max-height="800px">
      <el-table-column type="index" label="#" width="180"></el-table-column>
      <el-table-column prop="authName" label="权限名称" width="180"></el-table-column>
      <el-table-column prop="path" label="路径"></el-table-column>
      <el-table-column label="层级">
        <template slot-scope="scope">
          <span v-if="scope.row.level ==='0'">一级</span>
          <span v-if="scope.row.level ==='1'">二级</span>
          <span v-if="scope.row.level ==='2'">三级</span>
        </template>
      </el-table-column>
    </el-table>
  </el-card>
</template>
<script>
export default {
  name: "right",
  data() {
    return {
      rightlist: []
    };
  },
  created() {
    this.getRigthList();
  },
  methods: {
    async getRigthList() {
      const res = await this.$http.get(`rights/list`);
      this.rightlist = res.data.data;
    }
  }
};
</script>
<style lang="scss" scoped>
.el-table{
  margin-top: 10px;
}
</style>