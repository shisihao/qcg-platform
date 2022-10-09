<template>
  <el-dialog title="批次详情" :visible.sync="visible" width="80%" @closed="onClose()">
    <div class="app-container">
      <h4>当前批次：{{ title }}</h4>
      <div class="filter-container">
        <el-form ref="form" :inline="true" :model="search">
          <el-form-item label="代金券ID">
            <el-input v-model="search.voucher_no" style="width: 240px" placeholder="输入代金券ID" clearable @clear="getList(1)" @keyup.enter.native="getList(1)" />
          </el-form-item>
          <el-form-item>
            <el-select v-model="search.type" clearable @change="getList(1)">
              <el-option v-for="item in typeOptions" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
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
          prop="voucher_no"
          label="代金券ID"
          width="155"
          align="center"
        />
        <el-table-column
          label="面额（元）"
          width="200"
          prop="original_amount"
          header-align="center"
          align="center"
        />
        <el-table-column
          label="当前绑定用户"
          header-align="center"
          align="center"
        >
          <template slot-scope="{row}">
            <div v-if="row.user">
              <ul>
                <li>用户名:{{ row.user.name }}</li>
                <li>电话号:{{ row.user.phone }}</li>
              </ul>
            </div>
            <div v-else>待绑定</div>
          </template>
        </el-table-column>
        <el-table-column
          prop="amount"
          label="剩余金额（元）"
          header-align="center"
          align="center"
        />
        <el-table-column
          label="可用时间"
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
          label="空投时间"
          header-align="center"
          width="150"
          align="center"
        >
          <template slot-scope="{row}">
            <div v-if="row.airdrop_time">{{ row.airdrop_time }}</div>
            <div v-else>待空投</div>
          </template>
        </el-table-column>
      </el-table>
      <pagination v-show="pages.total > 0" :total="pages.total" :page.sync="pages.current" :limit.sync="pages.limit" @pagination="getList()" />
    </div>
  </el-dialog>
</template>

<script>
import Pagination from '@/components/Pagination'
import { couponList } from '@/api/coupon'
import { pages } from '@/utils/explain'
import { exportVouchers } from '@/api/marketorder'

export default {
  name: 'Index',
  components: { Pagination },
  data() {
    return {
      visible: false,
      loading: false,
      downloadLoading: false,
      pages: Object.assign({}, pages),
      search: {
        batch_id: '',
        voucher_no: '',
        type: ''
      },
      title: '',
      typeOptions: [
        { label: '全部', value: '' },
        { label: '未绑定', value: 1, type: 'primary' },
        { label: '已绑定', value: 2, type: 'info' }
      ],
      list: [],
      AddVisible: false,
      airdropVisible: false
    }
  },
  created() {
    this.init()
  },
  methods: {
    init(data) {
      if (data) {
        this.visible = true
        this.search.batch_id = data.id
        this.title = data.title
        this.getList(1)
      }
    },
    getList(page = this.pages.current, loading = true) {
      if (this.loading) return
      this.loading = loading
      if (page === 1) this.pages.current = page
      couponList({ page, ...this.search, limit: this.pages.limit })
        .then(response => {
          this.list = response.data.data.data
          this.pages.total = response.data.data.total
        })
        .catch(() => { })
        .finally(() => {
          this.loading = false
        })
    },

    // 代金券导出
    onHandleDownload() {
      this.downloadLoading = true
      exportVouchers(this.search)
        .then((response) => {
          location.href = '/' + response.data.filename
        })
        .catch(() => { })
        .finally(() => {
          this.downloadLoading = false
        })
    },
    onClose() {
      this.$reset()
    }
  }
}
</script>
<style lang="scss" scoped>
ul,li{list-style:none;}
</style>
