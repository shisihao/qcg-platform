<template>
  <div class="app-container">
    <el-form ref="form" :model="form" :rules="rules" label-width="150px">
      <el-form-item label="集市购买须知" prop="purchase">
        <tinymce v-model="form.purchase" :height="400" />
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
import { register, putRegister } from '@/api/marketplatform'
import Tinymce from '@/components/Tinymce'

export default {
  name: 'Register',
  components: { Tinymce },
  data() {
    return {
      btnLoading: false,
      form: {
        purchase: ''
      },
      rules: {
        purchase: [
          { required: true, message: '集市购买须知不能为空', trigger: 'blur' }
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
      register()
        .then(response => {
          this.form.purchase = response.data.value
        })
        .catch(() => {
        })
    },
    onFormSubmit() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          this.btnLoading = true
          putRegister(this.form)
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
