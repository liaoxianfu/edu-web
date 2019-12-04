<template>
  <div style="margin: 15px">
    <el-form :inline="true" :model="formQuery" class="demo-form-inline">
      <el-form-item label="教师姓名">
        <el-input v-model="formQuery.teacherName" placeholder="教师姓名模糊查询"/>
      </el-form-item>

      <el-form-item label="教师等级">
        <el-select v-model="formQuery.level" clearable placeholder="请选择">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="开始时间">
        <el-date-picker
          v-model="formQuery.startTime"
          type="datetime"
          placeholder="选择日期时间"
          align="right"
          value-format="yyyy:MM:dd HH:mm:ss"
          :picker-options="pickerOptions">
        </el-date-picker>
      </el-form-item>

      <el-form-item label="结束时间">
        <el-date-picker
          v-model="formQuery.endTime"
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
        <router-link :to="{path:'/teacher-manger/teacher-add',query:{
          currentPage:this.pageInfo.currentPage,
          pageSize:this.pageInfo.pageSize
        }}">
          &nbsp;&nbsp;
          <el-button type="primary">添加教师</el-button>
        </router-link>
      </el-form-item>
    </el-form>


    <!--    列表-->
    <el-table
      :data="teacherList"
      border
      style="width: 100%">
      <el-table-column
        prop="id"
        label="id"
        width="200">
      </el-table-column>

      <el-table-column
        prop="name"
        label="教师姓名"
        width="200">
      </el-table-column>

      <el-table-column
        prop="level"
        label="教师级别"
        width="120"
      :formatter="levelFormatter"
      >
      </el-table-column>
      <el-table-column
        prop="gmt_create"
        label="创建日期"
        width="300">
      </el-table-column>
      <el-table-column
        prop="gmt_modified"
        label="修改时间"
        width="300">
      </el-table-column>
      <el-table-column
        prop="intro"
        label="教师资历"
        width="300">
      </el-table-column>

      <el-table-column
        label="操作"
        width="250">
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
  import {teacherPageList, deleteTeacherById} from "../../../api/teacher";

  export default {
    data() {
      return {
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
        teacherList: [],
        pageInfo: {
          currentPage: 1,
          total: 0,
          pageSize: 10,
        },
        formQuery: {
          teacherName: "",
          level: "",
          startTime: "",
          endTime: ""
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
    },
    methods: {
      handleCurrentChange(val) {
        this.pageInfo.currentPage = val;
        this.getPageList()
      },
      "getPageList": function () {
        teacherPageList(this.pageInfo.currentPage, this.pageInfo.pageSize, this.formQuery).then(res => {
          this.teacherList = res.data.data;
          // console.log(res.data.data.data.length);
          this.pageInfo.total = res.data.total
        })

      },
      "onSubmit": function () {
        // 点击搜索 将当前页码置为1
        this.pageInfo.currentPage = 1;
        this.getPageList()
      },

      "clearData":function () {
          this.formQuery={
            teacherName: "",
            level: "",
            startTime: "",
            endTime: ""
          }
          this.getPageList()

      },

      "deleteById": function (id) {
        this.$confirm('此操作将永久删除该条信息, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deleteTeacherById(id).then(res => {
            // console.log(res.data.success);
            if (res.data.success) {
              this.$message({
                type: 'success',
                message: '删除成功!'
              });

            } else {
              this.$message({
                type: 'error',
                message: '删除失败!'
              });
            }
          });
          this.getPageList()
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      },



      "editById": function (id) {
        this.$router.push(
          {
            path: '/teacher-manger/teacher-edit/' + id, query: {
              currentPage: this.pageInfo.currentPage,
              pageSize: this.pageInfo.pageSize
            }
          }
        )
      },

      "levelFormatter":function (row,column) {
          switch (row.level) {
            case 1:
            {
              return "普通教师"
            }
            case 2:
              return "高级教师"
            case 3:
              return "特级教师"
            default:
              return "未知级别"
          }

      }


    }, mounted() {
      this.getPageList()
    }, created() {
      // 页面数据回传
      this.pageInfo.currentPage = Number.parseInt(this.$route.query.currentPage || 1);
      this.pageInfo.pageSize = Number.parseInt(this.$route.pageSize || 10); // 取到数据 如果得不到 默认是10
    },
  }
</script>
