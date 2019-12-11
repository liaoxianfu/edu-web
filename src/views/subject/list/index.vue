<template>
  <div class="app-container">
    <h2>课程主题</h2>
    <el-tree
      :data="data"
      show-checkbox
      node-key="id"
      default-expand-all
      :expand-on-click-node="false">
      <span class="custom-tree-node" slot-scope="{ node, data }">
        <span>{{ node.label }}</span>
      <el-button
        type="text"
        size="mini"
        @click="() => remove(node, data)"
      >
            删除
          </el-button>
      </span>
    </el-tree>
    <!--添加添加标题按钮-->
    <!-- Form -->
    <br>
    <br>
    <el-button type="primary" @click="dialogInit">添加一级标题</el-button>

    <el-dialog title="添加一级标题" :visible.sync="dialogFormVisible">
      <el-form :model="form">
        <el-form-item label="标题名称" :label-width="formLabelWidth">
          <el-input v-model="form.title" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addSub">确 定</el-button>
      </div>
    </el-dialog>


    <el-button type="primary" @click="dialog2Init">添加二级标题</el-button>


    <el-dialog title="添加二级标题" :visible.sync="dialogFormVisible2">
      <el-form :model="form2">

        <el-form-item label="添加标题" :label-width="formLabelWidth">
          <el-select v-model="form2.parentId" placeholder="请选择一级标题">
            <el-option
              v-for="item in parentSubList"
              :key="item.id"
              :label="item.title"
              :value="item.id">
            </el-option>
          </el-select>
          <el-input v-model="form2.title" autocomplete="off" placeholder="请输入二级标题名称"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible2 = false">取 消</el-button>
        <el-button type="primary" @click="addSub2">确 定</el-button>
      </div>
    </el-dialog>

  </div>
</template>


<script>

  import {getSubject, deleteSubject, addSubject,getFirstLevelSubList} from "../../../api/subject";

  export default {
    data() {
      return {
        data: [],
        parentSubList:[], // 一级标题的数据
        defaultProps: {
          children: 'children',
          label: 'label'
        },
        dialogFormVisible: false,
        dialogFormVisible2: false,
        form: {
          title: '',
        },
        form2: {
          parentId: '',
          title: '',
        },
        formLabelWidth: '120px',


      };
    },
    methods: {
      getData() {
        getSubject().then(res => {
          // console.log(res.data)
          this.data = res.data.items;
        }).catch(res => {
          console.log(res)
        })
      },
      remove(node, data) {
        // console.log(data.id)
        deleteSubject(data.id).then(res => {
          if (res.success) {
            this.$message({
              type: 'success',
              message: '删除成功!'
            });

            const parent = node.parent;
            const children = parent.data.children || parent.data;
            const index = children.findIndex(d => d.id === data.id);
            children.splice(index, 1);
          } else {
            this.$message({
              type: 'error',
              message: '删除失败,标题已经存在!'
            });
          }
        }).catch(res => {
          this.$message({
            type: 'error',
            message: '删除失败!'
          });
        })

      },

      addSub() {
        addSubject(this.form).then(res => {
          if (res.success) {
            this.$message({
              type: 'success',
              message: '添加成功!'
            });
            this.dialogFormVisible = false
            this.getData()
          } else {
            this.$message({
              type: 'error',
              message: '添加失败!'
            });
          }
        }).catch(reason => {
          this.$message({
            type: 'error',
            message: '添加失败!'
          });
        })
      },
      dialogInit() {
        this.form.title = ""
        this.dialogFormVisible = true
      },
      dialog2Init(){
        this.form2.title = ""
        this.dialogFormVisible2 = true
        getFirstLevelSubList().then(res=>{
          if (res.success){
            console.log(res.data.items)
            this.parentSubList = res.data.items;
          }else {
            this.$message({
              type: 'error',
              message: '获取数据失败!'
            });
          }
        }).catch(res=>{
          this.$message({
            type: 'error',
            message: '获取数据失败!'
          });
        })
      },
      addSub2(){
        addSubject(this.form2).then(res => {
          if (res.success) {
            this.$message({
              type: 'success',
              message: '添加成功!'
            });
            this.dialogFormVisible = false
            this.getData()
          } else {
            this.$message({
              type: 'error',
              message: '添加失败!'
            });
          }
        }).catch(reason => {
          this.$message({
            type: 'error',
            message: '添加失败!'
          });
        })
      }

    }, created() {
      this.getData();
    }
  };
</script>

<style scoped>

</style>
