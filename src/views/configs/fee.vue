<template>
<div class="app-container">
    <el-form ref="form" :model="form" :rules="rules" label-width="120px">
      <el-form-item label="手续费比例(%)" prop="charge">
        <el-input-number v-model="form.charge" :precision="1" :min="0" placeholder="请输入手续费比例" />
      </el-form-item>
      <el-form-item label="版权费比例(%)" prop="copyright">
        <el-input-number v-model="form.copyright" :precision="1" :min="0" placeholder="请输入版权费比例" />
      </el-form-item>
      <el-form-item label="保证金比例(%)" prop="deposit">
        <el-input-number v-model="form.deposit" :precision="1" :min="0" placeholder="请输入保证金比例" />
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
import { fee, putFee } from '@/api/configs'
export default {
  name: 'Fee',
  data() {
    return {
      form: {
        charge: 0,
        copyright: 0,
        deposit: 0
      },
      btnLoading: false,
      rules: {
        charge: [{ required: true, message: '请输入手续费比例', trigger: ['blur', 'change'] }],
        copyright: [{ required: true, message: '请输入版权费比例', trigger: ['blur', 'change'] }],
        deposit: [{ required: true, message: '请输入版权费比例', trigger: ['blur', 'change'] }]
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
      fee()
        .then(response => {
          this.form = response.data.value
        })
        .catch(({ msg = '加载失败' }) => {
          this.$message.error(msg)
        })
    },
    onFormSubmit() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          this.btnLoading = true
          putFee(this.form)
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
    .app-container {
        width: 800px;
    }
</style>
