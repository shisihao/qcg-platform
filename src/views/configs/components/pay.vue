<template>
  <div class="app-container">
    <el-form ref="form" :model="form" label-width="80px" :rules="rules">
      <el-form-item label="最低额度" prop="user_min">
        <el-input-number v-model="form.user_min" :precision="0" :min="0" placeholder="最低额度" />
      </el-form-item>
      <el-form-item label="充值说明" prop="instr">
        <el-input v-model="form.instr" :rows="10" type="textarea" placeholder="充值说明" clearable />
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
import { payConfiguration, putPayConfiguration } from '@/api/configs'
export default {
  name: 'Pay',
  data() {
    return {
      btnLoading: false,
      form: {
        user_min: 0,
        instr: ''
      },
      rules: {
        user_min: [
          { required: true, message: '不能为空', trigger: ['blur', 'change'] }
        ],
        instr: [
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
      payConfiguration()
        .then(response => {
          this.form = response.data.value
        }).catch(() => {
        })
    },
    onFormSubmit() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          this.btnLoading = true
          putPayConfiguration(this.form)
            .then(({ msg }) => {
              this.$message.success(msg)
              this.getList()
            })
            .catch(() => {})
            .finally(() => {
              this.btnLoading = false
            })
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
    .el-input-number {
        width: 200px;
    }
    .app-container {
        width: 800px;
    }
.svg {
  vertical-align: middle;
}
svg.svg-icon {
  width: 24px;
  height: 24px;
}
</style>
