<template>
  <div class="app-container">
    <el-form ref="form" :model="form" :rules="rules" label-width="80px">
      <el-form-item label="账号" prop="phone">
        <el-input
          v-model="form.phone"
          label="账号"
          clearable
          type="text"
          placeholder="请输入账号"
          maxlength="13"
          show-word-limit
        />
      </el-form-item>
      <el-form-item label="分数" prop="score">
        <el-input-number v-model="form.score" :min="0" label="分数" :precision="0" />
      </el-form-item>
      <el-form-item label="标题名称" prop="name">
        <el-input v-model.trim="form.name" placeholder="请输入标题名称" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" :loading="btnLoading" @click="onFormSubmit">确定</el-button>
      </el-form-item>
    </el-form>
  </div>

</template>

<script>
import { updateScore } from '@/api/credit-score'
import { validPhone, validUsername2 } from '@/utils/validate'

export default {
  name: 'SetWallet',
  data() {
    const validateUsername = (rule, value, callback) => {
      if (!validUsername2(value)) {
        callback(new Error('不能包含字符空格'))
      } else {
        callback()
      }
    }
    const validatePhone = (rule, value, callback) => {
      if (!validPhone(value)) {
        callback(new Error('请输入正确手机号'))
      } else {
        callback()
      }
    }

    return {
      visible: false,
      btnLoading: false,
      form: {
        phone: '',
        score: 0,
        name: ''
      },
      name: '',
      rules: {
        phone: [
          { required: true, message: '不能为空', trigger: ['blur', 'change'] },
          { validator: validatePhone, trigger: ['blur', 'change'] }
        ],
        score: [
          { required: true, message: '不能为空', trigger: ['blur', 'change'] }
        ],
        name: [
          { required: true, message: '流水标题不能为空', trigger: ['blur', 'change'] },
          { validator: validateUsername, trigger: ['blur', 'change'] }
        ]
      }
    }
  },
  methods: {
    onFormSubmit() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          this.btnLoading = true
          updateScore(this.form)
            .then(({ msg }) => {
              this.$message.success(msg)
            })
            .catch(() => {
              this.btnLoading = false
            })
        }
      })
    }
  }
}
</script>

<style scoped>
.app-container{
  max-width: 600px;
}
  .el-input-number ::v-deep {
    width: 200px;
  }
</style>
