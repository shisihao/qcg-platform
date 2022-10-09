<template>
  <div class="app-container">
    <div class="filter-container">
      <el-form :inline="true" :model="search">
        <el-form-item label="账号">
          <el-input v-model="search.account" placeholder="账号" clearable @clear="getList(1)" @keyup.enter.native="getList(1)" />
        </el-form-item>
        <el-form-item label="支付类型">
          <el-select v-model="search.account_type" clearable @change="getList(1)">
            <el-option v-for="item in payOptions" :key="item.value" :label="item.label" :value="item.value">
              <svg-icon v-show="item.value" :icon-class="item.value" /> {{ item.label }}
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="展示今日提现">
          <el-select v-model="search.is_today" clearable @change="getList(1)">
            <el-option v-for="item in whetherOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
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
        <el-form-item label="状态" style="margin-left: 10px">
          <el-radio-group v-model="search.status" size="mini" @change="getList(1)">
            <el-badge v-for="item in verifyStatusOptions" :key="item.value" :value="item.value === 0 && wait_count > 0 ? wait_count : ''" class="badge-item">
              <el-radio-button :label="item.value">{{ item.label }}</el-radio-button>
            </el-badge>
          </el-radio-group>
        </el-form-item>
        <el-button icon="el-icon-search" @click="getList(1)">
          {{ $t("table.search") }}
        </el-button>
        <el-button :loading="downloadLoading" type="success" icon="el-icon-document" @click="onHandleDownload">
          {{ $t('table.export') }} Excel
        </el-button>
        <el-button type="success" icon="el-icon-document" @click="onHandleRechargeDownload">
          {{ $t('table.export') }}线下充值 Excel
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
        label="提现用户"
        min-width="200"
        header-align="center"
      >
        <template slot-scope="{ row }">
          <div v-if="row.user">
            <el-avatar :key="row.user.id" icon="el-icon-user-solid" style="vertical-align: top;" :src="row.user.avatar ? (domin + row.user.avatar) : ''" />
            <div style="display: inline-block;margin-left: 2px">
              <div>
                #{{ row.user.id }}<el-divider direction="vertical" />{{ row.user.name }}
                <span v-if="row.user.certification">
                  <el-divider direction="vertical" />
                  <el-tag effect="plain">{{ row.user.certification.name }}</el-tag>
                </span>
              </div>
              <div>
                {{ row.user.phone || row.user.email }}
              </div>
              <div />
            </div>
          </div>
          <div v-else>
            用户已删除
          </div>
        </template>
      </el-table-column>
      <el-table-column
        label="提现相关"
        min-width="150"
        header-align="center"
      >
        <template slot-scope="{ row: { withdraw_balance, amount, service_charge, account_amount } }">
          <div>余额: {{ withdraw_balance }}</div>
          <div>提现金额: {{ amount }}</div>
          <div>服务费: {{ service_charge }}</div>
          <div>实际到账: {{ account_amount }}</div>
        </template>
      </el-table-column>
      <el-table-column
        label="收款类型"
        header-align="center"
      >
        <template slot-scope="{ row: { account_type, account_info } }">
          <el-popover
            placement="bottom-start"
            trigger="hover"
            popper-class="popover-box popover-top"
          >
            <div>
              <div><svg-icon :icon-class="account_type" /> {{ account_type | paraphrase(payOptions) }}</div>
              <div>{{ account_info.name }}</div>
              <div>{{ account_info.account }}</div>
              <div v-show="account_info.qr_code">
                <el-image class="img-item" fit="cover" :src="account_info.qr_code && domin + account_info.qr_code" :preview-src-list="[account_info.qr_code && domin + account_info.qr_code]" />
              </div>
              <div v-show="account_info.deposit_bank">{{ account_info.deposit_bank }}</div>
            </div>
            <div slot="reference" style="display: inline-block;"><svg-icon :icon-class="account_type" /> {{ account_type | paraphrase(payOptions) }} <i class="el-icon-zoom-in" /></div>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column
        label="订单编号"
        width="300"
        header-align="center"
      >
        <template slot-scope="{ row: { account_type, order_no, transaction_info } }">
          <ul class="data-info">
            <li>
              <div>内部订单：</div>
              <div>{{ order_no }}</div>
            </li>
            <li v-if="account_type === 'bank' && transaction_info">
              <template  v-if="transaction_info._qcg_is_sand_pay">
                <div>杉德订单：</div>
                <div>{{transaction_info.sandSerial}}</div>
              </template>
           <template v-else>
             <div >京东订单：</div>
             <div>{{ transaction_info && transaction_info.orderNum }}</div>
           </template>
            </li>
          </ul>
        </template>
      </el-table-column>
      <el-table-column
        label="状态"
        align="center"
        width="70"
      >
        <template slot-scope="{ row: { status, reason, handler } }">
          <div v-if="status === 2">
            <el-popover
              placement="bottom-start"
              max-width="300"
              trigger="hover"
              :content="reason"
            >
              <el-tag slot="reference" :type="status | paraphrase(verifyStatusOptions, 'value', 'type')"> {{ status | paraphrase(verifyStatusOptions) }} <i class="el-icon-info" /></el-tag>
            </el-popover>
          </div>
          <div v-else>
            <el-tag :type="status | paraphrase(verifyStatusOptions, 'value', 'type')"> {{ status | paraphrase(verifyStatusOptions) }} </el-tag>
          </div>

          <div v-if="handler">
            <el-popover
              placement="bottom-start"
              max-width="300"
              trigger="hover"
            >
              <div>
                <div>
                  # {{ handler.id }}
                </div>
                <div>
                  {{ handler.name }}
                </div>
              </div>
              <div slot="reference">
                审核人<i class="el-icon-question" />
              </div>
            </el-popover>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        label="时间"
        align="center"
        width="170"
      >
        <template slot-scope="{ row: { created_at, updated_at } }">
          <div>创建: {{ created_at }}</div>
          <div>更新: {{ updated_at }}</div>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        fixed="right"
        width="150"
        align="center"
      >
        <template slot-scope="{ row }">
          <div v-if="row.status === 0">
            <el-button type="success" @click="onStatusWithdraw(row, 1)">通过</el-button>
            <el-button type="danger" @click="onStatusWithdraw(row, 2)">驳回</el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="pages.total > 0" :total="pages.total" :page.sync="pages.current" :limit.sync="pages.limit" @pagination="getList()" />

    <!-- 弹窗, 新增 / 修改 -->
    <status-withdraw
      v-if="statusWithdrawVisible"
      ref="statusWithdraw"
      @refreshList="getList()"
    />
    <!-- 导出线下充值 -->
    <rechange-download
      v-if="rechangeDownloadVisible"
      ref="rechangeDownload"
    />
  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
