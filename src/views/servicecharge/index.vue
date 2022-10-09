<template>
  <div class="app-container">
    <div class="filter-container">
      <el-form :inline="true" :model="search">
        <el-form-item label="藏品名称">
          <el-input v-model="search.keywords" placeholder="ID/手机号/钱包地址" clearable @clear="getList(1)" @keyup.enter.native="getList(1)" />
        </el-form-item>
        <el-form-item label="订单类型" style="margin-left: 10px">
          <el-radio-group v-model="search.order_type" size="mini" @change="getList(1)">
            <el-badge v-for="item in statusOptions" :key="item.value" :value="item.value === 0 && wait_count > 0 ? wait_count : ''" class="badge-item">
              <el-radio-button :label="item.value">{{ item.label }}</el-radio-button>
            </el-badge>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="创建时间">
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
    <h3>搜索结果奖励金额总计：{{ rebate_fee }} 元</h3>
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
        label="平台方"
        min-width="120"
        header-align="center"
        align="center"
      >
        <template slot-scope="{row}">
          <div v-if="row.issuer">
            {{row.issuer.name}}
          </div>
          <div v-else>
            {{ row.platform? row.platform.name+"科技有限公司":row.ma_platform.alias+"科技有限公司" }}
          </div>
        </template>
      </el-table-column>
      <el-table-column
        label="奇藏果订单号"
        min-width="200"
        header-align="center"
        prop="order_no"
        align="center"
      />
      <el-table-column
        label="藏品名称"
        min-width="200"
        header-align="center"
        prop="title"
        align="center"
      />
      <el-table-column
        label="订单类型"
        width="180"
        header-align="center"
        align="center"
      >
        <template slot-scope="{ row }">
          <div v-if="row.issuer">链上闪汇订单</div>
          <div v-else> {{ row.platform? "链上寄售订单":"集市订单" }}</div>
        </template>
      </el-table-column>
      <el-table-column
        prop="price"
        label="订单金额（元）"
        width="140"
        align="center"
      />
      <el-table-column
        prop="fee"
        label="手续费（元）"
        width="140"
        align="center"
      />
      <el-table-column
        label="手续费奖励比例"
        width="140"
        align="center"
      >
        <template slot-scope="{ row }">

          {{ row.rebate_percentage }}%
        </template>
      </el-table-column>
      <el-table-column
        prop="rebate_fee"
        label="奖励（元）"
        width="140"
        align="center"
      />
      <el-table-column
        prop="created_at"
        label="时间"
        width="140"
        align="center"
      />
    </el-table>
    <pagination v-show="pages.total > 0" :total="pages.total" :page.sync="pages.current" :limit.sync="pages.limit" @pagination="getList()" />
  </div>
</template>

<script>
import { pickerOptions, pages } from '@/utils/explain'
import Pagination from '@/components/Pagination'
import { DominKey, getToken } from '@/utils/auth'
import { serviceList, exportService } from '@/api/order'

export default {
  name: 'ServiceCharge',
  components: {
    Pagination
  },
  data() {
    return {
      downloadLoading: false,
      list: [],
      rebate_fee: '',
      dateRangeValue: [],
      pickerOptions,
      domin: getToken(DominKey),
      wait_count: 0,
      search: {
        keywords: '',
        order_type: '',
        rebate_type: 1,
        from_time: '',
        to_time: ''
      },
      statusOptions: [
        { label: '全部', value: '' },
        { label: '链上订单', value: 1 },
        { label: '集市订单', value: 2 }
      ],
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
      serviceList({ page, ...this.search, limit: this.pages.limit })
        .then(response => {
          this.list = response.data.list.data
          this.rebate_fee = response.data.rebate_fee
          this.pages.total = response.data.list.total
        })
        .catch(() => {})
        .finally(() => {
          this.loading = false
        })
    },
    onHandleDownload() {
      this.downloadLoading = true
      exportService(this.search)
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

</style>
