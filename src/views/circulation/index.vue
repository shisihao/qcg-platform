<template>
  <div class="app-container">
    <div class="filter-container">
      <el-form :inline="true">
        <el-form-item label="赠送人">
          <el-input v-model="form.from_user" placeholder="请输入手机号" clearable @clear="getList(1)" @keyup.enter.native="getList(1)" />
        </el-form-item>
        <el-form-item label="受赠人">
          <el-input v-model="form.to_user	" placeholder="请输入手机号" clearable @clear="getList(1)" @keyup.enter.native="getList(1)" />
        </el-form-item>
        <el-form-item label="代金券ID">
          <el-input v-model="form.voucher_no" placeholder="ID" clearable @clear="getList(1)" @keyup.enter.native="getList(1)" />
        </el-form-item>
        <el-form-item label="时间">
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
      </el-form>
      <el-table
        v-loading="loading"
        border
        highlight-current-row
        :data="list"
      >
        <el-table-column
          prop="id"
          label="ID"
          width="80"
          align="center"
        />
        <el-table-column
          label="赠送人信息"
          align="center"
        >
          <template slot-scope="{row}">
            <div>
              <ul>
                <li>用户名:{{ row.from_user.name }}</li>
                <li>电话号:{{ row.from_user.phone }}</li>
              </ul>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          label="受赠人信息"
          align="center"
        >
          <template slot-scope="{row}">
            <div>
              <ul>
                <li>用户名:{{ row.to_user.name }}</li>
                <li>电话号:{{ row.to_user.phone }}</li>
              </ul>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          label="代金券信息"
          align="center"
        >
          <template slot-scope="{row}">
            <div>
              <ul>
                <li>代金券编号:{{ row.voucher.voucher_no }}</li>
                <li>代金券面额:{{ row.voucher.original_amount }}</li>
                <li>代金券开始时间:{{ row.voucher.start_time }}</li>
                <li>代金券结束时间:{{ row.voucher.stop_time }}</li>
                <li>代金券空投时间:{{ row.voucher.airdrop_time }}</li>
              </ul>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          prop="created_at"
          label="时间"
          align="center"
        />
      </el-table>
      <pagination v-show="pages.total > 0" :total="pages.total" :page.sync="pages.current" :limit.sync="pages.limit" @pagination="getList()" />
    </div>
  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
import { pickerOptions } from '@/utils/explain'
import { transfersList } from '@/api/coupon'
export default {
  name: 'Index',
  components: { Pagination },
  data() {
    return {
      form: {
        from_user: '',
        to_user: '',
        voucher_no: '',
        from_time: '',
        to_time: ''
      },
      loading: false,
      list: [],
      pickerOptions,
      start_time: '',
      end_time: '',
      dateRangeValue: [],
      pages: {
        total: 0,
        limit: 20,
        current: 1
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

    getList(page = this.pages.current, loading = true) {
      if (this.loading) return
      this.loading = loading
      if (page === 1) this.pages.current = page
      this.list = []
      transfersList({ page, ...this.form, limit: this.pages.limit })
        .then(response => {
          this.list = response.data.data
          this.pages.total = response.data.total
        })
        .catch(() => {})
        .finally(() => {
          this.loading = false
        })
    },
    // 时间
    onChangeDateRange(value) {
      if (Array.isArray(value)) {
        this.form.from_time = value[0]
        this.form.to_time	 = value[1]
      } else {
        this.form.from_time = this.form.to_time	 = ''
      }
    }
  }
}
</script>

<style scoped>
ul,li{list-style:none;}
</style>
