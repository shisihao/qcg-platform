<template>
  <div class="app-container">
    <div class="filter-container">
      <el-form :inline="true" :model="search">
        <el-form-item label="邀请账号">
          <el-input v-model="search.phone" placeholder="手机号" clearable @clear="getList(1)" @keyup.enter.native="getList(1)" />
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
        <el-button icon="el-icon-search" @click="getList(1)">
          {{ $t('table.search') }}
        </el-button>
      </el-form>
    </div>

    <el-table
      v-loading="loading"
      border
      :data="list"
      style="width: 80%"
    >
      <el-table-column
        prop="user_id"
        label="ID"
        width="80"
        align="center"
      />
      <el-table-column
        label="邀请账号"
        width="300"
        header-align="center"
        align="center"
      >
        <template slot-scope="{ row }">
          <div v-if="row.user_name">
            <el-avatar icon="el-icon-user-solid" style="vertical-align: top;" :src="row.user_avatar ? (domin + row.user_avatar) : ''" />
            <div style="display: inline-block;margin-left: 2px">
              <div>
                {{ row.user_name }}
              </div>
              <div>
                {{ row.user_phone }}
              </div>
            </div>
          </div>
          <div v-else>
            用户已删除
          </div>
        </template>
      </el-table-column>
      <el-table-column
        label="被邀请账号"
        width="300"
        header-align="center"
        align="center"
      >
        <template slot-scope="{ row }">
          <div v-if="row.target_name">
            <el-avatar icon="el-icon-user-solid" style="vertical-align: top;" :src="row.target_avatar ? (domin + row.target_avatar) : ''" />
            <div style="display: inline-block;margin-left: 2px">
              <div>
                {{ row.target_name }}
              </div>
              <div>
                {{ row.target_phone }}
              </div>
            </div>
          </div>
          <div v-else>
            用户已删除
          </div>
        </template>
      </el-table-column>
      <el-table-column
        label="奖励（元）"
        header-align="center"
        width="200"
        align="center"
      >
        <template slot-scope="{ row }">
          ¥{{ row.amount }}
        </template>
      </el-table-column>
      <el-table-column
        prop="created_at"
        label="时间"
        header-align="center"
        align="center"
      />

    </el-table>
    <pagination v-show="pages.total > 0" :total="pages.total" :page.sync="pages.current" :limit.sync="pages.limit" @pagination="getList()" />
  </div>
</template>

<script>
import { inviteList } from '@/api/coupon'
import { pickerOptions, pages } from '@/utils/explain'
import Pagination from '@/components/Pagination'
import { DominKey, getToken } from '@/utils/auth'
export default {
  name: 'Give',
  components: {
    Pagination
  },
  data() {
    return {
      domin: getToken(DominKey),
      list: [],
      dateRangeValue: [],
      pickerOptions,
      search: {
        phone: '',
        start_time: '',
        end_time: ''
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
      inviteList({ page, ...this.search, limit: this.pages.limit })
        .then(response => {
          this.list = response.data.data
          this.pages.total = response.data.total
        })
        .catch(() => {})
        .finally(() => {
          this.loading = false
        })
    },
    onChangeDateRange(value) {
      if (Array.isArray(value)) {
        this.search.start_time = value[0]
        this.search.end_time = value[1]
        this.getList(1)
      } else {
        this.search.start_time = this.search.end_time = ''
        this.getList(1)
      }
    }
  }
}
</script>
<style lang="scss" scoped>

</style>
