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

      <el-form-item label="讲师头像">

        <!-- 头衔缩略图 -->
        <pan-thumb :image="teacher.avatar"/>
        <!-- 文件上传按钮 -->
        <el-button type="primary" icon="el-icon-upload" @click="imagecropperShow=true">更换头像
        </el-button>

        <!--
            v-show：是否显示上传组件
            :key：类似于id，如果一个页面多个图片上传控件，可以做区分
            :url：后台上传的url地址
            @close：关闭上传组件
            @crop-upload-success：上传成功后的回调
          -->
        <image-cropper
          v-show="imagecropperShow"
          :width="300"
          :height="300"
          :key="imagecropperKey"
          :url="OSS_SERVICE+'/admin/oss/file/upload/avatar'"
          field="file"
          @close="close"
          @crop-upload-success="cropSuccess"/>

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
  import {ossService, default_oss_path} from "../../../config";
  import ImageCropper from '@/components/ImageCropper'
  import PanThumb from '@/components/PanThumb'

  export default {
    components: {ImageCropper, PanThumb},
    data() {
      return {
        imagecropperShow: false, // 是否显示上传组件
        imagecropperKey: 0,// 上传组件id
        OSS_SERVICE: ossService,
        teacher: {
          avatar: default_oss_path,
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
        let teacherData ={...this.teacher}
        teacherData.gmtCreate=null
        teacherData.gmtModified= null
        updateTeacherById(id, teacherData).then(res => {
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
      "cropSuccess": function (data) {
        // console.log(data)
        this.imagecropperShow = false
        this.teacher.avatar = data.url
        // 上传成功后，重新打开上传组件时初始化组件，否则显示上一次的上传结果
        this.imagecropperKey = this.imagecropperKey + 1
        this.onSubmit()
      },
      // 关闭上传组件
      "close": function () {
        this.imagecropperShow = false
        // 上传失败后，重新打开上传组件时初始化组件，否则显示上一次的上传结果
        this.imagecropperKey = this.imagecropperKey + 1
      },

    }, created() {
      const id = this.$route.params.id;
      getTeacherById(id).then(res => {
        // console.log(res.data)
        // console.log(res.success);
        if (res.success) {
          if (res.data.data.avatar === "") {
            res.data.data.avatar = default_oss_path;
          }
          this.teacher = res.data.data;
        }
      })
    }
  }

</script>

<style scoped>

</style>
