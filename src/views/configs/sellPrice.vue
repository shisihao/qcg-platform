<template>
  <div class="app-container">
    <el-form ref="form" :model="form" :rules="rules" label-width="80px">
      <el-form-item label="金额" prop="sell_price">
        <el-input-number v-model="form.sell_price" :precision="0" :min="0" placeholder="请输入金额" />
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
import { sellPrice, putSellPrice } from '@/api/configs'
export default {
  name: 'SellPrice',
  data() {
    return {
      form: {
        sell_price: 0
      },
      btnLoading: false,
      rules: {
        sell_price: [{ required: true, message: '请输入金额', trigger: ['blur', 'change'] }]
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
      sellPrice()
        .then(response => {
          this.form.sell_price = response.data.value
        })
        .catch(({ msg = '加载失败' }) => {
          this.$message.error(msg)
        })
    },
    onFormSubmit() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          this.btnLoading = true
          putSellPrice(this.form)
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
