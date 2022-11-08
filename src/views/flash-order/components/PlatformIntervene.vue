<template>
  <el-dialog title="平台介入" :visible.sync="visible" @closed="onClose()">
    <el-tabs v-model="activeName" type="card">
      <el-tab-pane label="正常" name="1">
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
          <el-form-item label="藏品归属方" prop="type">
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
          <el-form-item v-if="form.type==='sell'" label="扣除诚信金" prop="is_deduct_deposit">
            <el-radio-group v-model="form.is_deduct_deposit">
              <el-radio :label="1">是</el-radio>
              <el-radio :label="0">否</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="扣除原因" prop="reason">
            <el-input v-model="form.reason" type="textarea" placeholder="扣除原因" :rows="6" />
          </el-form-item>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="异常" name="2">
        <el-button type="primary" plain @click="onErrorOrder">链上错误订单处理</el-button>
      </el-tab-pane>
    </el-tabs>
    <div v-if="activeName==='1'" slot="footer" class="dialog-footer">
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
import { interveneOrder, errorOrder } from '@/api/order'
import { remindTypeOptions } from '@/utils/explain'
import { getToken, DominKey } from '@/utils/auth'

export default {
  name: 'PlatformIntervene',
  data() {
    return {
      domin: getToken(DominKey),
      visible: false,
      btnLoading: false,
      remindTypeOptions,
      activeName: '1',
      form: {
        id: 0,
        type: '',
        deduct_score: 0,
        is_deduct_deposit: 1,
        reason: ''
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
        is_deduct_deposit: [
          { required: true, message: '不能为空', trigger: ['blur', 'change'] }
        ],
        reason: [
          { required: true, message: '不能为空', trigger: ['blur', 'change'] }
        ]
      }
    }
  },
  computed: {
    scoreLabel() {
      const label = this.remindTypeOptions.find(v => {
        return this.form.type !== v.value
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
        this.form.is_deduct_deposit = 0
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
            `<div>藏品归属方：<span style="color: ${this.form.type === 'sell' ? '#ff4949' : '#13ce66'};">${label}</span></div>
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
    onErrorOrder() {
      this.$confirm('藏品确认线下处理，归属方为买方, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        cancelButtonClass: 'btn-custom-cancel'
      }).then(() => {
        errorOrder(this.form.id).then(({ msg }) => {
          this.$message.success(msg)
          this.visible = false
          this.$emit('refreshList')
        })
      }).catch(() => {
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
