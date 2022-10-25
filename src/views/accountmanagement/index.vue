<template>
  <div class="app-container">
    <div class="filter-container">
      <el-form :inline="true" :model="search">
        <el-form-item label="状态" style="margin-left: 10px">
          <el-radio-group v-model="search.status" size="mini" @change="getList(1)">
            <el-badge v-for="item in statusAccount" :key="item.value" :value="item.value === 0 && wait_count > 0 ? wait_count : ''" class="badge-item">
              <el-radio-button :label="item.value">{{ item.label }}</el-radio-button>
            </el-badge>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="账单时间">
          <el-date-picker
            v-model="dateRangeValue"
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
        <el-form-item>
          <el-button icon="el-icon-search" @click="getList(1)">
            {{ $t('table.search') }}
          </el-button>
        </el-form-item>
        <el-form-item>
          <el-button :loading="downloadLoading" type="success" icon="el-icon-document" @click="onHandleDownload">
            {{ $t('table.export') }} Excel
          </el-button>
        </el-form-item>
      </el-form>
    </div>

    <el-table
      v-loading="loading"
      border
      :data="list"
    >
      <el-table-column
        prop="id"
        label="ID"
        width="80"
        align="center"
      />
      <el-table-column
        label="账单号"
        min-width="40"
        header-align="center"
        align="center"
        prop="bill_no"
      />
      <el-table-column
        label="生成时间"
        min-width="20"
        header-align="center"
        prop="created_at"
        align="center"
      />
      <el-table-column
        label="月份"
        min-width="10"
        header-align="center"
        prop="month"
        align="center"
      />
      <el-table-column
        label="账单信息"
        min-width="20"
        header-align="center"
      >
        <template slot-scope="{row}">
          <ul>
            <li>手续费奖励金额：{{ row.charge_fee }}元</li>
            <li>版权费奖励:{{ row.copyright_fee }}元</li>
            <li style="margin-top: 20px">总计：{{ row.total_fee }}元</li>
          </ul>
        </template>
      </el-table-column>
      <el-table-column
        prop="price"
        label="我的公户信息"
        min-width="20"
      >
        <template slot-scope="{row}">
          <ul v-if="row.bank_info">
            <li>收款户名：{{ row.bank_info.account_name }}</li>
            <li>开户银行:{{ row.bank_info.account_no }}</li>
            <li>账号:{{ row.bank_info.bank_name }}</li>
          </ul>
          <ul v-else>
            <li>收款户名：-</li>
            <li>开户银行:-</li>
            <li>账号:-</li>
          </ul>
        </template>
      </el-table-column>
      <el-table-column
        label="状态"
        width="140"
        align="center"
      >
        <template slot-scope="{row}">
          <el-tag :effect="row.status === 3 ? 'plain' : 'light'" :type="row.status | paraphrase(statusAccount, 'value', 'type')">
            {{ row.status | paraphrase(statusAccount) }}
          </el-tag>
          <div v-if="row.status === 3">
            <el-popover placement="bottom-start" max-width="300" trigger="hover">
              <div>
                {{ row.reason || '' }}
              </div>
              <div slot="reference">
                驳回原因<i class="el-icon-question" />
              </div>
            </el-popover>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        width="140"
        align="center"
      >
        <template slot-scope="{row}">
          <el-button v-if="row.status === 0 || row.status === 3" @click="onAddOrUpdate(row)">立即申请</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="pages.total > 0" :total="pages.total" :page.sync="pages.current" :limit.sync="pages.limit" @pagination="getList()" />

    <add-or-update
      v-if="AddVisible"
      ref="addDetail"
      @refreshList="getList()"
    />
  </div>
</template>

<script>
import { pickerOptions, pages, statusAccount } from '@/utils/explain'
import Pagination from '@/components/Pagination'
import { DominKey, getToken } from '@/utils/auth'
import { billsList, exportAccount } from '@/api/account'
import AddOrUpdate from './components/AddOrUpdate'

export default {
  name: 'Accountmanagement',
  components: {
    Pagination,
    AddOrUpdate
  },
  data() {
    return {
      downloadLoading: false,
      AddVisible: false,
      statusAccount,
      list: [],
      dateRangeValue: [],
      pickerOptions,
      domin: getToken(DominKey),
      wait_count: 0,
      search: {
        status: '',
        from_time: '',
        to_time: ''
      },
      pages: Object.assign({}, pages),
      loading: false
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
      billsList({ page, ...this.search, limit: this.pages.limit })
        .then(response => {
          this.list = response.data.data
          this.pages.total = response.data.total
        })
        .catch(() => {})
        .finally(() => {
          this.loading = false
        })
    },
    onAddOrUpdate(row) {
      this.AddVisible = true
      this.$nextTick(() => {
        this.$refs.addDetail && this.$refs.addDetail.init(row)
      })
    },
    onHandleDownload() {
      this.downloadLoading = true
      exportAccount(this.search)
        .then((response) => {
          location.href = '/' + response.data.filename
        })
        .catch(() => { })
        .finally(() => {
          this.downloadLoading = false
        })
    },
    onChangeDateRange(value) {
      if (Array.isArray(value)) {
        this.search.from_time = value[0]
        this.search.to_time = value[1]
      } else {
        this.search.from_time = this.search.to_time = ''
        this.getList(1)
      }
    }
  }
}
</script>
<style lang="scss" scoped>
ul,li{
  list-style: none;
}
</style>
