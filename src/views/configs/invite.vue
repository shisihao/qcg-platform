<template>
  <div class="app-container">
    <el-form ref="form" :model="form" :rules="rules" label-width="180px">
      <el-form-item label="邀请链接文案配置" prop="url_rule">
        <el-input v-model="form.url_rule" type="textarea" :rows="10" placeholder="邀请链接文案配置" clearable />
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
import { invite, putInvite } from '@/api/configs'
export default {
  name: 'Invite',
  data() {
    return {
      btnLoading: false,
      form: {
        url_rule: ''
      },
      rules: {
        url_rule: [
          { required: true, message: '不能为空', trigger: 'blur' }
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
      invite()
        .then(response => {
          this.form.rule = response.data.value.rule
          this.form.url_rule = response.data.value.url_rule
        })
        .catch(({ msg = '加载失败' }) => {
          this.$message.error(msg)
        })
    },
    onFormSubmit() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          this.btnLoading = true
          putInvite(this.form)
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
.notice {
  color: #909399;
  font-size: 12px;
}
.el-input-number {
  width: 200px;
}
.app-container {
  width: 800px;
}
</style>
