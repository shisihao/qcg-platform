<template>
  <div class="app-container">
    <el-form ref="form" :model="form" :rules="rules" label-width="200px">
      <el-form-item label="手续费比例" prop="fee">
        <el-input-number v-model="form.fee" placeholder="请输入手续费比例" />
      </el-form-item>
      <el-form-item label="提现开关" prop="switch">
        <el-switch
          v-model="form.switch"
          active-value="on"
          inactive-value="off"
        />
      </el-form-item>
      <el-form-item label="用户最低提现额度 (元)" prop="user_min">
        <el-input-number v-model="form.user_min" :min="0" placeholder="请输入用户最低提现额度" />
      </el-form-item>
      <el-form-item label="用户提现日上限 (元)" prop="user_day_limit">
        <el-input-number v-model="form.user_day_limit" placeholder="请输入用户提现日上限 " />
      </el-form-item>
      <el-form-item label="平台提现日上限 (元)" prop="terrace_day_limit">
        <el-input-number v-model="form.terrace_day_limit" placeholder="请输入平台提现日上限 " />
      </el-form-item>
      <el-form-item label="提现说明" prop="instr">
        <el-input v-model="form.instr" :rows="10" type="textarea" placeholder="提现说明" clearable />
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
import { cnyWithdrawal, putCnyWithdrawal } from '@/api/configs'
export default {
  name: 'CnyWithdrawal',
  data() {
    return {
      form: {
        // 手续费比例
        fee: 0,
        // 提现说明
        instr: '',
        // 提现开关
        switch: 'on',
        // 用户最低提现额度 单位(元)
        user_min: 0,
        // 用户提现日上限 单位(元)
        user_day_limit: 0,
        // 平台提现日上限
        terrace_day_limit: 0
      },
      rules: {
        fee: [{ required: true, message: '请输入手续费比例', trigger: 'blur' }],
        instr: [{ required: true, message: '请输入提现说明', trigger: 'blur' }],
        switch: [{ required: true, message: '请选择', trigger: 'blur' }],
        user_min: [{ required: true, message: '请输入金额', trigger: 'blur' }],
        user_day_limit: [{ required: true, message: '请输入金额', trigger: 'blur' }],
        terrace_day_limit: [{ required: true, message: '请输入金额', trigger: 'blur' }]
      },
      btnLoading: false
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
      cnyWithdrawal()
        .then(response => {
          this.form = response.data.value
        })
        .catch(({ msg = '加载失败' }) => {
          this.$message.error(msg)
        })
    },
    onFormSubmit() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          this.btnLoading = true
          putCnyWithdrawal(this.form)
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

<style  scoped>
    .el-input-number {
        width: 200px;
    }
    .app-container {
        width: 800px;
    }
</style>
