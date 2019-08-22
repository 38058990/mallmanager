<template>
  <el-card>
    <my-bread level1="权限管理" level2="权限列表"></my-bread>
    <el-row>
      <el-col>
        <el-button type="primary" class="roleBtn">添加角色</el-button>
      </el-col>
    </el-row>
    <el-table :data="rolelist" style="width: 100%" max-height="800px" height="760px">
      <el-table-column type="expand">
        <template slot-scope="rolelist">
          <el-row
            v-for="(item1,i) in rolelist.row.children"
            :key="i"
            :class="['borderBottom', i === 0 ? 'borderTop' : '']"
          >
            <el-col :span="4">
              <el-tag @close="deleRight(rolelist.row,item1.id)" closable>{{ item1.authName }}</el-tag>
              <i class="el-icon-caret-right"></i>
            </el-col>
            <el-col :span="20">
              <el-row
                v-for="(item2,iTwo) in item1.children"
                :key="item2.id"
                :class=" iTwo === 0 ? '' : 'borderTop'"
              >
                <el-col :span="4">
                  <el-tag
                    @close="deleRight(rolelist.row,item2.id)"
                    type="success"
                    closable
                  >{{ item2.authName }}</el-tag>
                  <i class="el-icon-caret-right"></i>
                </el-col>
                <el-col :span="20">
                  <el-tag
                    @close="deleRight(rolelist.row,item3.id)"
                    type="warning"
                    v-for="(item3,i) in item2.children"
                    :key="item3.id"
                    :disable-transitions="false"
                    closable
                  >{{ item3.authName }}</el-tag>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
          <span v-if="rolelist.row.children.length === 0">未分配权限</span>
        </template>
      </el-table-column>
      <el-table-column type="index" label="#"></el-table-column>
      <el-table-column prop="roleName" label="角色名称"></el-table-column>
      <el-table-column prop="roleDesc" label="角色描述"></el-table-column>
      <el-table-column prop="address" label="操作">
        <template slot-scope="rolelist">
          <el-button type="primary" icon="el-icon-edit" circle plain="plain"></el-button>
          <el-button
            type="success"
            icon="el-icon-check"
            circle
            plain="plain"
            @click="showSetRightDia(rolelist.row)"
          ></el-button>
          <el-button type="danger" icon="el-icon-delete" circle plain="plain"></el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 修改权限的对话框 -->
    <el-dialog title="分配权限" :visible.sync="dialogFormVisibleSet" width="600px">
      <el-tree
        :data="treelist"
        show-checkbox
        node-key="id"
        :props="defaultProps"
        :default-checked-keys="arrcheck"
        default-expand-all
        ref="tree"
      ></el-tree>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisibleSet = false">取 消</el-button>
        <el-button type="primary" @click="setRoleRight()">确 定</el-button>
      </div>
    </el-dialog>
  </el-card>
</template>
<script>
export default {
  name: "role",
  data() {
    return {
      rolelist: [],
      //修改权限的对话框
      dialogFormVisibleSet: false,
      treelist: [],
      defaultProps: {
        label: "authName",
        children: "children"
      },
      //获取已经拥有权限的ID赋值个树形图
      arrcheck: [],
      //设置ID好让diag获取
      currRoleId: -1
    };
  },
  created() {
    this.getRolelList();
  },
  methods: {
    //获取权限列表
    async getRolelList() {
      const res = await this.$http.get(`roles`);
      this.rolelist = res.data.data;
    },
    //删除权限列表
    async deleRight(role, rightId) {
      const res = await this.$http.delete(`roles/${role.id}/rights/${rightId}`);
      this.$message.success(res.data.meta.msg);
      //将返回的剩余权限重新赋值给role的children
      role.children = res.data.data;
    },
    //设置角色权限
    async showSetRightDia(role) {
      this.dialogFormVisibleSet = true;
      const res = await this.$http.get(`rights/tree`);

      this.treelist = res.data.data;

      //获取已经有的权限ID
      let arrtemp2 = [];
      role.children.forEach(item1 => {
        arrtemp2.push(item1.id);
        item1.children.forEach(item2 => {
          arrtemp2.push(item2.id);
          item2.children.forEach(item3 => {
            arrtemp2.push(item3.id);
          });
        });
      });
      this.arrcheck = arrtemp2;
      //赋值ID
      this.currRoleId = role.id;
    },
    //发送更改请求
    async setRoleRight() {

      //获取所有选中的ID
      let arr1 = this.$refs.tree.getCheckedKeys();

      let arr2 = this.$refs.tree.getHalfCheckedKeys();

      let arr = [...arr1, arr2];


      const res = await this.$http.post(`roles/${this.currRoleId}/rights`, {
        rids: arr.join(",")
      });

      //更新试图

      this.getRolelList()

      this.dialogFormVisibleSet = false
    }
  }
};
</script>
<style lang="scss" scoped>
.roleBtn {
  margin-top: 10px;
}

.borderBottom {
  border-bottom: 1px solid #ddd;
}

.borderTop {
  border-top: 1px solid #ddd;
}

.el-tag {
  margin: 10px 5px;
}

.el-col {
  white-space: nowrap;
}

.el-col-20 {
  white-space: normal;
}
</style>