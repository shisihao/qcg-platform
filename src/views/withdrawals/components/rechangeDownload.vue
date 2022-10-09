<template>
  <el-dialog
    title="导出线下充值"
    :modal-append-to-body="false"
    :close-on-click-modal="false"
    :visible.sync="visible"
    @closed="onClose()"
  >
    <el-form ref="form" v-loading="loading" :model="form" :rules="rules" label-width="80px" element-loading-text="导出中，请勿操作">
      <el-form-item label="个数" prop="num">
        <el-input-number v-model="form.num" :min="1" :max="30" label="个数" />
      </el-form-item>
    </el-form>

    <div slot="footer" class="dialog-footer">
      <el-button type="primary" :disabled="loading" @click="onFormSubmit()">
        {{ $t('table.confirm') }}
      </el-button>
      <el-button :disabled="loading" @click="visible = false">
        {{ $t('table.cancel') }}
      </el-button>
    </div>
  </el-dialog>
</template>

<script>
import { exportRechargeExcel } from '@/api/withdrawal'

export default {
  name: 'RechangeDownload',
  data() {
    return {
      visible: false,
      loading: false,
      form: {
        num: 1
      },
      rules: {
        num: [
          { required: true, message: '请输入个数', trigger: ['blur', 'change'] }
        ]
      }
    }
  },

  methods: {
    init() {
      this.visible = true
    },
    onFormSubmit() {
      this.loading = true
      exportRechargeExcel({ ...this.form })
        .then((response) => {
          location.href = '/' + response.data.filename
        })
        .catch(() => { })
        .finally(() => {
          this.loading = false
        })
    },
    onClose() {
      this.$reset()
    }
  }
}
</script>

<style  scoped>
.el-input-number {
  width: 200px;
}
</style>
