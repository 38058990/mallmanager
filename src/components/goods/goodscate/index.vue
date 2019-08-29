<template>
  <el-card>
    <my-bread level1="商品管理" level2="分类参数"></my-bread>
    <el-alert type="error" title="只允许为第三级分类设置参数" class="alert"></el-alert>
    <el-form label-position="left" label-width="80px" class="alert">
      <el-form-item label="商品分类">
        <el-cascader
          clearable
          expand-trigger="hover"
          :options="options"
          v-model="selectdOption"
          :props="defaultProps"
          @change="handleChange"
          :show-all-levels="false"
        ></el-cascader>
      </el-form-item>
    </el-form>
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="动态参数" name="1">
        <el-table :data="arrDyparams" style="width: 100%">
          <el-table-column type="expand" label="#">
            <template slot-scope="props">
              <el-tag
                :key="tag"
                v-for="tag in props.row.attr_vals"
                closable
                :disable-transitions="false"
                @close="handleClose(props.row,tag)"
              >{{tag}}</el-tag>
              <el-input
                class="input-new-tag"
                v-if="inputVisible"
                v-model="inputValue"
                ref="saveTagInput"
                size="small"
                @keyup.enter.native="handleInputConfirm(props.row)"
                @blur="handleInputConfirm(props.row)"
              ></el-input>
              <el-button v-else class="button-new-tag" size="small" @click="showInput">+ New Tag</el-button>
            </template>
          </el-table-column>
          <el-table-column label="属性名称" prop="attr_name"></el-table-column>
          <el-table-column label="操作">
            <template slot-scope="props">
              <el-button
                type="primary"
                size="mini"
                plain
                icon="el-icon-edit"
                circle
                @click="showEditUserDia(props.row)"
              ></el-button>
              <el-button
                type="danger"
                size="mini"
                plain
                icon="el-icon-delete"
                circle
                @click="showDeleUserMsgBox(props.row.id)"
              ></el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
      <el-tab-pane label="配置管理" name="only">
        <el-table :data="arrStaticparams" style="width: 100%">
          <el-table-column type="index" label="#"></el-table-column>
          <el-table-column label="属性名称" prop="attr_name"></el-table-column>
          <el-table-column label="属性名称" prop="attr_vals"></el-table-column>
          <el-table-column label="操作">
            <template slot-scope="props">
              <el-button
                type="primary"
                size="mini"
                plain
                icon="el-icon-edit"
                circle
                @click="showEditUserDia(props.row)"
              ></el-button>
              <el-button
                type="danger"
                size="mini"
                plain
                icon="el-icon-delete"
                circle
                @click="showDeleUserMsgBox(props.row.id)"
              ></el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
    </el-tabs>
  </el-card>
</template>
<script>
export default {
  data() {
    return {
      options: [],
      selectdOption: [],
      defaultProps: {
        label: "cat_name",
        value: "cat_id",
        children: "children"
      },
      arrDyparams: [],
      //选项卡数据
      activeName: "1",
      //添加tag数据
      inputVisible: false,
      inputValue: "",
      //静态标签
      arrStaticparams:[]
    };
  },
  methods: {
    //获取三级数据
    async getGoodsCate() {
      const res = await this.$http.get(`categories?type=3`);
      console.log(res);
      this.options = res.data.data;
    },
    //动态获取参数
    async handleChange() {
      if (this.selectdOption.length === 3) {
        const res = await this.$http.get(
          `categories/${this.selectdOption[2]}/attributes?sel=many`
        );
        this.arrDyparams = res.data.data;
        this.arrDyparams.forEach(item => {
          item.attr_vals =
            item.attr_vals.length === 0 ? [] : item.attr_vals.trim().split(",");
        });
      }
      this.handleClick()
    },
    //选项卡方法
    async handleClick() {
        if (this.activeName === "only") {
            if (this.selectdOption.length === 3) {
                console.log(3);
                const res = await this.$http.get(`categories/${this.selectdOption[2]}/attributes?sel=only`)
                this.arrStaticparams = res.data.data
                console.log(res);
                
            }
        }
    },
    //tag卡片方法
    async handleClose(propsRow,tag) {
      propsRow.attr_vals.splice(propsRow.attr_vals.indexOf(tag), 1);
      let putData = {
          attr_name : propsRow.attr_name,
          attr_sel : 'many',
          attr_vals : propsRow.attr_vals.join(',')
      }
      const res = await this.$http.put(`categories/${this.selectdOption[2]}/attributes/${propsRow.attr_id}`,putData)
      console.log(res);
      
    },

    showInput() {
      this.inputVisible = true;
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },

    async handleInputConfirm(propsRow) {
      let inputValue = this.inputValue;
      if (inputValue) {
        propsRow.attr_vals.push(inputValue);
        let putData = {
          attr_name : propsRow.attr_name,
          attr_sel : 'many',
          attr_vals : propsRow.attr_vals.join(',')
        }
        const res = await this.$http.put(`categories/${this.selectdOption[2]}/attributes/${propsRow.attr_id}`,putData)
        console.log(res);
        
      }
      this.inputVisible = false;
      this.inputValue = "";
    }
  },
  created() {
    this.getGoodsCate();
  }
};
</script>
<style scoped>
.alert {
  margin-top: 6px;
}
</style>