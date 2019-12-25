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
    <el-collapse style="margin-top: 5px;margin-bottom: 5px">
      <el-collapse-item
        v-for="chapter in chapterNestedList"
        :name="chapter.id"
        :key="chapter.id">
        <template slot="title">
          <p>
            {{ chapter.title }}
            <span class="acts">
                <el-button type="text" @click="addVideo(chapter.id)">添加课时</el-button>
                <el-button type="text" @click="showChapter(chapter.id)">编辑</el-button>
                <el-button type="text" @click="deleteChapterById(chapter.id)">删除</el-button>
            </span>
          </p>
        </template>
        <!-- 视频 -->
        <el-collapse accordion>
          <el-collapse-item
            style="margin-left: 30px"
            v-for="video in chapter.children"
            :name="video.id"
            :key="video.id">
            <template slot="title">
              <p>{{ video.title }}
                <span style="float: right" class="acts">
                        <el-button type="text" @click="getVideoInfoById(video.id)">编辑</el-button>
                        <el-button type="text" @click="deleteVideoById(video.id)">删除</el-button>
                      <el-button type="text" @click="viewVideoById(video.id)">预览视频</el-button>
              </span>
              </p>
            </template>
          </el-collapse-item>
        </el-collapse>
      </el-collapse-item>
    </el-collapse>
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
    <el-dialog :visible.sync="dialogVideoFormVisible" title="添加课时" :before-close="handleClose">
      <el-form :model="video" label-width="120px">
        <el-form-item label="课时标题">
          <el-input v-model="video.title"/>
        </el-form-item>
        <el-form-item label="课时排序">
          <el-input-number v-model="video.sort" :min="0" controls-position="right"/>
        </el-form-item>
        <el-form-item label="是否免费">
          <el-radio-group v-model="video.free">
            <el-radio :label=true>免费</el-radio>
            <el-radio :label=false>默认</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="上传视频">
          <el-upload
            accept=".mp4"
            :on-success="handleVodUploadSuccess"
            :on-exceed="handleUploadExceed"
            :on-remove="handleVodRemove"
            :before-upload="beforeUpload"
            :before-remove="beforeVodRemove"
            :file-list="this.fileList"
            :action="resourceService+videoUploadPath"
            :limit=1
            :data="{courseId:this.courseId}"
            class="upload-demo">
            <el-button size="small" type="primary">上传视频</el-button>
            <el-tooltip placement="right-end">
              <div slot="content">最大支持1G，<br>
                支持MP4格式
              </div>
              <i class="el-icon-question"/>
            </el-tooltip>
          </el-upload>
          <p v-html="this.uploadedFileName"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVideoFormVisible = false">取 消</el-button>
        <el-button :disabled="saveVideoBtnDisabled" type="primary" @click="saveOrUpdateVideoData">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog :visible.sync="previewVideoFormVisible" title="预览视频"
               :before-close="previewVideoBeforeClose" @opened="initVideo">
      <video id="myVideo" class="video-js"></video>
      <el-tag type="danger" v-if="noVideoInfo!==''">{{this.noVideoInfo}}</el-tag>
    </el-dialog>

  </div>
</template>

