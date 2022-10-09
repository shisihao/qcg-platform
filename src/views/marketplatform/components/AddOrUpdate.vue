<template>
  <el-dialog :title="form.id ? $t('table.edit') : $t('table.add')" :visible.sync="visible" @closed="onClose()">
    <el-form ref="form" :model="form" :rules="rules" label-width="80px">
      <el-form-item label="logo" prop="icon">
        <custom-upload
          class-name="avatar-uploader"
          @handleBeforeUpload="beforeAvatarUpload"
          @handleSuccess="handleAvatarSuccess"
        >
          <img v-if="form.icon" :src="form.icon && domin + form.icon" class="avatar">
          <i v-else class="el-icon-plus avatar-uploader-icon" />
        </custom-upload>
      </el-form-item>
      <el-form-item label="名称" prop="name">
        <el-input v-model.trim="form.name" placeholder="名称" clearable />
      </el-form-item>
      <el-form-item label="标识" prop="alias">
        <el-input v-model.trim="form.alias" placeholder="标识" clearable />
      </el-form-item>
      <el-form-item label="字母索引" prop="letter">
        <el-input v-model.trim="form.letter" placeholder="字母索引" clearable />
      </el-form-item>
      <el-form-item label="排序" prop="sort">
        <el-input v-model.trim="form.sort" placeholder="排序" type="number" clearable />
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
import { addOrUpdate } from '@/api/marketplatform'
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
        icon: '',
        name: '',
        alias: '',
        letter: '',
        sort: ''
      },
      rules: {
        icon: [
          { required: true, message: '不能为空', trigger: ['blur', 'change'] }
        ],
        name: [
          { required: true, message: '不能为空', trigger: ['blur', 'change'] }
        ],
        alias: [
          { required: true, message: '不能为空', trigger: ['blur', 'change'] }
        ],
        letter: [
          { required: true, message: '不能为空', trigger: ['blur', 'change'] }
        ],
        sort: [
          { required: true, message: '不能为空', trigger: ['blur', 'change'] }
        ]
      }
    }
  },
  methods: {
    init(data) {
      this.visible = true
      if (data) {
        this.form = Object.assign({}, data)
      }
    },
    onFormSubmit() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          this.btnLoading = true
          addOrUpdate(this.form)
            .then(({ msg }) => {
              this.$message.success(msg)
              this.visible = false
              this.$emit('refreshList')
            })
            .catch(() => {
              this.btnLoading = false
            })
        }
      })
    },
    handleAvatarSuccess(response) {
      this.form.icon = response.name
    },
    beforeAvatarUpload(file, cb) {
      const type = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif']
      const isLt2M = file.size / 1024 / 1024 < 20

      if (!type.includes(file.type)) {
        this.$message.error('上传图片只能是 ' + type.join(',') + ' 格式!')
        cb(false)
        return false
      }
      if (!isLt2M) {
        this.$message.error('上传图片大小不能超过 20M')
        cb(false)
        return
      }
      cb(true)
    },
    onClose() {
      this.$reset()
    }
  }
}
</script>
<style lang="scss" scoped>
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
