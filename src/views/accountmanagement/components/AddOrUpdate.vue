<template>
  <el-dialog title="开票信息" :visible.sync="visible" center>
    <div style="margin-bottom: 20px;">
      <el-descriptions :column="1" size="medium">
        <el-descriptions-item label="收款户名">{{ form.company_name }}</el-descriptions-item>
        <el-descriptions-item label="开户银行">{{ form.bank_name }}</el-descriptions-item>
        <el-descriptions-item label="账号">{{ form.bank_no }}</el-descriptions-item>
        <el-descriptions-item label="邮寄地址">{{ form.company_address }}</el-descriptions-item>
      </el-descriptions>
    </div>
    <div>
      请按照以上开票信息进行发票邮寄，之后点击立即申请，我们将在收到发票后，进行对公转账。
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button size="medium" type="primary" :loading="btnLoading" @click="handleUploadFile()">确认申请</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { configList, UpdateBills } from '@/api/account'
export default {
  name: 'AddOrUpdate',
  data() {
    return {
      visible: false,
      btnLoading: false,
      form: {
        bank_name: '',
        bank_no: '',
        company_address: '',
        company_name: ''
      },
      id: ''
    }
  },
  methods: {
    init(data) {
      this.visible = true
      this.getList()
      if (data) {
        this.id = data.id
      }
    },
    getList() {
      configList()
        .then(response => {
          this.form = response.data.platform_invoice
        })
        .catch(() => {})
    },
    handleUploadFile() {
      this.btnLoading = true
      UpdateBills(this.id).then(response => {
        this.$message.success(response.msg)
        this.visible = false
        this.$emit('refreshList')
      }).catch(() => {
        this.visible = false
      }).finally(() => {
        this.btnLoading = false
      })
    }
  }
}
</script>
<style lang="scss" scoped>

</style>
