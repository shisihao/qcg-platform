<template>
  <div class="app-container">
    <el-form ref="form" :model="form" :rules="rule" label-width="80px">
      <el-form-item label="赠送开关">
        <el-switch
          v-model="form.switch"
          active-value="on"
          inactive-value="off"
        />
      </el-form-item>
      <el-form-item label="温馨提示">
        <el-input v-model="form.reminder" type="textarea" :rows="10" />
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
import { giveList, addGiveList } from '@/api/configs'

export default {
  name: 'Give',
  data() {
    return {
      loading: false,
      btnLoading: false,
      form: {
        reminder: '',
        switch: ''
        // on-开启 off-关闭
      },
      rule: {}
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
      giveList({ ...this.form })
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
          addGiveList({ ...this.form })
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
