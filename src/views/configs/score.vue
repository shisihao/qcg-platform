<template>
  <div class="app-container">
    <el-row>
      <el-col :span="12">
        <h3>链上信用分配置</h3>
        <el-form ref="form" :model="form" :rules="rule" label-width="190px">
          <el-form-item label="解除限制天数" prop="forbid">
            <el-input-number v-model="form.forbid" :min="0" :precision="0" />
          </el-form-item>
          <el-form-item label="解除限制增加信用分" prop="remove">
            <el-input-number v-model="form.remove" :min="0" :precision="0" />
          </el-form-item>
          <el-form-item label="十分钟内付款增加信用分" prop="pay_add">
            <el-input-number v-model="form.pay_add" :min="0" :precision="0" />
          </el-form-item>
          <el-form-item label="十分钟内确认增加信用分" prop="confirm_add">
            <el-input-number v-model="form.confirm_add" :min="0" :precision="0" />
          </el-form-item>
          <el-form-item label="手动取消订单扣除信用分" prop="cancel_order">
            <el-input-number v-model="form.cancel_order" :min="0" :precision="0" />
          </el-form-item>
          <el-form-item label="自动取消订单扣除信用分" prop="auto_cancel_order">
            <el-input-number v-model="form.auto_cancel_order" :min="0" :precision="0" />
          </el-form-item>
          <el-form-item label="三十分钟未确认扣除信用分" prop="confirm_sub">
            <el-input-number v-model="form.confirm_sub" :min="0" :precision="0" />
          </el-form-item>
        </el-form>
      </el-col>
      <el-col :span="12">
        <h3>集市信用分配置</h3>
        <el-form ref="souce" :model="souce" :rules="rulesouce" label-width="250px">
          <el-form-item label="买家手动取消订单扣除信用分" prop="cancel_order">
            <el-input-number v-model="souce.cancel_order" :min="0" :precision="0" />
          </el-form-item>
          <el-form-item label="买家未付款自动取消订单扣除信用分" prop="auto_cancel_order">
            <el-input-number v-model="souce.auto_cancel_order" :min="0" :precision="0" />
          </el-form-item>
          <el-form-item label="买家十分钟内付款加信用分" prop="pay_add">
            <el-input-number v-model="souce.pay_add" :min="0" :precision="0" />
          </el-form-item>
          <el-form-item label="买家一小时内确认收货加信用分" prop="confirm_add">
            <el-input-number v-model="souce.confirm_add" :min="0" :precision="0" />
          </el-form-item>
          <el-form-item label="买家六小时内未确认收货，且未申请客服介入，扣信用分" prop="confirm_sub">
            <el-input-number v-model="souce.confirm_sub" :min="0" :precision="0" />
          </el-form-item>
          <el-form-item label="卖家一小时内确认发货加信用分" prop="transfer_add">
            <el-input-number v-model="souce.transfer_add" :min="0" :precision="0" />
          </el-form-item>
          <el-form-item label="卖家六小时内未发货扣除信用分" prop="transfer_sub">
            <el-input-number v-model="souce.transfer_sub" :min="0" :precision="0" />
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>

    <el-row style="margin-top: 100px" :gutter="12">
      <h3>通用配置</h3>
      <el-form ref="form" :model="form" :rules="rule" label-width="190px">
        <el-form-item label="解除限制天数" prop="forbid">
          <el-input-number v-model="form.forbid" :min="0" :precision="0" />
        </el-form-item>
        <el-form-item label="解除限制增加信用分" prop="remove">
          <el-input-number v-model="form.remove" :min="0" :precision="0" />
        </el-form-item>
      </el-form>
    </el-row>

    <el-row style="margin-top:50px">
      <el-form ref="form" :model="form" :rules="rule" label-width="190px">
        <el-form-item label="获取说明" prop="desc">
          <el-input v-model="form.desc" type="textarea" :rows="10" />
        </el-form-item>
        <el-form-item label="规则说明" prop="intro">
          <tinymce v-model="form.intro" :height="400" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :loading="btnLoading" @click="onFormSubmit">
            {{ $t('table.confirm') }}
          </el-button>
        </el-form-item>
      </el-form>
    </el-row>
  </div>
</template>
<script>
import { score, putScore } from '@/api/configs'
import { marketscore, marketputScore } from '@/api/marketplatform'
import Tinymce from '@/components/Tinymce/index'
export default {
  name: 'Score',
  components: { Tinymce },
  data() {
    return {
      form: {
        cancel_order: 0,
        remove: 0,
        forbid: 0,
        pay_add: 0,
        confirm_sub: 0,
        confirm_add: 0,
        auto_cancel_order: 0,
        intro: '',
        desc: ''
      },
      souce: {
        pay_add: '', // 10分钟支付奖励
        confirm_add: '', // 60分钟确认奖励
        confirm_sub: '',
        cancel_order: '', // 手动取消订单惩罚
        transfer_add: '', // 60分钟发货奖励
        transfer_sub: '',
        auto_cancel_order: '' // 自动取消订单惩罚
      },
      btnLoading: false,
      rule: {
        cancel_order: [{ required: true, message: '请输入取消订单扣除的信用分', trigger: 'blur' }],
        remove: [{ required: true, message: '请输入解除限制增加的信用分', trigger: 'blur' }],
        forbid: [{ required: true, message: '请输入解除限制天数', trigger: 'blur' }],
        desc: [{ required: true, message: '请输入解除限制增加的信用分', trigger: 'blur' }],
        intro: [{ required: true, message: '请输入内容', trigger: 'blur' }],
        confirm_sub: [{ required: true, message: '请输入内容', trigger: 'blur' }],
        confirm_add: [{ required: true, message: '请输入内容', trigger: 'blur' }],
        pay_add: [{ required: true, message: '请输入内容', trigger: 'blur' }],
        auto_cancel_order: [{ required: true, message: '请输入内容', trigger: 'blur' }]
      },
      //  集市
      rulesouce: {
        pay_add: [{ required: true, message: '请输入内容', trigger: 'blur' }],
        confirm_add: [{ required: true, message: '请输入内容', trigger: 'blur' }],
        confirm_sub: [{ required: true, message: '请输入内容', trigger: 'blur' }],
        cancel_order: [{ required: true, message: '请输入内容', trigger: 'blur' }],
        transfer_add: [{ required: true, message: '请输入内容', trigger: 'blur' }],
        transfer_sub: [{ required: true, message: '请输入内容', trigger: 'blur' }],
        auto_cancel_order: [{ required: true, message: '请输入内容', trigger: 'blur' }]
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
      score()
        .then(response => {
          this.form = response.data.value
        })
        .catch(() => {
        })
      marketscore()
        .then(response => {
          this.souce = response.data.value
        })
        .catch(() => {
        })
    },
    onFormSubmit() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          this.btnLoading = true
          Promise.all([putScore(this.form), marketputScore(this.souce)]).then((res) => {
            const { msg } = res[0]
            if (res[0].msg === res[1].msg) {
              this.$message.success(msg)
            } else {
              this.$message.warning(res[0].msg + res[1].msg)
            }
            this.getList()
          }).catch(() => {
          }).finally(() => {
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
    .notice {
        color: #909399;
        font-size: 12px;
    }
    .app-container {
        width: 100%;
    }
</style>
