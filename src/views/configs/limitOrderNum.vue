<template>
  <div class="app-container">
    <el-form ref="form" :model="form" :rules="rules" label-width="140px">
      <el-form-item label="限制订单数量" prop="un_order_num">
        <el-input-number v-model="form.un_order_num" placeholder="限制订单数量" :precision="0" />
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
import { limitNumber, putLimitNumber } from '@/api/configs.js'
export default {
  name: 'LimitOrderNum',
  data() {
    return {
      btnLoading: false,
      form: {
        un_order_num: ''
      },
      rules: {
        un_order_num: [
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
      limitNumber()
        .then(response => {
          this.form.un_order_num = response.data.value
        })
        .catch(() => { })
    },
    onFormSubmit() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          this.btnLoading = true
          putLimitNumber(this.form)
            .then(({ msg }) => {
              this.$message.success(msg)
              this.getList()
            })
            .catch(() => { })
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
.app-container {
  width: 800px;
}
</style>

