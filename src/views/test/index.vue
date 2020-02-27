<template>
  <div class="app-container">
    <el-upload
      class="upload-demo"
      action=""
      :http-request="addAttachment"
      :on-preview="handlePreview"
      :on-remove="handleRemove"
      :before-remove="beforeRemove"
      multiple
      :limit="1"
      :on-success="uploadSucess"
      :file-list="fileList">
      <el-button size="small" type="primary">点击上传</el-button>
    </el-upload>
    <el-progress :percentage="percentage" :color="customColor"></el-progress>
  </div>
</template>

<script>
  import TcVod from 'vod-js-sdk-v6';
  import * as testApi from "../../api/test";

  export default {
    data() {
      return {
        fileList: [],
        percentage: 0,
        customColor: '#409eff'
      }
    }, methods: {
      /*
            // 获取上传的签名 （官方）
            getSignature() {
              return axios.post(baseUrl + "/tencent/signature").then(function (response) {
                return response.data.data.signature;
              })
            },
       */
      // 获取上传签名 （个人实现）
      getSignature2() {
        return testApi.getSignature().then(res => {
          return res.data.signature
        })
      },

      uploadVideo(mediaFile, element) {
        // 初始化
        const tcVod = new TcVod({
          getSignature: this.getSignature2
        })

        const uploader = tcVod.upload({
          mediaFile: mediaFile, // 媒体文件（视频或音频或图片），类型为 File
        })
        uploader.on('media_progress', function (info) {
          element.percentage = info.percent * 100
        })

        uploader.done().then(function (doneResult) {
          element.$message.success("上传数据成功")
          // deal with doneResult
        }).catch(function (err) {
          console.log(err)
          // deal with error
        })
      },
      handleRemove(file, fileList) {
        console.log(file, fileList);
      },
      handlePreview(file) {
        console.log(file);
      },
      beforeRemove(file, fileList) {
        return this.$confirm(`确定移除 ${file.name}？`);
      },
      addAttachment(file) {
        console.log(file.file)
        this.uploadVideo(file.file, this)
      },
      uploadSucess(response, file, fileList) {
        console.log("上传成功")
      }
    }, mounted() {

    }
  }
</script>

<style scoped>

</style>
