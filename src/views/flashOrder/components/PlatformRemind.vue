<template>
  <el-dialog title="提醒发货" :visible.sync="visible" @closed="onClose()">
    <el-descriptions title="订单信息" size="medium" :column="4">
      <el-descriptions-item label="订单号" :span="4">
        {{ row.order_no }}
      </el-descriptions-item>
      <el-descriptions-item label="卖方信息" :span="2">
        <div v-if="row.consignment && row.consignment.user">
          <el-avatar
            :key="row.consignment.user.id"
            icon="el-icon-user-solid"
            :src="row.consignment.user.avatar ? domin + row.consignment.user.avatar : ''"
          />
          <div style="display: inline-block;margin-left: 2px">
            <div>
              # {{ row.consignment.user.id }}
              <el-divider direction="vertical" />
              {{ row.consignment.user.name }}
            </div>
            <div>
              {{ row.consignment.user.phone || row.consignment.user.email }}
            </div>
          </div>
        </div>
        <div v-else>
          用户已删除
        </div>
      </el-descriptions-item>
      <el-descriptions-item label="买方信息" :span="2">
        <div v-if="row.user">
          <el-avatar
            :key="row.user.id"
            icon="el-icon-user-solid"
            :src="row.user.avatar ? domin + row.user.avatar : ''"
          />
          <div style="display: inline-block;margin-left: 2px">
            <div>
              # {{ row.user.id }}
              <el-divider direction="vertical" />
              {{ row.user.name }}
            </div>
            <div>
              {{ row.user.phone || row.user.email }}
            </div>
          </div>
        </div>
        <div v-else>
          用户已删除
        </div>
      </el-descriptions-item>
    </el-descriptions>
    <el-divider content-position="left">操作</el-divider>
    <el-form ref="form" :model="form" :rules="rules" label-width="80px">
      <el-form-item label="提醒" prop="type">
        <el-radio-group v-model="form.type">
          <el-radio v-for="(item, index) in remindTypeOptions" :key="index" :label="item.value">{{ item.label }}</el-radio>
        </el-radio-group>
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
import { remindOrder } from '@/api/order'
import { remindTypeOptions } from '@/utils/explain'

export default {
  name: 'PlatformRemind',
  data() {
    return {
      visible: false,
      btnLoading: false,
      remindTypeOptions,
      row: {
        consignment: {
          user: {}
        },
        user: {}
      },
      form: {
        id: 0,
        type: ''
      },
      rules: {
        type: [
          { required: true, message: '请选择', trigger: ['blur', 'change'] }
        ]
      }
    }
  },
  methods: {
    init(row) {
      this.visible = true
      if (row) {
        this.row = row
        this.form.id = row.id
      }
    },
    onFormSubmit() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          this.$confirm(
            `<div>确认提醒 <span style="color: ${this.form.type === 'sell' ? '#ff4949' : '#13ce66'};">${remindTypeOptions.find(v => v.value === this.form.type)?.label}</span></div>`,
            '提醒',
            {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning',
              dangerouslyUseHTMLString: true,
              cancelButtonClass: 'btn-custom-cancel'
            })
            .then(() => {
              this.btnLoading = true
              remindOrder(this.form)
                .then(({ msg }) => {
                  this.$message.success(msg)
                  this.visible = false
                })
                .catch(() => {})
                .finally(() => {
                  this.btnLoading = false
                })
            })
            .catch(() => { }
            )
        }
      })
    },
    onClose() {
      this.$reset()
    }
  }
}
</script>
<style lang="scss" scoped>

</style>
