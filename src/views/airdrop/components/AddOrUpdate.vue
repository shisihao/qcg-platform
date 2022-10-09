<template>
  <el-dialog title="创建一批代金券" :visible.sync="visible" @closed="onClose()">
    <el-form ref="form" :model="form" :rules="rules" label-width="120px">
      <el-form-item label="批次标题" prop="title">
        <el-input v-model.trim="form.title" placeholder="批次标题" clearable />
      </el-form-item>
      <el-form-item label="代金券张数" prop="count">
        <el-input v-model.trim="form.count" placeholder="代金券张数" clearable />
      </el-form-item>
      <el-form-item label="单张面额" prop="amount">
        <el-input v-model.trim="form.amount" placeholder="单张额度" clearable />
      </el-form-item>
      <el-form-item label="可用时间" prop="dateRangeValue">
        <el-date-picker
          v-model="form.dateRangeValue"
          type="datetimerange"
          value-format="yyyy-MM-dd HH:mm:ss"
          :picker-options="pickerOptions"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          align="right"
          @change="onChangeDateRange"
        />
      </el-form-item>
      <el-form-item label="代金券规则说明" prop="usage_desc">
        <textarea
          v-model="form.usage_desc"
          placeholder="输入代金券规则说明"
        />
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
import { addOrUpdate } from '@/api/coupon'
import { pickerOptions } from '@/utils/explain'
export default {
  name: 'AddOrUpdate',
  data() {
    return {
      visible: false,
      btnLoading: false,
      pickerOptions,
      form: {
        title: '',
        count: '',
        amount: '',
        usage_desc: '',
        start_time: '',
        stop_time: '',
        dateRangeValue: []
      },
      rules: {
        title: [
          { required: true, message: '不能为空', trigger: ['blur', 'change'] }
        ],
        count: [
          { required: true, message: '不能为空', trigger: ['blur', 'change'] }
        ],
        amount: [
          { required: true, message: '不能为空', trigger: ['blur', 'change'] }
        ],
        usage_desc: [
          { required: true, message: '不能为空', trigger: ['blur', 'change'] }
        ],
        dateRangeValue: [{ required: true, message: '不能为空', trigger: ['blur', 'change'] }]
      }
    }
  },
  methods: {
    init(data) {
      this.visible = true
      if (data) {
        this.form = Object.assign({}, data)
      }
    },
    onFormSubmit() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          this.btnLoading = true
          addOrUpdate(this.form)
            .then(({ msg }) => {
              this.$message.success(msg)
              this.visible = false
              this.$emit('refreshList')
            })
            .catch(() => {
              this.btnLoading = false
            })
        }
      })
    },
    // 可用时间
    onChangeDateRange(value) {
      if (Array.isArray(value)) {
        this.form.start_time = value[0]
        this.form.stop_time = value[1]
      } else {
        this.form.start_time = this.form.stop_time = ''
      }
    },
    onClose() {
      this.$reset()
    }
  }
}
</script>
<style lang="scss" scoped>
textarea {
  height: 100%;
  width: 100%;
  border: 1px solid rgb(220, 223, 230);
  border-radius: 4px;
  padding: 5px;
  outline-color: rgba(83, 160, 231, 180.61);
}
</style>
