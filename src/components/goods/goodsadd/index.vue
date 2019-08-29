<template>
  <el-card>
    <my-bread level1="商品列表" level2="商品列表"></my-bread>
    <el-alert type="success" title="添加商品信息" center show-icon class="alert"></el-alert>
    <el-steps :active="1*active" finish-status="success" simple style="margin-top:20px">
      <el-step title="基本信息"></el-step>
      <el-step title="商品参数"></el-step>
      <el-step title="商品属性"></el-step>
      <el-step title="商品图片"></el-step>
      <el-step title="商品内容"></el-step>
    </el-steps>
    <el-form
      label-position="top"
      :model="form"
      label-width="80px"
      style="height: 600px; overflow:auto"
    >
      <el-tabs v-model="active" tab-position="left" @tab-click="tabChange()">
        <el-tab-pane name="1" label="基本信息">
          <el-form-item label="商品名称">
            <el-input v-model="form.goods_name"></el-input>
          </el-form-item>
          <el-form-item label="商品价格">
            <el-input v-model="form.goods_price"></el-input>
          </el-form-item>
          <el-form-item label="商品重量">
            <el-input v-model="form.goods_weight"></el-input>
          </el-form-item>
          <el-form-item label="商品数量">
            <el-input v-model="form.goods_number"></el-input>
          </el-form-item>
          <el-form-item label="商品分类">
            {{selectdOption}}
            <el-cascader
              :options="options"
              v-model="selectdOption"
              expand-trigger="hover"
              :props="defaultProps"
              @change="handelChange"
            ></el-cascader>
          </el-form-item>
        </el-tab-pane>
        <el-tab-pane name="2" label="商品参数">
          <el-form-item :label="item1.attr_name" v-for="(item1,i) in arrDyparams" :key="i">
            <el-checkbox-group v-model="item1.attr_vals">
              <el-checkbox border :label="item2" v-for="(item2,i) in item1.attr_vals" :key="i"></el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </el-tab-pane>
        <el-tab-pane name="3" label="商品属性">
          <el-form-item v-for="(item,i) in arrStaticparams" :label="item.attr_name" :key="i">
            <el-input v-model="item.attr_vals"></el-input>
          </el-form-item>
        </el-tab-pane>
        <el-tab-pane name="4" label="商品图片">
          <el-form-item>
            <el-upload
              action="http://www.xiaomadagege.cn:8888/api/private/v1/upload"
              :headers="headers"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              :on-success="handleSucess"
              list-type="picture">
              <el-button size="small" type="primary">点击上传</el-button>
              <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
            </el-upload>
          </el-form-item>
        </el-tab-pane>
        <el-tab-pane name="5" label="商品内容">
          <el-button type="primary" class="addgoods" @click="addGoods()">添加商品</el-button>
          <quill-editor v-model="form.goods_introduce"></quill-editor>
        </el-tab-pane>
      </el-tabs>
    </el-form>
  </el-card>
</template>
<script>
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

import { quillEditor } from 'vue-quill-editor'
export default {
  components: {
    quillEditor
  },
  data() {
    return {
      active: "1",
      form: {
        goods_name: "",
        goods_cat: "",
        goods_price: "",
        goods_number: "",
        goods_weight: "",
        goods_introduce: "",
        pics: [],
        attrs: []
      },
      //级联选择器数据
      options:[],
      selectdOption:[],
      defaultProps:{
        label:'cat_name',
        value:'cat_id',
        children: 'children'
      },
      arrDyparams:[],
      //静态参数数组
      arrStaticparams:[],
      //图片上传
      headers:{
        Authorization : sessionStorage.getItem('token')
      }
    };
  },
  created(){
    this.getGoodsCate()
  },
  methods:{
    handelChange(){

    },
    async getGoodsCate(){
      const res = await this.$http.get(`categories?type=3`)
      console.log(res);
      this.options = res.data.data
    },
    async tabChange(){
      if (this.active === '2') {
        if (this.selectdOption.length !==2 && this.selectdOption.length !==3) {
          this.$message.warning('请选择商品分类')
          return
        }
        if (this.selectdOption.length === 2) {
          const res = await this.$http.get(`categories/${this.selectdOption[1]}/attributes?sel=many`)
          this.arrDyparams = res.data.data
          
        }else if(this.selectdOption.length === 3){
          const res1 = await this.$http.get(`categories/${this.selectdOption[2]}/attributes?sel=many`)
          this.arrDyparams = res1.data.data
          this.arrDyparams.forEach(item => {
            item.attr_vals = item.attr_vals.length === 0 ? [] : item.attr_vals.trim().split(',')
          })
        }
      }else if(this.active === '3'){
        if (this.selectdOption.length !==2 && this.selectdOption.length !==3) {
          this.$message.warning('请选择商品分类')
          return
        }
        if (this.selectdOption.length === 2) {
          const res2 = await this.$http.get(`categories/${this.selectdOption[1]}/attributes?sel=only`)
          this.arrStaticparams = res2.data.data  
        }else if(this.selectdOption.length === 3){
          const res3 = await this.$http.get(`categories/${this.selectdOption[2]}/attributes?sel=only`)
          this.arrStaticparams = res3.data.data        
        }
      }
    },
    handlePreview(){

    },
    handleRemove(file){
      let Index = this.form.pics.findIndex((item) => {
        return item.pic === file.response.data.tmp_path
      })
      //首先定义一个参数接收，当前删除的值循环数组，如果等于当前file传回来的值，findIndex方法会返回索引
      //然后当前的数组删除该索引位置的值，删除一个
      this.form.pics.splice(Index,1)
    },
    handleSucess(file){
      this.form.pics.push({
        pic:file.data.tmp_path
      })
    },

    //添加商品
    async addGoods(){
      this.form.goods_cat = this.selectdOption.join(',')

      let arr1 = this.arrDyparams.map((item) => {
        return {attr_id:item.attr_id,attr_value:item.attr_vals}
      })

      let arr2 = this.arrStaticparams.map((item) => {
        return {attr_id:item.attr_id,attr_value:item.attr_value}
      })

      this.form.attrs = [...arr1,...arr2]
      const res = await this.$http.post(`goods`,this.form)
      console.log(res);
      
      this.$router.push({name:'goods'})
    }
  }
};
</script>
<style lang="scss" scoped>
.alert {
  margin-top: 8px;
}
.addgoods{
  margin-bottom: 10px;
}
</style>
<style>
.ql-editor {
  min-height: 500px;
}
</style>