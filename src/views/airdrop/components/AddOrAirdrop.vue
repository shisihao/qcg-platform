<template>
  <el-dialog title="代金券空投" :visible.sync="visible" @closed="onClose()">
    <el-form ref="form" :model="form" :rules="rules" label-width="120px">
      <el-form-item label="是否去重" prop="unique">
        <el-radio-group v-model="form.unique">
          <el-radio :label="1">是</el-radio>
          <el-radio :label="0">否</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="是否实名" prop="verified">
        <el-radio-group v-model="form.verified">
          <el-radio :label="1">是</el-radio>
          <el-radio :label="0">否</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="上传Excel文件">
        <el-upload
          class="upload-demo"
          list-type="text"
          accept=".xlsx"
          :action="UploadUrl()"
          :limit="1"
          :on-exceed="handleExceed"
          :on-change="handleChange"
          :on-remove="handleRemove"
          :auto-upload="false"
          :file-list="fileList"
        >
          <el-button type="success" icon="el-icon-upload2">点击上传</el-button>
          <div slot="tip" class="el-upload__tip">只能上传xlsx</div>
        </el-upload>
      </el-form-item>
      <el-form-item label="空投说明" prop="desc">
        <textarea
          v-model="form.desc"
          placeholder="输入本次空投说明"
        />
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" :loading="btnLoading" @click="handleUploadFile()">
        {{ $t('table.confirm') }}
      </el-button>
      <el-button @click="visible = false">
        {{ $t('table.cancel') }}
      </el-button>
    </div>
  </el-dialog>
</template>

<script>
import { addOrconoup } from '@/api/coupon'
import { pickerOptions } from '@/utils/explain'
export default {
  name: 'AddOrUpdate',
  data() {
    return {
      visible: false,
      btnLoading: false,
      pickerOptions,
      fileList: [],
      form: {
        unique: 0,
        verified: 0,
        desc: '',
        batch_id: ''
      },
      file: null,
      rules: {
        unique: [
          { required: true, message: '不能为空', trigger: ['blur', 'change'] }
        ],
        verified: [
          { required: true, message: '不能为空', trigger: ['blur', 'change'] }
        ],
        desc: [
          { required: true, message: '不能为空', trigger: ['blur', 'change'] }
        ]
      }
    }
  },
  methods: {
    init(data) {
      this.visible = true
      if (data) {
        this.form.batch_id = data.id
      }
    },
    //  上传Exex
    // 确定上传
    handleUploadFile() {
      // 如果上传的文件列表是空的，给出提示
      if (this.fileList.length === 0) {
        return this.$message.warning('请先选择要上传的文件')
      }

      // 因为我们限制一次只上传1个文件，所以取数组里的第一个就可以了
      const file = this.fileList[0]
      // 获取到文件的后缀以便于判断文件类型
      const extension = file.name.substring(file.name.lastIndexOf('.') + 1)
      // 获取到文件的大小
      const size = file.size / 1024 / 1024
      // 判断文件类型
      if (extension !== 'xlsx') {
        this.$message.warning('只能上传后缀是.xlsx')
        return
      }
      // 限制上传文件的大小
      if (size > 10) {
        this.$message.warning('文件大小不得超过10M')
        return
      }
      // 把文件转成FormData格式上传
      const dataFile = new FormData()
      // dataFile.append('test', '1')
      dataFile.append('file', this.fileList[0].raw)

      for (const key in this.form) {
        dataFile.set(key, this.form[key])
      }
      // 发起请求
      this.$refs['form'].validate(valid => {
        if (valid) {
          this.btnLoading = true
          addOrconoup(dataFile)
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

      // this.$http.post('/orderIdCard/upload', dataFile, config).then(res => {
      //   if (res.data.code !== 200) {
      //     return this.$message.error(res.data.msg)
      //   }
      //   this.$message.success('上传成功')
      //   this.dialogVisible = false
      // })
    },
    // onFormSubmit() {
    //   this.$refs['form'].validate(valid => {
    //     if (valid) {
    //       this.btnLoading = true
    //       this.handleUploadFile()
    //       addOrconoup(this.form)
    //         .then(({ msg }) => {
    //           this.$message.success(msg)
    //           this.visible = false
    //           this.$emit('refreshList')
    //         })
    //         .catch(() => {
    //           this.btnLoading = false
    //         })
    //     }
    //   })
    // },
    // 可用时间
    onChangeDateRange(value) {
      if (Array.isArray(value)) {
        this.form.start_time = value[0]
        this.form.end_time = value[1]
      } else {
        this.form.start_time = this.form.end_time = ''
      }
    },
    onClose() {
      this.$reset()
    },

    // 文件状态改变时的钩子，添加文件、上传成功和上传失败时都会被调用
    handleChange(file, fileList) {
      this.fileList.push(file)
    },
    // 文件超出个数限制时的钩子
    handleExceed(file, fileList) {
      return this.$message.warning('一次只能上传一个文件哦~')
    },
    // 因为action参数是必填项，我们使用二次确认进行文件上传时，直接填上传文件的url会因为没有参数导致api报404，所以这里将action设置为一个返回为空的方法就行，避免抛错
    UploadUrl() {
      return ''
    },
    // 文件列表移除文件时的钩子
    handleRemove(file, fileList) {
      this.fileList = fileList
    }

  }
}
</script>
<style lang="scss" scoped>
textarea {
  height: 100%;
  width: 100%;
  border: 1px solid rgb(220, 223, 230);
  border-radius: 4px;
  padding: 5px;
  outline-color: rgba(83, 160, 231, 180.61);
}
</style>
