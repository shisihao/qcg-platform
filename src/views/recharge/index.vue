<template>
  <div class="app-container">
    <div class="filter-container">
      <el-form :inline="true" :model="search">
        <el-form-item label="订单号" prop="order_no">
          <el-input v-model="search.order_no" placeholder="订单号" clearable @clear="getList(1)" @keyup.enter.native="getList(1)" />
        </el-form-item>
        <el-form-item label="账号" prop="phone">
          <el-input v-model="search.phone" placeholder="账号" clearable @clear="getList(1)" @keyup.enter.native="getList(1)" />
        </el-form-item>
        <el-form-item label="充值类型">
          <el-select v-model="search.account_type" clearable placeholder="请选择" @change="getList(1)">
            <el-option v-for="item in payOptions" :key="item.value" :label="item.label" :value="item.value">
              <svg-icon v-show="item.value" :icon-class="item.value" /> {{ item.label }}
            </el-option>
          </el-select>
        </el-form-item>
        <!-- <el-form-item label="状态" style="margin-left: 10px">
          <el-radio-group v-model="search.status" size="mini" @change="getList(1)">
            <el-badge v-for="item in rechargeOptions" :key="item.value" class="badge-item">
              <el-radio-button :label="item.value">{{ item.label }}</el-radio-button>
            </el-badge>
          </el-radio-group>
        </el-form-item> -->
        <el-button icon="el-icon-search" @click="getList(1)">
          {{ $t('table.search') }}
        </el-button>
        <el-button :loading="downloadLoading" type="success" icon="el-icon-document" @click="onHandleDownload">
          {{ $t('table.export') }} Excel
        </el-button>
      </el-form>
    </div>
    <el-table
      v-loading="loading"
      :data="list"
      border
    >
      <el-table-column
        prop="id"
        label="ID"
        align="center"
        width="80"
      />
      <el-table-column
        min-width="150"
        prop="order_no"
        label="订单号"
        header-align="center"
      />
      <el-table-column
        label="用户信息"
        min-width="120"
        header-align="center"
      >
        <template slot-scope="{ row }">
          <el-avatar icon="el-icon-user-solid" style="vertical-align: top;" :src="row.avatar ? (domin + row.avatar) : ''" />
          <div style="display: inline-block;margin-left: 2px">
            <div>
              {{ row.user.name }}
            </div>
            <div>
              {{ row.user.phone || '-' }}
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        label="付款方式"
        align="center"
      >
        <template slot-scope="{row:{ account_type}}">
          <div><svg-icon :icon-class="account_type" /> {{ account_type | paraphrase(payOptions) }}</div>
        </template>
      </el-table-column>
      <el-table-column
        prop="amount"
        label="金额"
        align="center"
      >
        <template slot-scope="{ row }">
          <svg-icon icon-class="money" style="color: #e6a23c;" /> {{ row.amount }}
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        label="充值状态"
      >
        <template slot-scope="{row}">
          <el-tag :type="row.status | paraphrase(rechargeOptions,'value', 'type')">{{ row.status | paraphrase(rechargeOptions) }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        label="时间"
        width="180"
        header-align="center"
      >
        <template slot-scope="{row}">
          <div>
            创建：{{ row.created_at }}
          </div>
          <div>
            支付： {{ row.pay_time|| '-' }}
          </div>

        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="pages.total > 0" :total="pages.total" :page.sync="pages.current" :limit.sync="pages.limit" @pagination="getList()" />
  </div>
</template>

<script>
import { payOptions, pages } from '@/utils/explain'
import Pagination from '@/components/Pagination'
import { dataList, exportRecharge } from '@/api/rechange'
import { DominKey, getToken } from '@/utils/auth'

export default {
  name: 'Recharge',
  components: { Pagination },
  data() {
    return {
      domin: getToken(DominKey),
      list: [],
      search: {
        status: '',
        phone: '',
        account_type: '',
        order_no: ''
      },
      loading: false,
      downloadLoading: false,
      rechargeOptions: [
        { label: '全部', value: '' },
        { label: '待支付', value: 0, type: 'info' },
        { label: '成功', value: 1, type: 'success' },
        { label: '失败', value: 2, type: 'danger' }
      ],
      payOptions: payOptions.filter(v => !['', 'bank'].includes(v.value)),
      pages: { ...pages }
    }
  },
  created() {
    this.init()
  },
  methods: {
    init() {
      this.getList()
    },
    getList(page = this.pages.current, loading = true) {
      if (this.loading) return
      this.loading = loading
      if (page === 1) this.pages.current = page
      dataList({ page, ...this.search, limit: this.pages.limit })
        .then(response => {
          this.list = response.data.data
          this.pages.total = response.data.total
        })
        .catch(() => {})
        .finally(() => {
          this.loading = false
        })
    },
    onHandleDownload() {
      this.downloadLoading = true
      exportRecharge(this.search)
        .then(response => {
          location.href = '/' + response.data.filename
        })
        .catch(_ => {})
        .finally(_ => {
          this.downloadLoading = false
        })
    }
  }
}
</script>

<style lang="scss"  scoped>
  ::v-deep .badge-item {
    .el-badge__content {
      transform: translateY(-50%) translateX(50%);
      z-index: 1;
    }
    .el-radio-button:first-child .el-radio-button__inner {
      border-radius: 0;
      border-left: 0;
    }
    &:first-child .el-radio-button:first-child .el-radio-button__inner {
      border-left: 1px solid #DCDFE6;
      border-radius: 4px 0 0 4px;
    }
    &:last-child .el-radio-button:first-child .el-radio-button__inner {
      border-radius: 0 4px 4px 0;
    }
  }
</style>
