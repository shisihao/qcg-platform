<template>
  <div>
    <el-dialog class="el-dialog-wallet" title="资产流水详情" top="30px" :visible.sync="visible" @closed="onClose()">
      <el-row style="margin-bottom: 10px;">
        <el-col :span="12">
          <span>
            当前用户：
            <el-avatar class="user-avatar" icon="el-icon-user-solid" size="small" :src="datas.avatar && domin + datas.avatar" />
            {{ datas.name }}
          </span>
          <el-divider direction="vertical" />
          {{ datas.phone || datas.email }}
        </el-col>
      </el-row>
      <el-tabs v-model="activeName" type="card">
        <el-tab-pane label="钱包资产" name="first">
          <el-collapse v-model="activeNames">
            <el-collapse-item name="1">
              <template slot="title">
                <span style="color: #409eff;">{{ `${collapseTitle ? '收起' : '展开' }资产详情` }}</span>
              </template>
              <div v-for="(item, index) in walletDetail" :key="index">
                <el-divider content-position="left"> {{ item.currency | paraphrase(payTypeOptions) }} </el-divider>
                <el-row>
                  <el-col :span="6">剩余：{{ item.balance || 0 | cutZero }}</el-col>
                  <el-col :span="6">收入：{{ item.income || 0 | cutZero }}</el-col>
                  <el-col :span="6">冻结：{{ item.frozen || 0 | cutZero }}</el-col>
                  <el-col :span="6">支出：{{ item.expend || 0 | cutZero }}</el-col>
                </el-row>
              </div>
            </el-collapse-item>
            <p />
            <div class="filter-container">
              <el-form :inline="true" :model="search">
                <el-form-item label="收支">
                  <el-select v-model="search.action" clearable @change="getList(1)" @clear="getList(1)">
                    <el-option v-for="item in actionOptions" :key="item.value" :label="item.label" :value="item.value" />
                  </el-select>
                </el-form-item>
                <el-form-item label="资产类型">
                  <el-select v-model="search.currency" @clear="getList(1)" @change="getList(1)">
                    <el-option v-for="item in payTypeOptions" :key="item.value" :label="item.label" :value="item.value" />
                  </el-select>
                </el-form-item>
                <el-form-item label="流水类型">
                  <el-select v-model="search.type" @clear="getList(1)" @change="getList(1)">
                    <el-option v-for="item in typeOptions" :key="item.value" :label="item.label" :value="item.value" />
                  </el-select>
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
                <el-button icon="el-icon-search" @click="getList(1)">
                  {{ $t('table.search') }}
                </el-button>
              </el-form>
            </div>

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
                prop="title"
                label="标题"
                align="center"
              />
              <el-table-column
                prop="amount"
                label="余额"
                align="center"
              >
                <template slot-scope="{ row }">
                  {{ row.amount | cutZero }}
                </template>
              </el-table-column>
              <el-table-column
                prop="action"
                label="收支类型"
                align="center"
              >
                <template slot-scope="{ row }">
                  <el-tag :type="row.action === 1 ? 'primary' : 'danger'"> {{ row.action | paraphrase(actionOptions) }}</el-tag>
                </template>
              </el-table-column>
              <el-table-column
                prop="currency"
                label="资产类型"
                align="center"
              >
                <template slot-scope="{ row }">
                  <el-tag> {{ row.currency | paraphrase(payTypeOptions) }}</el-tag>
                </template>
              </el-table-column>
              <el-table-column
                label="流水类型"
                align="center"
              >
                <template slot-scope="{ row }">
                  <el-tag> {{ row.type | paraphrase(typeOptions) }}</el-tag>
                </template>
              </el-table-column>
              <el-table-column
                prop="created_at"
                label="创建时间"
                width="140"
                align="center"
              />
            </el-table>
            <pagination v-show="pages.total > 0" :total="pages.total" :page.sync="pages.current" :limit.sync="pages.limit" @pagination="getList()" />
          </el-collapse>
        </el-tab-pane>
        <el-tab-pane label="手续费代金券" name="second">
          <coupon ref="coupon" :user_id="search.user_id" />
        </el-tab-pane>
      </el-tabs>
    </el-dialog>

  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
import { wallet, walletList } from '@/api/user'
import { DominKey, getToken } from '@/utils/auth'
import { pickerOptions, payTypeOptions } from '@/utils/explain'
import Coupon from './Coupon'
export default {
  name: 'Wallet',
  components: { Pagination, Coupon },
  data() {
    return {
      activeName: 'first',
      domin: getToken(DominKey),
      visible: false,
      payTypeOptions,
      typeOptions: [
        { label: '全部', value: '' },
        { label: '购买商品', value: 'goods' },
        { label: '退款', value: 'refund' },
        { label: '提现', value: 'withdrawal' },
        { label: '发售版权费', value: 'copyright_fee' },
        { label: '发售手续费', value: 'charge_fee' },
        { label: '充值', value: 'recharge' },
        { label: '诚信金', value: 'deposit_fee' },
        { label: '云账户开户', value: 'sand' },
        { label: '集市冻结保证金', value: 'ma_freeze_fee' },
        { label: '集市扣除诚信金', value: 'ma_deduct_fee' },
        { label: '邀请奖励', value: 'rebate' }
      ],
      datas: {
        id: 0,
        name: '',
        phone: '',
        email: '',
        avatar: ''
      },
      list: [],
      search: {
        currency: '',
        action: '',
        type: '',
        start_time: '',
        end_time: '',
        user_id: ''
      },
      pages: {
        total: 0,
        limit: 20,
        current: 1
      },
      actionOptions: [
        { label: '全部', value: '' },
        { label: '收入', value: 1 },
        { label: '支出', value: 2 }
      ],
      walletDetail: [],
      dateRangeValue: [],
      activeNames: ['0'],
      collapseTitle: 0,
      pickerOptions,
      loading: false
    }
  },
  watch: {
    activeNames(val, oldVal) { // 普通的watch监听
      this.collapseTitle = val.length - 1
    }
  },
  methods: {
    init(data) {
      this.visible = true
      this.$nextTick(() => {
        this.$refs.coupon && this.$refs.coupon.init()
      })
      if (data) {
        this.datas = data
        this.search.user_id = data.id
        this.getList()
        this.wallets()
      }
    },
    getList(page = this.pages.current, loading = true) {
      if (this.loading) return
      this.loading = loading
      if (page === 1) this.pages.current = page
      this.list = []
      walletList({ user_id: this.datas.id, page, ...this.search, limit: this.pages.limit })
        .then(response => {
          this.list = response.data.data
          this.pages.total = response.data.total
        })
        .catch(() => {})
        .finally(() => {
          this.loading = false
        })
    },
    wallets() {
      wallet({ uid: this.datas.id })
        .then(response => {
          this.walletDetail = response.data
        })
    },
    onChangeDateRange(value) {
      if (Array.isArray(value)) {
        this.search.start_time = value[0]
        this.search.end_time = value[1]
      } else {
        this.search.start_time = this.search.end_time = ''
        this.getList(1)
      }
    },
    onClose() {
      this.$reset('data', false)
      this.$nextTick(() => {
        this.$refs.coupon && this.$refs.coupon.offClose()
      })
    }

  }
}
</script>

<style lang="scss" scoped>
::v-deep .el-dialog-wallet .el-dialog {
  width: 1240px;
}
</style>
