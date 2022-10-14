<template>
  <el-dialog :title="form.id ? $t('table.edit') : $t('table.add')" width="600px" :visible.sync="visible" @closed="onClose()">
    <el-form ref="form" :model="form" :rules="rules" label-width="140px">
      <el-form-item label="藏品名称" prop="name">
        <el-input
          v-model="form.name"
          placeholder="藏品名称"
          clearable
        />
      </el-form-item>
      <el-form-item label="发售时间" prop="start_time">
        <el-date-picker
          v-model="form.start_time"
          type="datetime"
          placeholder="选择发售时间"
          :picker-options="disabledPickerOptions"
        />
      </el-form-item>
      <el-form-item label="藏品个数" prop="total">
        <el-input v-model="form.total" clearable placeholder="藏品个数" />
      </el-form-item>
      <el-form-item label="发售价格" prop="price">
        <el-input-number v-model="form.price" :min="0" :precision="2" controls-position="right" placeholder="发售价格" />
      </el-form-item>
      <el-form-item label="藏品图片" prop="show_image">
        <custom-upload
          class-name="avatar-uploader"
          @handleBeforeUpload="beforeAvatarUpload"
          @handleSuccess="handleAvatarSuccess"
        >
          <img v-if="form.show_image" :src="domin + form.show_image" class="avatar">
          <i v-else class="el-icon-plus avatar-uploader-icon" />
        </custom-upload>
      </el-form-item>
      <el-form-item label="是否展示" prop="is_show">
        <el-radio-group v-model="form.is_show">
          <el-radio :label="0">否</el-radio>
          <el-radio :label="1">是</el-radio>
        </el-radio-group>
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
import { addOrUpdate } from '@/api/platformPlans'
import { disabledPickerOptions } from '@/utils/explain'
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
      accountOptions: [],
      type: 0,
      form: {
        id: 0,
        name: '',
        price: '',
        total: '',
        is_show: 1,
        show_image: '',
        start_time: ''
      },
      disabledPickerOptions,
      rules: {
        name: [
          { required: true, message: '请输入名称', trigger: ['blur', 'change'] }
        ],
        show_image: [
          { required: true, message: '请输入名称', trigger: ['blur', 'change'] }
        ],
        is_show: [
          { required: true, message: '请输入名称', trigger: ['blur', 'change'] }
        ],
        price: [
          { required: true, message: '请输入名称', trigger: ['blur', 'change'] }
        ],
        total: [
          { required: true, message: '请输入名称', trigger: ['blur', 'change'] }
        ],
        start_time: [
          { required: true, message: '请输入名称', trigger: ['blur', 'change'] }
        ]
      }
    }
  },
  methods: {
    init(data) {
      this.visible = true
      if (data) {
        this.form = { ...data, password_confirmation: '', password: '' }
        this.form.reward ??= { fee: 0, first: 0 }
      }
    },
    onFormSubmit() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          this.btnLoading = true
          const data = { ...this.form }
          if (!data.password_confirmation || !data.password) {
            delete data.password
            delete data.password_confirmation
          }
          addOrUpdate(data)
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
      this.form.show_image = response.name
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
