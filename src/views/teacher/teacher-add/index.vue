<template>
  <div style="width: 800px;margin: 10px">
    <el-form ref="form" :model="teacher" label-width="80px">
      <el-form-item label="教师姓名">
        <el-input v-model="teacher.name"/>
      </el-form-item>
      <el-form-item label="教师资历">
        <el-input v-model="teacher.intro" placeholder="用一句话介绍自己"/>
      </el-form-item>
      <el-form-item label="教师级别">
        <el-select v-model="teacher.level" clearable placeholder="请选择">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="教师排序">
        <el-input-number v-model="teacher.sort" placeholder=""/>
      </el-form-item>
      <el-form-item label="教师简介">
        <el-input type="textarea" v-model="teacher.career" placeholder="简历填写"/>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">立即创建</el-button>
        <el-button @click="goBack()">返回</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  import {postTeacher} from "../../../api/teacher";

  export default {
    data() {
      return {
        teacher: {
          avatar: "",
          career: "",
          intro: "",
          level: null,
          name: "",
          sort: 0,
        },
        options: [{
          value: 1,
          label: '普通教师'
        }, {
          value: 2,
          label: '高级教师'
        }, {
          value: 3,
          label: '特级教师'
        }],

    }
  }
  ,
  methods: {
    "onSubmit"
  :

    function () {
      postTeacher(this.teacher).then(res => {
        console.log("post上传结果", res.success)
        if (res.success) {
          this.$message({
            type: 'success',
            message: '添加成功!'
          });
        } else {
          this.$message({
            type: 'error',
            message: '添加成功!'
          });
        }
      })
    }

  ,
    "goBack"
  :

    function () {
      this.$router.push({
        path: "/teacher-manger/teacher-list", query: {
          currentPage: this.$route.query.currentPage,
          pageSize: this.$route.query.pageSize
        }
      })
    }
  }
  }

</script>

<style scoped>

</style>
