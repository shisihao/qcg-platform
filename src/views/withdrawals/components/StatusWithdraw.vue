<template>
  <el-dialog :title="form.status === 1 ? '通过申请' : '驳回申请'" :visible.sync="visible" @closed="onClose()">

    <div class="el-message-box__container">
      <div class="el-message-box__status" :class="form.status === 1 ? 'el-icon-success' : 'el-icon-warning'" />
      <div class="el-message-box__message">
        <p>{{ `${form.status === 1 ? '通过' : '驳回'} #${form.id} 申请，提现金额：${amount}，服务费：${service_charge}，实际到账：${account_amount}` }}</p>
      </div>
    </div>

    <el-form ref="form" :model="form" :rules="rules" label-width="100px" style="margin-top: 20px">
      <div>
        <el-form-item label="谷歌验证码" prop="code">
          <el-input v-model="form.code" oninput="value=value.replace(/[^\d]/g,'')" placeholder="谷歌验证码" show-word-limit maxlength="6" clearable />
        </el-form-item>
      </div>
      <el-form-item v-if="form.status === 2" label="驳回原因" prop="reason">
        <el-input v-model="form.reason" placeholder="驳回原因" clearable />
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" :loading="btnLoading" @click="onFormSubmit()">
        {{ $t('table.confirm') }}
      </el-button>
      <el-button @click="visible = false">
        {{ $t('table.cancel') }}
      </el-button>
    </div>
  </el-dialog>
</template>

<script>
import { examineStatus } from '@/api/withdrawal'
export default {
  name: 'StatusWithdraw',
  data() {
    const validateNumberLength = (rule, value, callback) => {
      if (value.length !== 6) {
        callback(new Error('验证码错误'))
      } else {
        callback()
      }
    }

    return {
      visible: false,
      btnLoading: false,
      form: {
        id: 0,
        reason: '',
        status: 0,
        code: ''
      },
      amount: 0,
      service_charge: 0,
      account_amount: 0,
      rules: {
        reason: [
          { required: true, message: '请输入驳回原因', trigger: ['blur', 'change'] }
        ],
        code: [
          { required: true, message: '不能为空', trigger: ['blur', 'change'] },
          { validator: validateNumberLength, trigger: ['blur'] }
        ]
      }
    }
  },
  methods: {
    init(data, status) {
      this.visible = true
      this.form.id = data.id
      this.form.status = status
      this.amount = data.amount
      this.account_amount = data.account_amount
      this.service_charge = data.service_charge
    },
    onFormSubmit() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          this.$confirm(`确定${this.form.status === 1 ? '通过' : '驳回'}吗？`, '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            dangerouslyUseHTMLString: true,
            type: 'warning'
          })
            .then(() => {
              this.btnLoading = true
              const { id, ...data } = this.form
              examineStatus(id, data)
                .then(({ msg }) => {
                  this.$message.success(msg)
                  this.visible = false
                  this.$emit('refreshList')
                })
                .catch(() => {
                  this.btnLoading = false
                })
            })
            .catch(() => {})
        }
      })
    },
    onClose() {
      this.$reset()
    }
  }
}
</script>
