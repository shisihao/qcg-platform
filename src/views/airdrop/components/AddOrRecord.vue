<template>
  <el-dialog title="空投记录" :visible.sync="visible" width="80%" @closed="onClose()">
    <div class="app-container">
      <div class="filter-container">
        <el-form ref="form" :inline="true" :model="search">
          <el-form-item>
            <el-select v-model="search.status" clearable @change="getList(1)">
              <el-option v-for="item in typeOptions" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
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
          width="155"
          align="center"
        />
        <el-table-column
          label="代金券ID"
          width="200"
          header-align="center"
          align="center"
        >
          <template slot-scope="{row}">
            <div v-if="row.status === 0">
              -
            </div>
            <div v-else>
              {{ row.voucher.voucher_no }}
            </div>
          </template>
        </el-table-column>

        <el-table-column
          prop="images"
          align="center"
          label="空投用户"
          header-align="center"
        >
          <template slot-scope="{row}">
            <div v-if="row.status === 1">
              <ul>
                <li>用户名:{{ row.user.name }}</li>
                <li>电话号:{{ row.user.phone }}</li>
              </ul>
            </div>
            <div v-else>电话号:{{ row.phone }}</div>
          </template>
        </el-table-column>
        <el-table-column
          label="空投时间"
          align="center"
          prop="created_at"
          header-align="center"
        />
        <el-table-column
          label="空投说明"
          align="center"
          header-align="center"
          prop="desc"
        />
      </el-table>
      <pagination v-show="pages.total > 0" :total="pages.total" :page.sync="pages.current" :limit.sync="pages.limit" @pagination="getList()" />
    </div>
  </el-dialog>
</template>

<script>
import Pagination from '@/components/Pagination'
import { recordList } from '@/api/coupon'
import { pages } from '@/utils/explain'
import { exportAirdrops } from '@/api/marketorder'

export default {
  name: 'Index',
  components: { Pagination },
  data() {
    return {
      visible: false,
      loading: false,
      downloadLoading: false,
      pages: Object.assign({}, pages),
      form: {
      },
      search: {
        batch_id: '',
        status: 1
      },
      typeOptions: [
        { label: '成功记录', value: 1, type: 'primary' },
        { label: '失败记录', value: 0, type: 'info' }
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
        this.getList()
      }
    },
    getList(page = this.pages.current, loading = true) {
      if (this.loading) return
      this.loading = loading
      if (page === 1) this.pages.current = page
      recordList({ page, ...this.search, limit: this.pages.limit })
        .then(response => {
          this.list = response.data.data
          this.pages.total = response.data.total
        })
        .catch(() => { })
        .finally(() => {
          this.loading = false
        })
    },
    // 空投导出
    onHandleDownload() {
      this.downloadLoading = true
      exportAirdrops(this.search)
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
