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
        <el-button type="primary" @click="onSubmit">更新信息</el-button>
        <el-button @click="goBack()">返回</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  import {getTeacherById, updateTeacherById} from "../../../api/teacher";

  export default {
    data() {
      return {
        teacher: {
          avatar: "",
          career: "",
          intro: "",
          level: 0,
          name: "",
          sort: 0
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
    }, methods: {
      "onSubmit": function () {
        const id = this.$route.params.id;
        updateTeacherById(id, this.teacher).then(res => {
          console.log("post上传结果", res.success)
          if (res.success) {
            this.$message({
              type: 'success',
              message: '修改成功!'
            });
          } else {
            this.$message({
              type: 'error',
              message: '修改失败!'
            });
          }
        })
      },
      "goBack": function () {
        this.$router.push({
          path: "/teacher-manger/teacher-list", query: {
            currentPage: this.$route.query.currentPage,
            pageSize: this.$route.query.pageSize
          }
        })
      },

    }, created() {
      const id = this.$route.params.id;
      getTeacherById(id).then(res => {
        console.log(res.data.success);
        if (res.success) {
          this.teacher = res.data.data;
        }
      })
    }
  }

</script>

<style scoped>

</style>
