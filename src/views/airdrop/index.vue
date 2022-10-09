<template>
  <div class="app-container">
    <div class="filter-container">
      <el-form :inline="true" :model="search">
        <el-form-item label="批次ID">
          <el-input v-model="search.keywords" style="width: 240px" placeholder="批次ID" clearable @clear="getList(1)" @keyup.enter.native="getList(1)" />
        </el-form-item>
        <el-form-item>
          <el-button icon="el-icon-search" @click="getList(1)">
            {{ $t('table.search') }}
          </el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-plus" @click="onAddOrUpdate()">
            {{ $t('table.add') }}批次
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
        label="批次ID"
        width="55"
        align="center"
      />
      <el-table-column
        prop="title"
        label="批次标题"
        width="200"
        align="center"
      />
      <el-table-column
        prop="count"
        label="代金券张数"
        align="center"
      />
      <el-table-column
        prop="amount"
        label="单张面额（元）"
        align="center"
      />
      <el-table-column
        label="总计价值（元）"
        align="center"
      >
        <template slot-scope="{row}">
          <div>
            {{ row.count * row.amount }}
          </div>
        </template>
      </el-table-column>
      <el-table-column
        label="可用时间"
        width="250"
        header-align="center"
      >
        <template slot-scope="{row}">
          <ul>
            <li>开始时间{{ row.start_time }}</li>
            <li>结束时间{{ row.stop_time }}</li>
          </ul>
        </template>
      </el-table-column>
      <el-table-column
        label="已用张数"
        header-align="center"
        align="center"
      >
        <template slot-scope="{row}">
          {{ row.count - row.unused_count }}
        </template>
      </el-table-column>
      <el-table-column label="剩余可用张数" align="center" header-align="center" width="100" prop="unused_count" />
      <el-table-column label="创建时间" align="center" header-align="center" width="100" prop="created_at" />
      <el-table-column
        label="代金券规则说明"
        align="center"
        header-align="center"
        prop="usage_desc"
        width="300"
      />
      <el-table-column
        label="操作"
        width="300"
        align="center"
        fixed="right"
      >
        <template slot-scope="{ row }">
          <el-button type="primary" plain @click="onCouponDetail(row)">查看详情</el-button>
          <el-button type="success" plain @click="onCoupon(row)">空投</el-button>
          <el-button type="info" plain @click="onrecord(row)">空投记录</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="pages.total > 0" :total="pages.total" :page.sync="pages.current" :limit.sync="pages.limit" @pagination="getList()" />

    <add-or-update
      v-if="AddVisible"
      ref="addDetail"
      @refreshList="getList()"
    />
    <add-or-airdrop
      v-if="airdropVisible"
      ref="airdropDetail"
      @refreshList="getList()"
    />
    <add-or-details
      v-if="detailsVisible"
      ref="detailsDetail"
      @refreshList="getList()"
    />
    <add-or-record
      v-if="recordVisible"
      ref="recordDetail"
      @refreshList="getList()"
    />
  </div>
</template>

<script>
import AddOrUpdate from './components/AddOrUpdate'
import AddOrAirdrop from './components/AddOrAirdrop'
import AddOrDetails from './components/AddOrDetails'
import AddOrRecord from './components/AddOrRecord'
import Pagination from '@/components/Pagination'
import { dataList } from '@/api/coupon'
import { pages } from '@/utils/explain'
import { exportBatches } from '@/api/marketorder'

export default {
  name: 'Index',
  components: { Pagination, AddOrUpdate, AddOrAirdrop, AddOrDetails, AddOrRecord },
  data() {
    return {
      loading: false,
      downloadLoading: false,
      pages: Object.assign({}, pages),
      search: {
        keywords: ''
      },
      list: [],
      AddVisible: false,
      airdropVisible: false,
      detailsVisible: false,
      recordVisible: false
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
        .catch(() => { })
        .finally(() => {
          this.loading = false
        })
    },
    // 批次导出
    onHandleDownload() {
      this.downloadLoading = true
      exportBatches(this.search)
        .then((response) => {
          location.href = '/' + response.data.filename
        })
        .catch(() => { })
        .finally(() => {
          this.downloadLoading = false
        })
    },

    // 添加批次
    onAddOrUpdate() {
      this.AddVisible = true
      this.$nextTick(() => {
        this.$refs.addDetail && this.$refs.addDetail.init()
      })
    },
    //  空投
    onCoupon(data) {
      this.airdropVisible = true
      this.$nextTick(() => {
        this.$refs.airdropDetail && this.$refs.airdropDetail.init(data)
      })
    },
    //  查看详情
    onCouponDetail(data) {
      this.detailsVisible = true
      this.$nextTick(() => {
        this.$refs.detailsDetail && this.$refs.detailsDetail.init(data)
      })
    },
    //  空投记录
    onrecord(data) {
      this.recordVisible = true
      this.$nextTick(() => {
        this.$refs.recordDetail && this.$refs.recordDetail.init(data)
      })
    }
  }
}
</script>
<style lang="scss" scoped>
ul,li{list-style:none;}
</style>
