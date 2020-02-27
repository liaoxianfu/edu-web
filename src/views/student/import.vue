<template>
  <div class="app-container">
    <el-form label-width="120px">
      <el-form-item label="信息描述">
        <el-popover
          placement="top-start"
          title="模板说明"
          width="200"
          trigger="hover"
          content="请按照模板给出的示例进行填写 并将每个表格转换成文本类型，转换示例：https://zhidao.baidu.com/question/1994149520624324427.html">
          <el-button slot="reference">模板解释</el-button>
        </el-popover>
        <el-tag>
          <i class="el-icon-download"/>
          <a :href=DEFAULT_SUBJECT_PATH>点击下载模版</a>
        </el-tag>

      </el-form-item>

      <el-form-item label="选择Excel">
        <el-upload
          ref="upload"
          :auto-upload="false"
          :on-success="fileUploadSuccess"
          :on-error="fileUploadError"
          :disabled="importBtnDisabled"
          :limit="1"
          :action="OSS_SERVICE+STUDENT_HOST"
          name="file"
          accept="application/vnd.ms-excel">
          <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
          <el-button
            :loading="loading"
            style="margin-left: 10px;"
            size="small"
            type="success"
            @click="submitUpload">{{ fileUploadBtnText }}
          </el-button>
        </el-upload>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  import {eduService, default_subject_path, student_host} from "../../config";

  export default {
    data() {
      return {
        OSS_SERVICE: eduService, // 接口API地址
        DEFAULT_SUBJECT_PATH: default_subject_path, // 阿里云OSS地址
        STUDENT_HOST: student_host,
        fileUploadBtnText: '上传到服务器', // 按钮文字
        importBtnDisabled: false, // 按钮是否禁用,
        loading: false

      }
    },
    methods: {
      submitUpload() {
        this.fileUploadBtnText = '正在上传'
        this.importBtnDisabled = true
        this.loading = true
        this.$refs.upload.submit()
      },

      fileUploadSuccess(response) {
        if (response.success === true) {
          this.fileUploadBtnText = '导入成功'
          this.loading = false
          this.$message({
            type: 'success',
            message: response.message
          })
        } else {
          this.fileUploadBtnText = '导入失败'
          this.loading = false
          const messages = response.data.messageList
          let msgString = '<ul>'
          messages.forEach(msg => {
            msgString += `<li>${msg}</li>`
          })
          msgString += '</ul>'
          this.$alert(msgString, response.message, {
            dangerouslyUseHTMLString: true
          })
        }
      },

      fileUploadError(response) {
        this.fileUploadBtnText = '导入失败'
        this.loading = false
        this.$message({
          type: 'error',
          message: '导入失败'
        })
      }
    },
  }
</script>

<style scoped>

</style>
