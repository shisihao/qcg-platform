<template>
  <div class="app-container">
    <el-form ref="form" :model="form" :rules="rules" label-position="left" label-width="120px">
      <el-form-item v-for="(item, index) in accountType" :key="index" :label="item.label + '支付'" :prop="item.value">
        <span slot="label">
          <span class="svg">
            <svg-icon :icon-class="item.value" />
          </span>
          {{ item.label }}收款
        </span>
        <el-switch
          v-model="form[item.value]"
          active-value="on"
          inactive-value="off"
          @change="onFormSubmit"
        />
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { accountType, putAccountType } from '@/api/configs'
export default {
  name: 'AccountType',
  data() {
    return {
      form: {
        // on-开启 off-关闭
        alipay: 'off',
        wxpay: 'off',
        bank: 'off'
      },
      accountType: [
        { label: '微信', value: 'wxpay' },
        { label: '支付宝', value: 'alipay' },
        { label: '银行卡', value: 'bank' }
      ],
      rules: {}
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
      accountType()
        .then(response => {
          this.form = response.data.value
        })
        .catch(() => {
        })
    },
    onFormSubmit() {
      this.btnLoading = true
      putAccountType({ 'switch': this.form })
        .then(({ msg }) => {
          this.$message.success(msg)
        })
        .catch(() => {
          this.getList()
        })
        .finally(() => {
          this.btnLoading = false
        })
    }
  }
}
</script>

<style lang="scss" scoped>
.svg {
  vertical-align: middle;
}
svg.svg-icon {
  width: 24px;
  height: 24px;
}
</style>
