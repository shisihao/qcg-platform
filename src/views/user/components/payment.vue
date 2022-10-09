<template>
  <el-dialog :title="`用户 ${row.name} 的收款方式`" :visible.sync="visible" @closed="onClose()">
    <el-empty v-if="!list.length" v-loading="loading" description="暂无数据" />
    <div v-else>
      <el-descriptions v-for="(item, index) in list" :key="index" size="medium" :column="1">
        <template slot="title">
          <svg-icon :icon-class="item.account_type" />{{ item.account_type | paraphrase(payOptions) }}
        </template>
        <el-descriptions-item label="姓名"> {{ item.name || '-' }}</el-descriptions-item>
        <el-descriptions-item label="账号">{{ item.account || '-' }}</el-descriptions-item>
        <el-descriptions-item v-if="item.qr_code" label="收款码">
          <el-image
            class="image-item"
            fit="contain"
            :src="item.qr_code && domin + item.qr_code"
            :preview-src-list="[domin + item.qr_code]"
          >
            <div slot="error" class="image-slot">
              <i class="el-icon-picture-outline" />
            </div>
          </el-image>
        </el-descriptions-item>
        {{ item.deposit_bank }}
        <el-descriptions-item v-if="item.deposit_bank" label="开户行">{{ item.deposit_bank || '-' }}</el-descriptions-item>
      </el-descriptions>
    </div>
  </el-dialog>
</template>
<script>
import { payment } from '@/api/user'
import { payOptions } from '@/utils/explain'
import { getToken, DominKey } from '@/utils/auth'

export default {
  name: 'Payment',
  data() {
    return {
      domin: getToken(DominKey),
      visible: false,
      loading: false,
      row: {},
      list: [],
      payOptions
    }
  },
  methods: {
    init(data) {
      this.visible = true
      if (data) {
        this.row = data
        this.getAddress(data.id)
      }
    },
    getAddress(id) {
      this.loading = true
      payment(id)
        .then(response => {
          this.list = response.data
        })
        .finally(() => {
          this.loading = false
        })
    },
    onClose() {
      this.$reset('', false)
    }
  }
}
</script>

<style  lang="scss" scoped>
  .image-item {
    flex-shrink: 0;
    width: 60px;
    height: 60px;
    display: flex;
    align-items: center;
    img {
      height: auto;
    }
    ::v-deep .image-slot {
      font-size: 30px;
      display: flex;
      justify-content: center;
      align-items: center;
      width: 100%;
      height: 100%;
      background: #f5f7fa;
      color: #909399;
    }
  }
</style>