<script>


  import * as chapterApi from '../../api/chapter'
  import * as videoApi from '../../api/video'
  import {previewVideoUrl, resourceService, videoUrl} from "../../config";
  import * as resourceApi from '../../api/resource'
  // 定义默认的video对象
  const defaultVideo = {
    id: '',
    chapterId: '',
    courseId: '',
    title: '',
    sort: 0,
    free: false,
    videoSourceId: '',

  }
  let myPlayer;

  export default {
    data() {
      return {
        noVideoInfo: '',
        previewVideoFormVisible: false,// 设置预览视频的dialog为false
        previewVideoResourceUrl: '',// 文件预览的url
        uploadedFileName: '',// 如果已经上传文件
        resourceService: "",
        beforeVideoId: '',// 保存之前上传过的videoId
        videoUploadPath: "",
        disableUploadBtn: false,// 上传按钮
        fileList: [],// 文件列表
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
      this.previewVideoFormVisible = true
      this.previewVideoFormVisible = false
      this.resourceService = resourceService
      this.videoUploadPath = videoUrl
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
        this.$router.push({path: '/course/info/' + this.courseId})
      },
      next() {
        console.log('next')
        this.$router.push({path: '/course/publish/' + this.courseId})
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
        // 清除文件显示
        this.uploadedFileName = ""

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
            // 清空上传的信息
            this.fileList = []
            // 如果之前存在废旧的资源就删除
            // 如果之前存在资源就删除
            if (this.beforeVideoId !== '') {
              resourceApi.removeById(this.beforeVideoId).then(res => {
                console.log("delete success")
              })
            }
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
            // 获取上传的数据
            if (this.video.videoSourceId !== '') {
              resourceApi.getVideoNameById(this.video.videoSourceId).then(res => {
                this.uploadedFileName = "<el-tag>已经上传文件<span style='color: red'>" + res.data.name + "</span><br/>如需修改请重新上传</el-tag>"
              }).catch(res => {
                this.$message.error("获取文件失败")
                console.log(res)
              })
            } else {
              this.uploadedFileName = ""
            }
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
          // 先获取视频id信息 留作后期删除记录后删除数据
          let videoId = ''
          videoApi.getVideoById(id).then(res => {
            videoId = res.data.data.videoSourceId
            console.log("获取的videoId", videoId)
          }).catch(reason => {
            console.log(reason)
          })
          videoApi.deleteVideoById(id).then(res => {
            if (res.success) {
              if (videoId !== '') {
                resourceApi.removeById(videoId).then(res => {
                  this.uploadedFileName = ""
                  console.log(res)
                })
              }
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
      handleClose() {
        this.dialogVideoFormVisible = false
        this.fileList = []
      },
      // 上传之前
      beforeUpload() {
        // 判断之前的有没有已经上传过视频 如果上传过，就设置beforeVideoId 为之前的资源id 这样等新资源上传之后就删除之前上传的视频
        if (this.video.videoSourceId !== '') {
          this.beforeVideoId = this.video.videoSourceId;
          // 取消下面的提示
          this.uploadedFileName = ""
        }
      },


      //成功回调
      handleVodUploadSuccess(response, file, fileList) {
        console.log(response.data.id)
        // 设置新的id
        this.video.videoSourceId = response.data.id
        this.$message.success("上传成功")

      },
      handleUploadExceed(files, fileList) {
        this.$message.warning('想要重新上传视频，请先删除已上传的视频')
      },
      beforeVodRemove(file, fileList) {
        return this.$confirm(`确定移除 ${file.name}？`)
      },
      handleVodRemove(file, fileList) {
        console.log(file)
        resourceApi.removeById(this.video.videoSourceId).then(res => {
          console.log(res)
          this.$message.success("删除数据成功")
        })
      },

      /***
       * 预览视频
       * 通过传递的videoId，tong'guo通过查询获取到videoResourceId
       * 这样就获取到了视频播放的url
       * @param id id
       */
      viewVideoById(id) {
        videoApi.getVideoById(id).then(res => {
          if (res.success) {
            // 请求videoResourceId
            let videoResourceId = res.data.data["videoSourceId"]
            this.previewVideoResourceUrl = resourceService + previewVideoUrl + '/' + videoResourceId
            console.log(res.data)
            console.log("视频资源id", videoResourceId)
// 显示预览的dialog
            this.previewVideoFormVisible = true
            // 初始化视频播放器
          } else {
            this.$message.error("暂无视频")
          }
        }).catch(reason => {
          this.$message.error("暂无视频")
          console.log(reason)
        })
      },
      /**
       * 初始化视频播放器 如果存在视频id就初始化播放器
       * 否者就弹出没有视频资源请上传
       */
      initVideo() {
        console.log(this.previewVideoResourceUrl)
        if (this.previewVideoResourceUrl !==resourceService + previewVideoUrl+"/") {
          //初始化视频方法
          myPlayer = this.$video(myVideo, {
            //确定播放器是否具有用户可以与之交互的控件。没有控件，启动视频播放的唯一方法是使用autoplay属性或通过Player API。
            controls: true,
            //自动播放属性,muted:静音播放
            autoplay: false,
            //建议浏览器是否应在<video>加载元素后立即开始下载视频数据。
            preload: "auto",
            //设置视频播放器的显示宽度（以像素为单位）
            width: "800px",
            //设置视频播放器的显示高度（以像素为单位）
            height: "400px",
            sources: [{
              src: this.previewVideoResourceUrl,
              type: 'video/mp4'
            }],
          });
        } else {
          this.noVideoInfo = "暂无视频资源 请点击左边的编辑按钮上传"
        }
      },

      /**
       * 关闭视频预览的dialgo
       */
      previewVideoBeforeClose() {
        this.previewVideoFormVisible = false
        // myPlayer.dispose()
        this.$router.go(0)
      },
    }


  }
</script>



