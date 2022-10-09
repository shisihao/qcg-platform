<template>
  <div class="app-container">
    <el-form ref="form" :model="form" :rules="rules" label-width="80px">
      <el-form-item label="验证次数" prop="verify_num">
        <el-input-number v-model="form.verify_num" placeholder="请输入验证次数" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" :loading="btnLoading" @click="onFormSubmit()">
          {{ $t('table.confirm') }}
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { verifyNum, putVerifyNum } from '@/api/configs.js'
export default {
  name: 'VerifyNums',
  data() {
    return {
      btnLoading: false,
      form: {
        verify_num: ''
      },
      rules: {
        verify_num: [
          { required: true, message: '不能为空', trigger: ['blur', 'change'] }
        ]

      }
    }
  },
  created() {
    this.init()
  },
  methods: {
    init() {
      this.getList()
    },
    getList() {
      verifyNum()
        .then(response => {
          this.form.verify_num = response.data.value
        })
        .catch(() => { })
    },
    onFormSubmit() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          this.btnLoading = true
          putVerifyNum(this.form)
            .then(({ msg }) => {
              this.$message.success(msg)
              this.getList()
            })
            .catch(() => { })
            .finally(() => {
              this.btnLoading = false
            })
        }
      })
    }
  }
}
</script>

<style scoped>
.el-input-number {
  width: 200px;
}
.app-container {
  width: 800px;
}
</style>

