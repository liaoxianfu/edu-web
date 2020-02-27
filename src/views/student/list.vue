<template>
  <div class="app-container">
    <el-form :inline="true" :model="studentQuery" class="demo-form-inline" ref="studentQuery">
      <el-form-item label="学生姓名" prop="studentName">
        <el-input v-model="studentQuery.studentName" placeholder="学生姓名模糊查询"/>
      </el-form-item>
      <el-form-item label="学号" prop="studentId">
        <el-input v-model="studentQuery.studentId" placeholder="学号精确查询"/>
      </el-form-item>
      <el-form-item label="日期" prop="startAndEndTime">
        <el-date-picker
          value-format="yyyy-MM-dd HH:mm:ss"
          v-model="studentQuery.startAndEndTime"
          type="datetimerange"
          :picker-options="pickerOptions"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          align="right">
        </el-date-picker>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="onSubmit" icon="el-icon-search">查询</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="danger" @click="clearData('studentQuery')" icon="el-icon-delete">清空</el-button>
      </el-form-item>
    </el-form>

    <!--    列表-->
    <el-table
      :data="studentList"
      border
      style="width: 100%">
      <el-table-column
        prop="id"
        label="id"
        width="200">
      </el-table-column>

      <el-table-column
        prop="studentName"
        label="学生姓名"
        width="200">
      </el-table-column>

      <el-table-column
        prop="studentId"
        label="学生ID"
        width="200"
      >
      </el-table-column>
      <el-table-column
        prop="studentGender"
        label="性别"
        width="120"
        :formatter="genderFormatter"
      >
      </el-table-column>

      <el-table-column
        prop="gmtCreate"
        label="创建日期"
        width="250">
      </el-table-column>


      <el-table-column
        label="操作"
        width="300">
        <template slot-scope="page">
          <el-button type="danger" @click="deleteById(page.row.id)" icon="el-icon-delete">删除</el-button>
          <el-button type="primary" @click="updateById(page.row.id)" icon="el-icon-edit">修改</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div style="margin-top: 15px;margin-right: 30px">
      <el-pagination
        align="center"
        background
        @current-change="handleCurrentChange"
        :current-page.sync="pageInfo.currentPage"
        :page-size="pageInfo.pageSize"
        layout=" prev, pager, next , total"
        :total="pageInfo.total"
      >
      </el-pagination>
    </div>

  </div>
</template>

<script>
  import * as studentApi from "../../api/student";

  export default {
    name: "list",
    data() {
      return {

        // page信息
        pageInfo: {
          currentPage: 1,
          total: 0,
          pageSize: 10,
        },
        // 查询信息
        studentQuery: {
          startAndEndTime: '',
          studentName: '',
          studentId: '',
          startTime: null,
          endTime: null
        },
        // 查询结果
        studentList: [],
        // 日期选择
        pickerOptions: {
          shortcuts: [{
            text: '最近一周',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近三个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit('pick', [start, end]);
            }
          }]
        },
      }
    },
    methods: {
      onSubmit() {
        let arr = this.studentQuery.startAndEndTime;
        if (arr.length === 2) {
          this.studentQuery.startTime = arr[0];
          this.studentQuery.endTime = arr[1];
        }
        this.getStudentList();
      },
      clearData(formName) {
        this.$refs[formName].resetFields();
        this.getStudentList();
      },
      genderFormatter(row, column) {
        switch (row.studentGender) {
          case 0: {
            return "男"
          }
          case 1:
            return "女"
          default:
            return "未知"
        }
      },
      getStudentList() {
        studentApi.studentPageList(this.pageInfo.currentPage, this.pageInfo.pageSize, this.studentQuery).then(res => {
          this.studentList = res.data.studentList;
          this.pageInfo.total = res.data.total;
          console.log(res.data)
        })
      },
      handleCurrentChange(val) {
        this.pageInfo.currentPage = val;
        this.getStudentList();
      },
      deleteById(id) {

        this.$confirm('此操作将永久删除该条信息, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          studentApi.deleteStudentById(id).then(res => {
            if (res.data.status === 'success') {
              this.$message({
                type: 'success',
                message: '删除成功'
              })
              // 重新加载数据
              this.getStudentList();
            } else {
              this.$message({
                type: 'error',
                message: '删除失败'
              })
            }
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
      },
      updateById(id) {
        this.$router.push(
          {
            path: '/student/edit/' + id
          }
        )
      }

    }, created() {

    }, mounted() {
      this.getStudentList()
    }
  }


</script>

<style scoped>

</style>
