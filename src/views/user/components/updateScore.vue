<template>
  <el-dialog top="30px" title="信用分操作 " custom-class="update-score" append-to-body :modal-append-to-body="false" :visible.sync="visible" @closed="onClose()">
    <div style="display:flex;align-items: center;">
      <div class="notice">
        当前用户信用分<span>{{ row.score }}</span>
      </div>
    </div>
    <el-divider />
    <el-form ref="form" :model="form" :rules="rules" label-width="120px">
      <el-form-item label="操作" prop="action">
        <el-radio-group v-model="form.action">
          <el-radio :label="1">增加</el-radio>
          <el-radio :label="2">扣除</el-radio>
          <el-radio :label="3">解除锁定</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item v-if="form.action!==3" label="分数" prop="score">
        <el-input-number v-model="form.score" :min="0" label="分数" :precision="0" />
      </el-form-item>
      <el-form-item v-if="form.action!==3" label="标题名称" prop="name">
        <el-input v-model.trim="form.name" placeholder="请输入标题名称" />
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
import { updateScore, relieveScore } from '@/api/user'

export default {
  name: 'UpdateScore',
  data() {
    return {
      visible: false,
      btnLoading: false,
      form: {
        action: 1,
        score: 0,
        name: ''
      },
      row: {},
      rules: {
        action: [
          { required: true, message: '请选择操作', trigger: 'change' }
        ],
        score: [
          { required: true, message: '请输入分数', trigger: 'change' }
        ],
        name: [
          { required: true, message: '请输入标题名称', trigger: 'change' }
        ]
      }
    }
  },
  methods: {
    init(data) {
      this.visible = true
      if (data) {
        this.row = data
      }
    },
    onFormSubmit() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          if (this.form.action === 3) {
            this.$confirm(`确定对用户[(#${this.row.id})]进行[解除信用分锁定]操作?`, '待执行', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning',
              cancelButtonClass: 'btn-custom-cancel'
            }).then(() => {
              relieveScore(this.row.id)
                .then(({ msg }) => {
                  this.$message.success(msg)
                  this.visible = false
                  this.$emit('refreshList')
                })
                .catch(() => { })
            })
              .catch(() => { })
          } else {
            this.btnLoading = true
            updateScore(this.row.id, this.form)
              .then(({ msg }) => {
                this.$message.success(msg)
                this.visible = false
                this.$emit('refreshList')
              })
              .catch(() => {
                this.btnLoading = false
              })
          }
        }
      })
    },
    onRelieveScore(data) {
      this.$confirm(`确定对用户[(#${data.id})][解除信用分锁定]操作?`, '待执行', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        cancelButtonClass: 'btn-custom-cancel'
      })
        .then(() => {
          relieveScore(data.id)
            .then(({ msg }) => {
              this.$message.success(msg)
              this.getList(1)
            })
            .catch(() => { })
        })
        .catch(() => { })
    },
    onClose() {
      this.$reset()
    }
  }
}
</script>

<style  scoped lang="scss">
::v-deep .update-score {
  width: 650px !important;
}
.el-input-number {
  width: 200px;
}
.notice {
  color: #909399;
  font-size: 14px;
  margin-right: 20px;
  span{
    color: #e6a23c;
  }
}
</style>