import { getToken, DominKey } from '@/utils/auth'
import StatusWithdraw from './components/StatusWithdraw'
import { pages, pickerOptions, verifyStatusOptions, payOptions, whetherOptions } from '@/utils/explain'
import { dataList, exportWithdrawalsExcel } from '@/api/withdrawal'
import rechangeDownload from './components/rechangeDownload'

export default {
  name: 'Withdrawals',
  components: { Pagination, StatusWithdraw, rechangeDownload },
  data() {
    return {
      domin: getToken(DominKey),
      loading: false,
      statusWithdrawVisible: false,
      googleCodeVisible: false,
      downloadLoading: false,
      rechangeDownloadVisible: false,
      verifyStatusOptions,
      payOptions,
      pickerOptions,
      whetherOptions: whetherOptions.slice(1),
      dateRangeValue: [],
      list: [],
      wait_count: 0,
      search: {
        account: '',
        status: '',
        account_type: '',
        start_time: '',
        end_time: '',
        is_today: 0
      },
      pages: Object.assign({}, pages)
    }
  },
  created() {
    this.init()
  },
  methods: {
    init() {
      this.search.status = this.$route.query.status === undefined ? '' : this.$route.query.status
      this.getList()
    },
    getList(page = this.pages.current, loading = true) {
      if (this.loading) return
      this.loading = loading
      if (page === 1) this.pages.current = page
      dataList({ page, ...this.search, limit: this.pages.limit })
        .then(response => {
          this.list = response.data.data.data
          this.pages.total = response.data.data.total
          this.wait_count = response.data.wait_count
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
      } else {
        this.search.start_time = this.search.end_time = ''
        this.getList(1)
      }
    },
    onStatusWithdraw(data, status) {
      this.statusWithdrawVisible = true
      this.$nextTick(() => {
        this.$refs.statusWithdraw && this.$refs.statusWithdraw.init(data, status)
      })
    },
    onHandleDownload() {
      this.downloadLoading = true
      exportWithdrawalsExcel(this.search)
        .then((response) => {
          location.href = '/' + response.data.filename
        })
        .catch(() => { })
        .finally(() => {
          this.downloadLoading = false
        })
    },
    onHandleRechargeDownload() {
      this.rechangeDownloadVisible = true
      this.$nextTick(() => {
        this.$refs.rechangeDownload && this.$refs.rechangeDownload.init()
      })
    }
  }
}
</script>
<style lang="scss" scoped>
  .data-info {
    padding: 0;
    li {
      display: flex;
      div:nth-child(1) {
        flex-shrink: 0;
      }
    }
  }
  .el-link {
    display: inline;
  }
  .ellipsis {
    width: 100%;
  }
  .img-item {
    width: 100px;
    height: 100px;
  }
  ::v-deep .ellipsis span {
    display: inline-block;
    width: 100%;
    overflow:hidden;
    text-overflow:ellipsis;
    white-space:nowrap;
  }
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
