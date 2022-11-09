<template>
  <el-dialog title="平台介入" :visible.sync="visible" @closed="onClose()">
    <el-descriptions size="medium" :column="4">
      <el-descriptions-item label="订单号" :span="4">
        {{ row.order_no }}
      </el-descriptions-item>
      <el-descriptions-item label="卖方信息" :span="2">
        <div v-if="row.consignment && row.consignment.user">
          <el-avatar
            :key="row.consignment.user.id"
            class="avatar"
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
            <div>
              <el-tag v-show="row.intervene_user_id===row.consignment.user_id">申请介入</el-tag>
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
            <div>
              <el-tag v-show="row.intervene_user_id===row.user.id">申请介入</el-tag>
            </div>
          </div>
        </div>
        <div v-else>
          用户已删除
        </div>
      </el-descriptions-item>
    </el-descriptions>
    <el-divider content-position="left">操作</el-divider>
    <el-form ref="form" :model="form" :rules="rules" label-width="120px">
      <el-form-item label="责任方" prop="type">
        <el-radio-group v-model="form.type" @change="handleTypeChange">
          <el-radio v-for="(item, index) in remindTypeOptions" :key="index" :label="item.value">{{ item.label }}</el-radio>
        </el-radio-group>
      </el-form-item>
      <div class="notice">
        当前卖方信用分<span>{{ row.consignment.user.score }}</span>，买方信用分<span>{{ row.user.score }}</span>
      </div>
      <el-form-item v-show="form.type" :label="scoreLabel" prop="deduct_score">
        <el-input-number v-model="form.deduct_score" :min="0" :precision="0" />
      </el-form-item>
      <el-form-item v-if="form.type==='sell'" label="扣除金额" prop="deduct_deposit">
        <el-input v-model="form.deduct_deposit" />
      </el-form-item>
      <el-form-item label="扣除原因" prop="reason">
        <el-input v-model="form.reason" type="textarea" placeholder="扣除原因" :rows="6" />
      </el-form-item>
      <el-form-item label="订单处理" prop="status">
        <el-radio-group v-model="form.status" @change="handleTypeChange">
          <el-radio v-for="(item, index) in orderstatusOptions" :key="index" :label="item.value">{{ item.label }}</el-radio>
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
import { interveneOrder } from '@/api/marketorder'
import { orderstatusOptions, remindTypeOptions } from '@/utils/explain'
import { getToken, DominKey } from '@/utils/auth'

export default {
  name: 'PlatformIntervene',
  data() {
    return {
      domin: getToken(DominKey),
      visible: false,
      btnLoading: false,
      remindTypeOptions,
      orderstatusOptions,
      form: {
        id: 0,
        type: 'sell',
        deduct_deposit: 0,
        deduct_score: 0,
        reason: '',
        status: 'success'
      },
      row: {
        user: {},
        consignment: {
          user: {}
        }
      },
      rules: {
        type: [
          { required: true, message: '不能为空', trigger: ['blur', 'change'] }
        ],
        deduct_score: [
          { required: true, message: '不能为空', trigger: ['blur', 'change'] }
        ],
        reason: [
          { required: true, message: '不能为空', trigger: ['blur', 'change'] }
        ],
        status: [
          { required: true, message: '不能为空', trigger: ['blur', 'change'] }
        ],
        deduct_deposit: [
          { required: true, message: '不能为空', trigger: ['blur', 'change'] }
        ]
      }
    }
  },
  computed: {
    scoreLabel() {
      const label = this.remindTypeOptions.find(v => {
        return this.form.type === v.value
      })?.label
      return `${label ?? ''}扣除信用分`
    }
  },

  methods: {
    init(row) {
      this.visible = true
      if (row) {
        this.form.id = row.id
        this.row = row
      }
    },
    handleTypeChange(val) {
      if (val === 'buy') {
        this.form.deduct_deposit = 0
      }
    },
    onFormSubmit() {
      if (this.form.type === 'buy' && this.form.deduct_score > this.row.consignment.user.score) {
        return this.$message.warning('卖方信用分低于扣除信用分')
      }
      if (this.form.type === 'sell' && this.form.deduct_score > this.row.user.score) {
        return this.$message.warning('卖方信用分低于扣除信用分')
      }

      this.$refs['form'].validate(valid => {
        if (valid) {
          const label = this.remindTypeOptions.find(v => {
            return this.form.type === v.value
          })?.label
          this.$confirm(
            `<div>责任方：<span style="color: ${this.form.type === 'sell' ? '#ff4949' : '#13ce66'};">${label}</span></div>
            <div>${this.scoreLabel}：${this.form.deduct_score}</div>
            <div>扣除原因：${this.form.reason}</div>`,
            '平台介入',
            {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning',
              dangerouslyUseHTMLString: true,
              cancelButtonClass: 'btn-custom-cancel'
            })
            .then(() => {
              this.btnLoading = true
              interveneOrder(this.form)
                .then(({ msg }) => {
                  this.$message.success(msg)
                  this.visible = false
                  this.$emit('refreshList')
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
  .el-input-number {
    width: 200px;
  }
  .notice {
    color: #909399;
    font-size: 14px;
    margin-left: 120px;
    margin-bottom: 18px;
    span {
      color: #e6a23c;
    }
  }
  .avatar{
    vertical-align: top ;
  }
</style>
