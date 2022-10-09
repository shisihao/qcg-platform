<template>
  <div class="app-container">
    <el-form ref="form" :model="form" :rules="rules" label-width="120px">
      <el-form-item label="集市服务费(%)" prop="service">
        <el-input-number v-model="form.service" :precision="1" :min="0" placeholder="请输入集市服务费比例" />
      </el-form-item>
      <el-form-item label="集市最低服务费" prop="min_service">
        <el-input-number v-model="form.min_service" :precision="1" :min="0" placeholder="请输入集市服务费比例" />
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
import { fee, putFee } from '@/api/marketplatform'
export default {
  name: 'Fee',
  data() {
    return {
      form: {
        min_service: '',
        service: ''
      },
      btnLoading: false,
      rules: {
        service: [{ required: true, message: '请输入集市服务费比例', trigger: ['blur', 'change'] }],
        min_service: [{ required: true, message: '请输入集市服务费比例', trigger: ['blur', 'change'] }]
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
