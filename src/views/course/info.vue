<template>

  <div class="app-container">
    <!--步骤条-->
    <h2 style="text-align: center;">发布新课程</h2>
    <el-steps :active="1" process-status="wait" align-center style="margin-bottom: 40px;">
      <el-step title="填写课程基本信息"/>
      <el-step title="创建课程大纲"/>
      <el-step title="提交审核"/>
    </el-steps>
    <el-form label-width="120px">
      <el-form-item label="课程标题">
        <el-input size="medium" v-model="courseInfo.title" placeholder=" 示例：机器学习项目课：从基础到搭建项目视频课程。专业名称注意大小写"/>
      </el-form-item>

      <el-form-item label="课程类别">
        <el-select
          v-model="courseInfo.subjectParentId"
          placeholder="请选择" @change="firstLevelChange">
          <el-option
            v-for="subject in subjectNestedList"
            :key="subject.id"
            :label="subject.title"
            :value="subject.id"/>
        </el-select>


        <el-select
          v-model="courseInfo.subjectId"
          placeholder="请选择">
          <el-option
            v-for="subject in subSubjectList"
            :key="subject.id"
            :label="subject.title"
            :value="subject.id"/>
        </el-select>


      </el-form-item>

      <el-form-item label="授课教师">

        <el-select
          v-model="courseInfo.teacherId"
          placeholder="请选择">
          <el-option
            v-for="teacher in teacherList"
            :key="teacher.id"
            :label="teacher.name"
            :value="teacher.id"/>
        </el-select>

      </el-form-item>


      <el-form-item label="总课时">
        <el-input-number :min="0" v-model="courseInfo.lessonNum" controls-position="right" placeholder="请填写课程的总课时数"/>
      </el-form-item>

      <el-form-item label="课程价格">
        <el-input-number :min="0" v-model="courseInfo.price" controls-position="right" placeholder="免费课程请设置为0元"/>
        元
      </el-form-item>

      <!-- 课程封面 TODO -->
      <el-form-item label="课程封面">
        <el-upload
          class="avatar-uploader"
          :action=IMAGE_URL
          :show-file-list="false"
          :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload">
          <img v-if="courseInfo.cover" :src="courseInfo.cover"  alt="图像上传">
          <i v-else class="el-icon-plus avatar-uploader-icon"/>
        </el-upload>
      </el-form-item>


      <!-- 课程简介 -->
      <el-form-item label="课程描述">
        <div id="wangeditor">
          <div ref="editorElem" style="text-align:left;"></div>
        </div>
      </el-form-item>

      <el-form-item>
        <el-button :disabled="saveBtnDisabled" type="primary" @click="next">保存并下一步</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>

  import {saveCourseInfo, getCourseInfoById, updateCourseInfoById} from "../../api/course";
  import {getFirstLevelSubList, getSecondLevelSubList, getFirstLevelSubject} from "../../api/subject";
  import {getAllTeacher} from "../../api/teacher";
  import {ossService, course_host, default_course_cover,} from "../../config";
  import {uploadImage} from "../../api/oss";

  import E from "wangeditor";

  const defaultForm = {
    title: '',
    subjectId: '',
    teacherId: '',
    lessonNum: 0,
    description: '',
    subjectParentId: '',
    cover: default_course_cover,
    price: 0
  }


  export default {


    data() {
      return {
        IMAGE_URL: ossService + course_host,
        editor: null,
        subjectNestedList: [],//一级分类列表
        subSubjectList: [],//二级分类列表
        teacherList: [],// 获取所有的教师列表
        saveBtnDisabled: false, // 保存按钮是否禁用
        courseInfo: defaultForm,
        subjectOptions: [],
        value: [],
      }
    },
    watch: {
      $route(to, from) {
        console.log('watch $route')
        this.init()
      }
    },

    created() {
      console.log('info created')
      this.init()
    },

    methods: {
      // 初始化
      init() {
        // 获取课程分类数据
        this.getSubjectOptions();
        // 获取教师列表
        this.getTeacherList();
        // 判断是创建还是修改
        if (this.$route.params && this.$route.params.id) {
          // 修改 获取到了路由的id参数 数据回显
          const id = this.$route.params.id
          console.log("数据会显", id)
          this.getData(id)
        } else {
          // 创建 初始化 清空所有参数
          this.courseInfo = {...defaultForm}
        }
      },
      next() {
        console.log('next')
        this.saveBtnDisabled = true
        if (!this.courseInfo.id) {
          this.saveData()
        } else {
          this.updateData()
        }
      },
      // 保存
      saveData() {
        // 保存数据信息
        saveCourseInfo(this.courseInfo).then(response => {
          this.$message({
            type: 'success',
            message: '保存成功!'
          })
          return response// 将响应结果传递给then
        }).then(response => {
          // 传递数据下一页
          this.$router.push({path: '/course/chapter/' + response.data.courseId})
        }).catch((response) => {
          this.$message({
            type: 'error',
            message: response.message
          })
        })
      },

      // 更新数据
      updateData() {
        updateCourseInfoById(this.courseInfo).then(res => {
          this.$message({
            type: 'success',
            message: '修改成功!'
          })
          return res
        }).then(res => {
          // 传递数据下一页
          this.$router.push({path: '/course/chapter/' + res.data.courseId})
        }).catch(reason => {
          this.$message({
            type: 'error',
            message: reason
          })
        })
      },

      getSubjectOptions() {
        getFirstLevelSubList().then(res => {
          if (res.data)
            this.subjectNestedList = res.data.items;
          else {
            console.log(res)
          }
        }).catch(reason => console.log(reason))
      },
      // 一级选择完成之后 根据一级的id获取二级的数据
      firstLevelChange(firstLevelId) {
        this.courseInfo.subjectId = null
        getSecondLevelSubList(firstLevelId).then(res => {
          this.subSubjectList = res.data.items;
        })
      },
      // 获取所有的教师信息
      getTeacherList() {
        getAllTeacher().then(res => {
          if (res.success) {
            this.teacherList = res.data.items;
          } else {
            console.log(res)
          }
        }).catch(reason => console.log(reason))
      },
      // 图片处理
      handleAvatarSuccess(res, file) {
        this.courseInfo.cover = res.data.url;
        console.log(this.courseInfo.cover)
      },
      beforeAvatarUpload(file) {
        const isJPG = file.type === 'image/jpeg';
        const isLt2M = file.size / 1024 / 1024 < 10;

        if (!isJPG) {
          this.$message.error('上传头像图片只能是 JPG 格式!');
        }
        if (!isLt2M) {
          this.$message.error('上传头像图片大小不能超过 10MB!');
        }
        return isJPG && isLt2M;
      },
      // 数据回显
      getData(id) {
        getCourseInfoById(id).then(res => {
          console.log("回显的数据为==》", res.data.data)
          this.courseInfo = res.data.data
          this.editor.txt.html(this.courseInfo.description) // 将描述信息插入到富文本框中
          // 回显一级Subject
          this.getFirstLevelSubById(this.courseInfo.subjectId) // 将二级的SubjectId传递给函数 获取一级的id
          this.getSubjectOptions() // 获取一级的数据列表
        }).catch(reason => console.log(reason))
      },
      // 获取回显一级标题的信息
      getFirstLevelSubById(id) {
        getFirstLevelSubject(id).then(res => {
          const firstLevelSubId = res.data.data['id'];
          this.courseInfo.subjectParentId = firstLevelSubId
          // 通过获取到一级主题的id 再次查询对应的二级主题列表
          this.firstLevelChange(firstLevelSubId)
          this.courseInfo.subjectId = id // 初始化后数据就清空了，所以要再次赋值
        }).catch(reason => console.log(reason))
      },
    }, mounted() {
      this.editor = new E(this.$refs.editorElem);
      // 编辑器的事件，每次改变会获取其html内容
      this.editor.customConfig.onchange = html => {
        // 将数据绑定到courseInfo对象中
        this.courseInfo.description = html

      };
      this.editor.customConfig.customUploadImg = function (files, insert) {
        console.log("上传的文件", files.length)
        for (let i = 0; i < files.length; i++) {
          uploadImage(files[i]).then(res => {
            console.log(res.data)
            if (res.data.success) {
              console.log(res.data.data.url)
              insert(res.data.data.url)
            }
          }).catch(reason => console.log(reason))
        }
      }
      this.editor.customConfig.menus = [
        // 菜单配置
        'head', // 标题
        'bold', // 粗体
        'fontSize', // 字号
        'fontName', // 字体
        'italic', // 斜体
        'underline', // 下划线
        'strikeThrough', // 删除线
        'foreColor', // 文字颜色
        'backColor', // 背景颜色
        'link', // 插入链接
        'list', // 列表
        'justify', // 对齐方式
        'quote', // 引用
        'emoticon', // 表情
        'image', // 插入图片
        'table', // 表格
        'code', // 插入代码
        'undo', // 撤销
        'redo' // 重复
      ];
      this.editor.create(); // 创建富文本实例
    }
  }
</script>


<style scoped>
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }

  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }

  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }

  .avatar {
    width: 240px;
    height: 320px;
    display: block;
  }
</style>
