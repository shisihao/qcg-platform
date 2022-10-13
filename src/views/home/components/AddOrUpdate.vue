<template>
  <el-dialog :title="form.id ? $t('table.edit') : $t('table.add')" width="600px" :visible.sync="visible" @closed="onClose()">
    <el-form ref="form" :model="form" :rules="rules" label-width="140px">
      <el-form-item label="平台名称" prop="name">
        <el-input
          v-model="form.name"
          placeholder="平台名称"
          clearable
        />
      </el-form-item>
      <el-form-item label="字母索引" prop="index">
        <el-autocomplete
          v-model="form.index"
          class="inline-input"
          :fetch-suggestions="querySearch"
          placeholder="请输入字母（可搜索）"
        />
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
      <el-form-item label="是否展示" prop="is_show">
        <el-radio-group v-model="form.is_show">
          <el-radio :label="0">否</el-radio>
          <el-radio :label="1">是</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="是否热门" prop="is_hot">
        <el-radio-group v-model="form.is_hot">
          <el-radio :label="0">否</el-radio>
          <el-radio :label="1">是</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="热门排序" prop="sort">
        <el-input-number v-model="form.sort" :min="0" :precision="0" placeholder="请输入排序序号" controls-position="right" />
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
    var validatePass = (rule, value, callback) => {
      if (!/[a-zA-Z]/g.test(value)) {
        callback(new Error('请输入英文字符'))
      } else {
        callback()
      }
    }
    return {
      domin: getToken(DominKey),
      visible: false,
      btnLoading: false,
      options: [],
      form: {
        id: 0,
        name: '',
        index: '',
        url: '',
        sort: '',
        logo: '',
        intro: '',
        is_hot: 0,
        is_show: 1
      },
      rules: {
        name: [
          { required: true, message: '请输入名称', trigger: ['blur', 'change'] }
        ],
        url: [
          { required: true, message: '不能为空', trigger: ['blur', 'change'] }
        ],
        index: [
          { required: true, message: '不能为空', trigger: ['blur', 'change'] },
          { validator: validatePass, message: '请输入英文字母' },
          { max: 1, message: '长度1个字符' }
        ],
        intro: [
          { required: true, message: '不能为空', trigger: ['blur', 'change'] }
        ],
        logo: [
          { required: true, message: '不能为空', trigger: ['blur', 'change'] }
        ],
        is_hot: [
          { required: true, message: '不能为空', trigger: ['blur', 'change'] }
        ],
        is_show: [
          { required: true, message: '不能为空', trigger: ['blur', 'change'] }
        ]
      }
    }
  },
  methods: {
    init(data) {
      this.visible = true
      this.initOptions()
      if (data) {
        this.form = { ...data }
      }
    },
    initOptions() {
      this.options = ('ABCDEFGHJKLMNOPQRSTWXYZ'.split('')).map(v => { return { value: v } })
    },
    querySearch(val, cb) {
      const results = val ? this.options.filter(this.createFilter(val)) : this.options
      cb(results)
    },
    createFilter(queryString) {
      return (resultsArray) => {
        return (resultsArray.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0)
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
