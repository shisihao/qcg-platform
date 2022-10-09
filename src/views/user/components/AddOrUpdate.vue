<template>
  <el-dialog top="30px" :title="form.id ? $t('table.edit') : $t('table.add') " :visible.sync="visible" @closed="onClose()">
    <el-form ref="form" :model="form" :rules="rules" label-width="120px">
      <el-form-item label="头像" prop="avatar">
        <custom-upload
          class-name="avatar-uploader"
          @handleBeforeUpload="beforeAvatarUpload"
          @handleSuccess="handleAvatarSuccess"
        >
          <img v-if="form.avatar" :src="domin + form.avatar" class="avatar">
          <i v-else class="el-icon-plus avatar-uploader-icon" />
        </custom-upload>
        <div class="notice">
          建议比例 1:1，不超过20M
        </div>
      </el-form-item>
      <el-form-item label="昵称" prop="name">
        <el-input v-model="form.name" placeholder="昵称" maxlength="10" show-word-limit clearable />
      </el-form-item>
      <el-form-item label="手机号" prop="account">
        <el-input v-model="form.account" placeholder="手机号" maxlength="11" show-word-limit clearable />
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input v-model="form.password" type="password" placeholder="密码" clearable />
      </el-form-item>
      <el-form-item label="确认密码" prop="password_confirmation">
        <el-input v-model="form.password_confirmation" type="password" placeholder="确认密码" clearable />
      </el-form-item>
      <el-form-item v-if="form.id === 0" label="上级邀请码" prop="code">
        <el-input v-model="form.code" :disabled="form.id > 0" placeholder="上级邀请码" clearable />
      </el-form-item>
      <el-form-item label="状态" prop="state">
        <el-radio-group v-model="form.state">
          <el-radio :label="0">正常</el-radio>
          <el-radio :label="1">禁用</el-radio>
        </el-radio-group>
        <div class="notice1">
          注意：禁用之后用户无法登录
        </div>
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
import { validUsername1, validPhone } from '@/utils/validate'
import { DominKey, getToken } from '@/utils/auth'
import { addOrUpdate } from '@/api/user'
import CustomUpload from '@/components/Upload/CustomUpload'

export default {
  name: 'AddOrUpdate',
  // directives: { elDragDialog },
  components: { CustomUpload },
  data() {
    const validateUsername = (rule, value, callback) => {
      if (!validUsername1(value)) {
        callback(new Error('名称只能是中英文下划线及数字'))
      } else if (value.length < 2 || value.length > 20) {
        callback(new Error('名称2位到10位之间'))
      } else {
        callback()
      }
    }
    const validateAccount = (rule, value, callback) => {
      if (!validPhone(value)) {
        callback(new Error('请输入正确的手机号'))
      } else {
        callback()
      }
    }

    const validatePassword = (rule, value, callback) => {
      if (!this.form.id && !/\S/.test(value)) {
        callback(new Error('密码不能为空'))
      } else if (value && value.length < 6 || value.length > 20) {
        callback(new Error('密码6位到20位之间'))
      } else {
        callback()
      }
    }
    const validateConfirmPassword = (rule, value, callback) => {
      if (!this.form.id && !/\S/.test(value)) {
        callback(new Error('确认密码不能为空'))
      } else if (this.form.password !== value) {
        callback(new Error('确认密码与密码输入不一致'))
      } else {
        callback()
      }
    }
    return {
      visible: false,
      btnLoading: false,
      domin: getToken(DominKey),
      form: {
        id: 0,
        avatar: '',
        name: '',
        account: '',
        password: '',
        password_confirmation: '',
        identity_id: 1,
        state: 0
      },
      rules: {
        name: [
          { required: true, message: '名称不能为空', trigger: ['blur', 'change'] },
          { validator: validateUsername, trigger: ['blur', 'change'] }
        ],
        identity_id: [
          { required: true, message: '请选择用户身份', trigger: ['blur', 'change'] }
        ],
        account: [
          { required: true, message: '手机不能为空', trigger: ['blur', 'change'] },
          { validator: validateAccount, trigger: ['blur', 'change'] }
        ],
        password: [
          { validator: validatePassword, trigger: ['blur', 'change'] }
        ],
        password_confirmation: [
          { validator: validateConfirmPassword, trigger: ['blur', 'change'] }
        ]
      }
    }
  },
  methods: {
    init(data, options) {
      this.visible = true
      if (data) {
        const newKeys = Object.keys(this.form).filter(v => {
          return !['password', 'password_confirmation', 'currency_address', 'withdrawal'].includes(v)
        })
        newKeys.map(v => {
          if (v === 'account') {
            this.form[v] = data['phone'] || data['email']
          } else {
            this.form[v] = data[v]
          }
        })
        if (data.withdrawal) {
          Object.keys(this.form.withdrawal).map(v => {
            if (data.withdrawal[v] >= 0) {
              this.form.withdrawal[v] = data.withdrawal[v]
            }
          })
        }
      }
    },
    onFormSubmit() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          this.btnLoading = true
          const data = Object.assign({}, this.form)
          if (!data.password) {
            delete data.password
            delete data.password_confirmation
          }

          if (!this.form.code && !this.form.id) {
            this.$confirm(`没有上级邀请码的用户，将成为平台一级用户，是否确认添加`, `确认添加`, {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              cancelButtonClass: 'btn-custom-cancel',
              type: 'warning'
            })
              .then(() => {
                addOrUpdate(data)
                  .then(({ msg }) => {
                    this.$message.success(msg)
                    this.visible = false
                    this.$emit('refreshList')
                  })
                  .catch(() => {})
                  .finally(() => {
                    this.btnLoading = false
                  })
              })
              .catch(() => {
                this.btnLoading = false
              })
          } else {
            addOrUpdate(data)
              .then(({ msg }) => {
                this.$message.success(msg)
                this.visible = false
                this.$emit('refreshList')
              })
              .catch(() => {})
              .finally(() => {
                this.btnLoading = false
              })
          }
        }
      })
    },
    onClose() {
      this.$reset()
    },
    handleAvatarSuccess(response, file) {
      this.form.avatar = response.name
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
.notice {
  color: #909399;
  font-size: 12px;
}
.notice1 {
  color: #e6a23c;
  font-size: 12px;
}
</style>
