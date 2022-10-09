<template>
  <div class="app-container">
    <el-form ref="form" :model="form" :rules="rules" label-width="120px">
      <el-form-item label="开户费用" prop="open_amount">
        <el-input-number v-model="form.open_amount" placeholder="开户费用配置" :precision="2" />
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
import { openAmount, putOpenAmount } from '@/api/configs'

export default {
  name: 'OpenAmount',
  data() {
    return {
      form: {
        open_amount: 0
      },
      btnLoading: false,
      rules: {
        open_amount: [
          { required: true, message: '请输入开户费用配置', trigger: 'blur' }
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
      openAmount()
        .then(response => {
          this.form.open_amount = response.data.value
        })
        .catch(() => {
        })
    },
    onFormSubmit() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          this.btnLoading = true
          putOpenAmount({ ...this.form })
            .then(({ msg }) => {
              this.$message.success(msg)
              this.getList()
            })
            .catch(() => {
            })
            .finally(() => {
              this.btnLoading = false
            })
        }
      })
    }
  }
}
</script>

<style  scoped>
.el-input-number {
  width: 200px;
}
</style>
