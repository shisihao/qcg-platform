<template>
  <div class="app-container">
    <el-form ref="form" :model="form" :rules="rules" label-width="80px">
      <el-form-item label="指南说明" prop="transfer_guide">
        <tinymce v-model="form.transfer_guide" :height="400" />
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
import { transferGuide, putTransferGuide } from '@/api/configs'
import Tinymce from '@/components/Tinymce'

export default {
  name: 'TransferGuide',
  components: { Tinymce },
  data() {
    return {
      btnLoading: false,
      form: {
        transfer_guide: ''
      },
      rules: {
        transfer_guide: [
          { required: true, message: '关于不能为空', trigger: 'blur' }
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
      transferGuide()
        .then(response => {
          this.form.transfer_guide = response.data.value
        })
        .catch(({ msg = '加载失败' }) => {
          this.$message.error(msg)
        })
    },
    onFormSubmit() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          this.btnLoading = true
          putTransferGuide(this.form)
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
.app-container {
  width: 1000px;
}
</style>
