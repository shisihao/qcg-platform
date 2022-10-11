<template>
  <el-dialog :title="form.id ? $t('table.edit') : $t('table.add')" width="600px" :visible.sync="visible" @closed="onClose()">
    <el-form ref="form" :model="form" :rules="rules" label-width="140px">
      <el-form-item label="名称" prop="name">
        <el-input
          v-model="form.name"
          placeholder="名称"
          clearable
        />
      </el-form-item>
      <el-form-item label="字母索引" prop="index">
        <el-input v-model="form.index" clearable placeholder="藏友之家排序使用，填写英文字母缩写" oninput="value=value.replace(/[^A-Z]/,'')" />
      </el-form-item>
      <el-form-item label="logo" prop="logo">
        <custom-upload
          class-name="avatar-uploader"
          @handleBeforeUpload="beforeAvatarUpload"
          @handleSuccess="handleAvatarSuccess"
        >
          <img v-if="form.logo" :src="domin + form.logo" class="avatar">
          <i v-else class="el-icon-plus avatar-uploader-icon" />
        </custom-upload>
        <div class="notice">
          建议尺寸xxx
        </div>
      </el-form-item>
      <el-form-item label="链接" prop="url">
        <el-input v-model="form.url" placeholder="请输入链接地址" />
      </el-form-item>
      <el-form-item label="平台简介" prop="intro">
        <el-input v-model="form.intro" placeholder="请输入平台简介" type="textarea" :rows="4" />
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" :loading="btnLoading" @click="onFormSubmit()">
        {{ $t('table.confirm') }}
      </el-button>
      <el-button @click="visible = false">
        {{ $t('table.cancel') }}
      </el-button>
    </div>
  </el-dialog>
</template>

<script>
import { addOrUpdate } from '@/api/home'
import CustomUpload from '@/components/Upload/CustomUpload'
import { DominKey, getToken } from '@/utils/auth'

export default {
  name: 'AddOrUpdate',
  components: { CustomUpload },
  data() {
    return {
      domin: getToken(DominKey),
      visible: false,
      btnLoading: false,

      form: {
        id: 0,
        name: '',
        index: '',
        url: '',
        logo: '',
        intro: ''
      },
      rules: {
        name: [
          { required: true, message: '请输入名称', trigger: ['blur', 'change'] }
        ],
        url: [
          { required: true, message: '不能为空', trigger: ['blur', 'change'] }
        ],
        index: [
          { required: true, message: '不能为空', trigger: ['blur', 'change'] }
        ],
        intro: [
          { required: true, message: '不能为空', trigger: ['blur', 'change'] }
        ]
      }
    }
  },
  methods: {
    init(data) {
      this.visible = true
      if (data) {
        this.form = { ...data }
      }
    },
    onFormSubmit() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          this.btnLoading = true
          addOrUpdate(this.form)
            .then(() => {
              this.$message.success('编辑成功')
              this.visible = false
              this.$emit('refreshList')
            })
            .catch(() => { })
            .finally(() => {
              this.btnLoading = false
            })
        }
      })
    },
    onClose() {
      this.$reset()
    },
    handleAvatarSuccess(response, file) {
      this.form.logo = response.name
    },
    beforeAvatarUpload(file, cb) {
      const type = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif']
      const isLt2M = file.size / 1024 / 1024 < 20

      if (!type.includes(file.type)) {
        this.$message.error('上传图片只能是 ' + type.join(',') + ' 格式!')
        cb(false)
        return
      }
      if (!isLt2M) {
        this.$message.error('上传图片大小不能超过 20M')
        cb(false)
        return
      }
      cb(true)
    }
  }
}
</script>

<style lang="scss" scoped>
.el-input-number {
  width: 200px;
}
.notice {
  color: #909399;
  font-size: 12px;
}
.avatar-uploader {
  display: inline-block;
  ::v-deep .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .el-upload:hover {
    border-color: #409eff;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 100px;
    height: 100px;
    line-height: 100px;
    text-align: center;
  }
  .avatar {
    width: 100px;
    height: 100px;
    display: block;
    object-fit: contain;
  }
}
</style>
