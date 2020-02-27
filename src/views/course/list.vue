<template>
  <div class="app-container">


    <el-form :inline="true" :model="queryData" class="demo-form-inline">

      <el-form-item label="课程名称">
        <el-input v-model="queryData.courseName" placeholder="课程名称模糊查询"/>
      </el-form-item>

      <el-form-item label="教师名称">
        <el-input v-model="queryData.teacherName" placeholder="教师名称模糊查询"/>
      </el-form-item>



      <el-form-item label="开始时间">
        <el-date-picker
          v-model="queryData.startTime"
          type="datetime"
          placeholder="选择日期时间"
          align="right"
          value-format="yyyy:MM:dd HH:mm:ss"
          :picker-options="pickerOptions">
        </el-date-picker>
      </el-form-item>

      <el-form-item label="结束时间">
        <el-date-picker
          v-model="queryData.endTime"
          type="datetime"
          placeholder="选择日期时间"
          align="right"
          value-format="yyyy:MM:dd HH:mm:ss"
          :picker-options="pickerOptions">
        </el-date-picker>

        <el-form-item>
          <el-button type="primary" @click="onSubmit" icon="el-icon-search">查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="danger" @click="clearData" icon="el-icon-delete">清空</el-button>
        </el-form-item>
        <router-link :to="{path:'/course/info'}">
          &nbsp;&nbsp;
          <el-button type="primary">新建课程</el-button>
        </router-link>
      </el-form-item>
    </el-form>


    <el-table
      :data="courseInfoList"
      stripe
      style="width: 100%">
      <el-table-column
        prop="id"
        label="id"
        width="180">
      </el-table-column>
      <el-table-column
        prop="title"
        label="课程名称"
        width="250">
      </el-table-column>
      <el-table-column
        prop="teacher_id"
        label="授课教师"
        width="150"
        :formatter="teacherFormatter"
      >
      </el-table-column>

      <el-table-column
        prop="price"
        label="价格"
        width="80">
      </el-table-column>
      <el-table-column
        prop="lesson_num"
        label="课程节数"
        width="80">
      </el-table-column>
      <el-table-column
        prop="buy_count"
        label="购买数量"
        width="80">
      </el-table-column>
      <el-table-column
        prop="view_count"
        label="查看数量"
        width="80">
      </el-table-column>
      <el-table-column
        prop="version"
        label="版本"
        width="80">
      </el-table-column>
      <el-table-column
        prop="status"
        label="状态"
        width="100">
      </el-table-column>
      <el-table-column
        label="操作"
        width="230">
        <template slot-scope="page">
          <el-button type="danger" @click="deleteById(page.row.id)" icon="el-icon-delete">删除</el-button>
          <el-button type="primary" @click="editById(page.row.id)" icon="el-icon-edit">修改</el-button>
        </template>
      </el-table-column>
    </el-table>

    <div class="pageInfo">
      <el-pagination
        align="right"
        background
        @current-change="handleCurrentChange"
        :current-page.sync="pageInfo.current"
        :page-size="pageInfo.size"
        layout=" prev, pager, next , total"
        :total="pageInfo.total"
      >
      </el-pagination>
    </div>
  </div>
</template>

<script>
  import * as courseApi from "../../api/course";
import * as teacherApi from "../../api/teacher"
  export default {
    data() {
      return {
        teacherMap:{},
        courseInfoList: [],
        queryData: {
          courseName: '',
          teacherName:'',
          startTime: '',
          endTime: '',
        },
        pageInfo: {
          current: 1,
          size: 13,
          total: 0,
        },
        pickerOptions: {
          shortcuts: [{
            text: '今天',
            onClick(picker) {
              picker.$emit('pick', new Date());
            }
          }, {
            text: '昨天',
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24);
              picker.$emit('pick', date);
            }
          }, {
            text: '一周前',
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', date);
            }
          }]
        },
      }
    }, methods: {
      getData() {
        courseApi.getAllCourseInfo(this.pageInfo.current, this.pageInfo.size, this.queryData).then(res => {
          // console.log(res.data.data.items[0])
          this.courseInfoList = res.data.data.items;
          this.pageInfo.total = res.data.data.total
        }).catch(reason => this.$message({
          type: 'error',
          message: "获取数据出错！"
        }))
      },

      getTeacherMap(){
        teacherApi.getAllTeacherMap().then(res=>{
          console.log(res.data.data)
          this.teacherMap = res.data.data
        }).catch(reason => {
          this.$message.error("获取数据失败")
        })
      },
      handleCurrentChange(val) {
        this.pageInfo.currentPage = val
        this.getData()
      },
      onSubmit() {
        this.getData()
      }, clearData() {
        this.queryData.courseName = ''
        this.queryData.teacherName = ''
        this.queryData.startTime = ''
        this.queryData.endTime = ''
        this.getData()
      }, deleteById(id) {
        this.$confirm('此操作将永久删除该条信息, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          courseApi.deleteCourseById(id).then(res => {
            if (res.success) {
              this.$message({
                type: 'success',
                message: "删除成功！"
              })
              this.getData()
            } else {
              this.$message({
                type: 'error',
                message: "删除数据出错！"
              })
            }
          }).catch(reason => {
            this.$message({
              type: 'error',
              message: "删除数据出错！"
            })
          })
        }).catch(() => this.$message({
          type: 'info',
          message: '已取消删除'
        }))
      }, editById(id) {
        this.$router.push({path: '/course/info/' + id})
      },
      teacherFormatter(row,column){
        // console.log(row.teacher_id)
        return this.teacherMap[row.teacher_id]
      }
    }, created() {
      this.getData()
      this.getTeacherMap()
    }
  }
</script>

<style scoped>

</style>
