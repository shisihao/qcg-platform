<template>
  <div class="app-container">
    <el-form ref="form" :model="form" :rules="rules" label-width="140px">
      <el-form-item label="介入时间（分钟）" prop="intervene">
        <el-input-number v-model="form.intervene" placeholder="请输入介入时间（分钟）" />
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
import { intervene, putIntervene } from '@/api/marketplatform.js'
export default {
  name: 'Intervene',
  data() {
    return {
      btnLoading: false,
      form: {
        intervene: ''
      },
      rules: {
        intervene: [
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
      intervene()
        .then(response => {
          this.form.intervene = response.data.value
        })
        .catch(() => { })
    },
    onFormSubmit() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          this.btnLoading = true
          putIntervene(this.form)
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

