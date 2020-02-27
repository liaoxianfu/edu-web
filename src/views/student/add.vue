<template>
  <div class="app-container" style="width: 500px">
    <el-form ref="student" :model="student" label-width="80px">
      <el-form-item label="昵称" prop="studentName">
        <el-input v-model="student.studentName"/>
      </el-form-item>
      <el-form-item label="学号" prop="studentId">
        <el-input v-model="student.studentId" placeholder="学号"/>
      </el-form-item>
      <el-form-item label="性别">
        <el-select v-model="student.studentGender" clearable placeholder="请选择">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input type="password" v-model="student.password" placeholder="用户密码"/>
      </el-form-item>

      <el-form-item label="头像">

        <!-- 头衔缩略图 -->
        <pan-thumb :image="student.studentAvatar"/>
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
          @close="closeUpload"
          @crop-upload-success="cropSuccess"/>

      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="onSubmit">立即创建</el-button>
        <el-button @click="goBack()">返回</el-button>
      </el-form-item>

    </el-form>
  </div>
</template>

<script>
  import {ossService, default_oss_path} from "../../config";
  import ImageCropper from '@/components/ImageCropper'
  import PanThumb from '@/components/PanThumb'
  import {addStudent} from "../../api/student";

  export default {
    name: "add",
    components: {ImageCropper, PanThumb},
    data() {
      return {
        imagecropperShow: false, // 是否显示上传组件
        imagecropperKey: 0,// 上传组件id
        OSS_SERVICE: ossService,
        student: {
          studentId: '',
          studentName: '',
          studentAvatar: default_oss_path,
          studentGender: '',
          password: ''
        },
        options: [
          {value: 0, label: '男'},
          {value: 1, label: '女'},
          {value: 2, label: '保密'}
        ]
      }

    }, methods: {
      closeUpload() {
        this.imagecropperShow = false
        // 上传失败后，重新打开上传组件时初始化组件，否则显示上一次的上传结果
        this.imagecropperKey = this.imagecropperKey + 1
      }, cropSuccess(data) {
        console.log(data)
        this.imagecropperShow = false
        this.student.studentAvatar = data.url
        // 上传成功后，重新打开上传组件时初始化组件，否则显示上一次的上传结果
        this.imagecropperKey = this.imagecropperKey + 1
      }, onSubmit() {
        addStudent(this.student).then(res => {
          if (res.data.status === 'success') {
            this.$message.success("添加成功");
            this.goBack();
          } else {
            this.$message.error("添加失败")
          }
        })
      }, goBack() {
        this.$router.push({
          path: "/student/list"
        })
      }
    }, mounted() {

    }
  }
</script>

<style scoped>

</style>
