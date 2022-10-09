<template>
  <div class="app-container">
    <div class="filter-container">
      <el-descriptions title="我的公户信息" :column="1" size="medium">
        <el-descriptions-item label="收款户名">{{ form.bank_name }}</el-descriptions-item>
        <el-descriptions-item label="开户银行(支行)">{{ form.account_name }}</el-descriptions-item>
        <el-descriptions-item label="账号">{{ form.account_no }}</el-descriptions-item>
      </el-descriptions>
      <el-button style="margin-top: 30px" size="medium" type="primary" @click="dialogVisible=true">编辑</el-button>
    </div>

    <el-dialog title="编辑账户信息" :visible.sync="dialogVisible" @closed="onClose()">
      <el-form ref="form" :model="list" :rules="rules" label-width="120px">
        <el-form-item label="收款户名" prop="bank_name">
          <el-input v-model="list.bank_name" placeholder="收款户名" clearable />
        </el-form-item>
        <el-form-item label="开户银行(支行)" prop="account_name">
          <el-input v-model="list.account_name" placeholder="开户银行" clearable />
        </el-form-item>
        <el-form-item label="账号" prop="account_no">
          <el-input v-model="list.account_no" placeholder="账号" clearable />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" :loading="btnLoading" @click="onFormSubmit()">
          {{ $t('table.confirm') }}
        </el-button>
        <el-button @click="dialogVisible = false">
          {{ $t('table.cancel') }}
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { UpdateAccount, dataList } from '@/api/account'
export default {
  name: 'Billing',
  data() {
    return {
      dialogVisible: false,
      btnLoading: false,
      list: {
        bank_name: '',
        account_name: '',
        account_no: ''
      },
      form: {
        bank_name: '',
        account_name: '',
        account_no: ''
      },
      rules: {
        bank_name: [
          { required: true, message: '不能为空', trigger: ['blur', 'change'] }
        ],
        account_name: [
          { required: true, message: '不能为空', trigger: ['blur', 'change'] }
        ],
        account_no: [
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
      dataList()
        .then(response => {
          this.form = response.data.bank_info || ''
          this.list = { ...response.data.bank_info }
        })
        .catch(() => {})
    },
    onFormSubmit() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          this.btnLoading = true
          UpdateAccount(this.list)
            .then(({ msg }) => {
              this.$message.success(msg)
              this.dialogVisible = false
              this.getList()
            })
            .catch(() => {
              this.btnLoading = false
            }).finally(() => {
              this.btnLoading = false
            })
        }
      })
    },
    onClose() {
      this.list = { ...this.form }
      // this.$reset()
    }
  }
}
</script>
<style lang="scss" scoped>

</style>
