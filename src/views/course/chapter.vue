<template>

  <div class="app-container">

    <h2 style="text-align: center;">发布新课程</h2>
    <el-steps :active="2" process-status="wait" align-center style="margin-bottom: 40px;">
      <el-step title="填写课程基本信息"/>
      <el-step title="创建课程大纲"/>
      <el-step title="提交审核"/>
    </el-steps>
    <el-button type="primary" @click="dialogChapterFormVisible = true">添加章节</el-button>
    <!-- 章节 -->
    <ul class="chanpterList">
      <li
        v-for="chapter in chapterNestedList"
        :key="chapter.id">
        <p>
          {{ chapter.title }}
          <span class="acts">
                <el-button type="text" @click="addVideo(chapter.id)">添加课时</el-button>
                <el-button type="text" @click="showChapter(chapter.id)">编辑</el-button>
                <el-button type="text" @click="deleteChapterById(chapter.id)">删除</el-button>
            </span>
        </p>

        <!-- 视频 -->
        <ul class="chanpterList videoList">
          <li
            v-for="video in chapter.children"
            :key="video.id">
            <p>{{ video.title }}
              <span class="acts">
                        <el-button type="text" @click="getVideoInfoById(video.id)">编辑</el-button>
                        <el-button type="text" @click="deleteVideoById(video.id)">删除</el-button>
              </span>
            </p>
          </li>
        </ul>
      </li>
    </ul>
    <el-form label-width="120px">
      <el-form-item>
        <!-- 跳转到info页面-->
        <el-button @click="previous">上一步</el-button>
        <!-- 跳转都publish页面-->
        <el-button :disabled="saveBtnDisabled" type="primary" @click="next">下一步</el-button>
      </el-form-item>
    </el-form>
    <!--弹窗 添加章节信息-->
    <el-dialog :visible.sync="dialogChapterFormVisible" :before-close="reloadPageInfo" title="添加章节">
      <el-form :model="chapter" label-width="120px">
        <el-form-item label="章节标题">
          <el-input v-model="chapter.title"/>
        </el-form-item>
        <el-form-item label="章节排序">
          <el-input-number v-model="chapter.sort" :min="0" controls-position="right"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="reloadPageInfo">取 消</el-button>
        <el-button type="primary" @click="saveChapter">确 定</el-button>
      </div>
    </el-dialog>


    <el-dialog :visible.sync="dialogChapterFormVisible2" title="修改章节">
      <el-form :model="chapterInfo" label-width="120px">
        <el-form-item label="章节标题">
          <el-input v-model="chapterInfo.title"/>
        </el-form-item>
        <el-form-item label="章节排序">
          <el-input-number v-model="chapterInfo.sort" :min="0" controls-position="right"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogChapterFormVisible2 = false">取 消</el-button>
        <el-button type="primary" @click="updateChapter">确 定</el-button>
      </div>
    </el-dialog>


    <!-- 添加和修改课时表单 -->
    <el-dialog :visible.sync="dialogVideoFormVisible" title="添加课时">
      <el-form :model="video" label-width="120px">
        <el-form-item label="课时标题">
          <el-input v-model="video.title"/>
        </el-form-item>
        <el-form-item label="课时排序">
          <el-input-number v-model="video.sort" :min="0" controls-position="right"/>
        </el-form-item>
        <el-form-item label="是否免费">
          <el-radio-group v-model="video.free">
            <el-radio :label=1>免费</el-radio>
            <el-radio :label=0>默认</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="上传视频">
          <!-- TODO -->
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVideoFormVisible = false">取 消</el-button>
        <el-button :disabled="saveVideoBtnDisabled" type="primary" @click="saveOrUpdateVideoData">确 定</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
  import * as chapterApi from '../../api/chapter'
  import * as videoApi from '../../api/video'
  import {deleteWithConfirm} from "../../utils/edu/deleteUtils";

  // 定义默认的video对象
  const defaultVideo = {
    id: '',
    chapterId: '',
    courseId: '',
    title: '',
    sort: 0,
    free: 0,
    videoSourceId: ''
  }

  export default {
    data() {
      return {
        courseId: '',// 从路由获取courseId
        saveBtnDisabled: false,// 保存按钮是否禁用
        chapterNestedList: [], // 章节嵌套视频列表
        dialogChapterFormVisible: false,// dialog是否可见
        dialogChapterFormVisible2: false,// dialog是否可见
        saveVideoBtnDisabled: false, // 课时按钮是否禁用
        dialogVideoFormVisible: false, // 是否显示课时表单
        chapterId: '', // 课时所在的章节id
        video: defaultVideo,
        chapter: {// 章节对象
          courseId: '',
          title: '',
          sort: 0
        },
        chapterInfo: {
          id: '',
          courseId: '',
          title: '',
          sort: 0
        }
      }
    },

    created() {
      console.log('chapter created')
      this.courseId = this.$route.params.id;
      console.log(this.courseId)
      // 传递courseId给chapter
      this.chapter.courseId = this.courseId;
      this.getChapterByCourseId()
    },

    methods: {
      previous() {
        // 返回上一层
        this.$router.push({path: '/course/info/' + this.courseInfo})
      },
      next() {
        console.log('next')
        this.$router.push({path: '/course/publish/1'})
      },
      getChapterByCourseId() {
        chapterApi.getChapterByCourse(this.courseId).then(res => {
          console.log(res)
          this.chapterNestedList = res.data.items;
        }).catch(reason => {
          this.$message({
            type: 'error',
            message: '获取数据失败!'
          })
          console.log(reason)
        })
      },
      saveChapter() {
        chapterApi.addChapter(this.chapter).then(res => {
          if (res.success) {
            this.$message.success("添加成功")
            // 清空页面数据
            this.chapter.title = ''
            this.chapter.sort = 0
          } else {
            this.$message.error("添加失败")
            console.log(res)
          }
        }).catch(reason => {
          this.$message.error("添加失败")
          console.log(reason)
        })
      },
      showChapter(id) {
        chapterApi.getChapterById(id).then(res => {
          console.log("获取到的id为", id)
          this.chapterInfo = res.data.data
          console.log("chapter info", this.chapter)
          this.dialogChapterFormVisible2 = true
        })
      },
      updateChapter() {
        console.log("修改数据")
        chapterApi.updateChapter(this.chapterInfo).then(res => {
          if (res.success) {
            // 关闭弹出框
            this.dialogChapterFormVisible2 = false
            // 提示修改成功
            this.$message.success("修改成功")
            // 重新加载页面
            this.getChapterByCourseId(this.chapterInfo.courseId)
          } else {
            console.log(res)
            this.$message.error("修改失败")
          }
        }).catch(reason => {
          console.log(reason)
          this.$message.error("修改失败")
        })
      },
      deleteChapterById(id) {
        this.$confirm('此操作将永久删除该记录以及其子记录, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          chapterApi.deleteChapter(id).then(res => {
            if (res.success) {
              this.$message.success("删除成功")
              //加载页面
              this.getChapterByCourseId()
            } else {
              this.$message.error("删除失败")
            }
          }).catch(reason => {
            this.$message.error("删除失败")
            console.log(reason)
          })

        }).catch(() => {
          this.$message.warning("取消删除数据")
        })
      },
      reloadPageInfo() {
        // 刷新数据
        this.getChapterByCourseId();
        // 关闭窗口
        this.dialogChapterFormVisible = false
      },
      // 添加课时
      addVideo(chapterId) {
        // 清空数据
        this.video = {...defaultVideo}
        console.log(chapterId)
        // 通过全局变量绑定直接给video对象绑定章节id
        this.chapterId = chapterId
        this.video.chapterId = chapterId
        this.video.courseId = this.courseId
        // 显示dialog
        this.dialogVideoFormVisible = true

      },
      // 保存数据

      saveOrUpdateVideoData() {
        console.log("data")
        videoApi.saveOrUpdateVideo(this.video).then(res => {
          console.log("发送数据为", this.video)
          if (res.success) {
            this.$message.success('添加或者修改成功')
            // 更新数据
            this.getChapterByCourseId()
            // 关闭页面
            this.dialogVideoFormVisible = false
          } else {
            console.log(reason)
            this.$message.error('添加或者更新失败')
          }
        }).catch(reason => {
          console.log(reason)
          this.$message.error('添加或者更新失败')
        })
      },
      getVideoInfoById(id) {
        console.log("获取的video id", id)
        videoApi.getVideoById(id).then(res => {
          if (res.success) {
            this.video = res.data.data
            this.dialogVideoFormVisible = true
          } else {
            his.$message.error('获取数据失败')
            console.log(res)
          }
        }).catch(res => {
          this.$message.error('获取数据失败')
          console.log(res)
        })
      },

      deleteVideoById(id) {
        this.$confirm('此操作将永久删除该记录以及其子记录, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          videoApi.deleteVideoById(id).then(res => {
            if (res.success) {
              this.$message.success("删除成功")
              //加载页面
              this.getChapterByCourseId()
            } else {
              this.$message.error("删除失败")
            }
          }).catch(reason => {
            this.$message.error("删除失败")
            console.log(reason)
          })

        }).catch(() => {
          this.$message.warning("取消删除数据")
        })
      }
    }
  }
</script>



