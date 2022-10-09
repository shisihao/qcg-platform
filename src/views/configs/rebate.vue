<template>
  <div class="app-container">
    <el-form ref="form" :model="form" :rules="rules" label-width="150px">
      <el-form-item label="邀请返佣比例" prop="rebate">
        <el-input v-model="form.rebate" placeholder="" clearable />
      </el-form-item>
      <el-form-item label="邀请链接文案配置" prop="rule">
        <el-input v-model="form.rule" type="textarea" :rows="10" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" :loading="btnLoading" @click="onFormSubmit">
          {{ $t('table.confirm') }}
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { inviteList, addinviteList } from '@/api/configs'

export default {
  name: 'Give',
  data() {
    return {
      loading: false,
      btnLoading: false,
      form: {
        rule: '',
        rebate: ''
      },
      rules: {
        rule: [
          { required: true, message: '不能为空', trigger: ['blur', 'change'] }
        ],
        rebate: [
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
    getList(loading = true) {
      if (this.loading) return
      this.loading = loading
      inviteList({ ...this.form })
        .then(response => {
          if (response.code !== 0) return
          this.form = Object.assign({}, response.data.value)
        })
        .catch(() => {
        })
        .finally(() => {
          this.loading = false
        })
    },
    onFormSubmit() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          this.btnLoading = true
          addinviteList({ ...this.form })
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

<style scoped>
    .el-input-number {
        width: 200px;
    }
    .notice {
        color: #909399;
        font-size: 12px;
    }
    .app-container {
        width: 800px;
    }
</style>
