<template>
  <div class="app-container">
    <el-form ref="form" :model="form" label-position="left" label-width="170px">
      <el-form-item v-for="(item, index) in payOptions" :key="index" :label="item.label + '支付'" :prop="item.value">
        <span slot="label">
          <span class="svg">
            <svg-icon :icon-class="item.value" />
          </span>
          {{ item.label }}支付
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
import { pay, putPay } from '@/api/configs'
import { payOptions } from '@/utils/explain'
export default {
  name: 'PaySwitch',
  data() {
    return {
      // includes  v 是否包含 v.value
      payOptions: payOptions.filter(v => !['', 'bank'].includes(v.value)),
      form: {
        // on-开启 off-关闭
        alipay: 'off',
        wxpay: 'off',
        abcpay: 'off',
        jdpay: 'off',
        sandpay: 'off',
        sandpay_recharge: 'off'
      },
      rules: {
        user_min: [
          { required: true, message: '不能为空', trigger: ['blur', 'change'] }
        ],
        instr: [
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
      pay()
        .then(response => {
          this.form = response.data.value
        })
        .catch(() => {
        })
    },
    onFormSubmit() {
      putPay({ 'switch': this.form })
        .then(({ msg }) => {
          this.$message.success(msg)
        })
        .catch(() => {
          this.getList()
        })
        .finally(() => {
        })
    }
  }
}
</script>

<style lang="scss" scoped>
    .el-input-number {
        width: 200px;
    }
    .app-container {
        width: 800px;
    }
.svg {
  vertical-align: middle;
}
svg.svg-icon {
  width: 24px;
  height: 24px;
}
</style>
