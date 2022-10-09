<template>
  <div class="app-container">
    <div class="filter-container">
      <el-form :inline="true" :model="search">
        <el-form-item label="账号">
          <el-input v-model="search.keywords" placeholder="ID/昵称/手机号" clearable @clear="getList(1)" @keyup.enter.native="getList(1)" />
        </el-form-item>
        <el-form-item label="实名认证">
          <el-select v-model="search.is_auth" clearable @change="getList(1)">
            <el-option v-for="item in whetherOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="是否禁用">
          <el-select v-model="search.state" clearable @change="getList(1)">
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
            start-placeholder="注册开始日期"
            end-placeholder="注册结束日期"
            @change="onChangeDateRange"
          />
        </el-form-item>
        <el-button icon="el-icon-search" @click="getList(1)">
          {{ $t('table.search') }}
        </el-button>
        <el-button type="primary" icon="el-icon-plus" @click="onAddOrUpdate()">
          {{ $t('table.add') }}
        </el-button>
        <el-button :loading="downloadLoading" type="success" icon="el-icon-document" @click="onHandleDownload">
          {{ $t('table.export') }} Excel
        </el-button>
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
        label="账号"
        min-width="180"
        header-align="center"
      >
        <template slot-scope="{ row }">
          <el-avatar icon="el-icon-user-solid" style="vertical-align: top;" :src="row.avatar ? (domin + row.avatar) : ''" />
          <div style="display: inline-block;margin-left: 2px">
            <div>
              {{ row.name }}
              <span v-if="row.certification">
                <el-divider direction="vertical" />
                <el-tag effect="plain">{{ row.certification.name }}</el-tag>
              </span>
            </div>
            <div>
              {{ row.phone || row.email }}
            </div>
          </div>
        </template>
      </el-table-column>

      <el-table-column
        label="认证信息"
        min-width="150"
        header-align="center"
      >
        <template slot-scope="{ row : { certification }}">
          <div v-if="certification">
            <div>
              姓名：{{ certification.name }}
            </div>
            <div>身份证：{{ certification.number }}</div>
          </div>
          <div v-else style="text-align: center">未认证</div>
        </template>
      </el-table-column>
      <el-table-column
        prop="code"
        label="邀请码"
        width="80"
        align="center"
      />
      <el-table-column
        label="上级用户"
        min-width="180"
        header-align="center"
      >
        <template slot-scope="{ row }">
          <template v-if="row.parent">
            <el-avatar icon="el-icon-user-solid" style="vertical-align: top;" :src="row.parent.avatar ? (domin + row.parent.avatar) : ''" />
            <div style="display: inline-block;margin-left: 2px">
              <div>
                {{ row.parent.name }}
                <span v-if="row.parent.certification">
                  <el-divider direction="vertical" />
                  <el-tag effect="plain">{{ row.parent.certification.name }}</el-tag>
                </span>
              </div>
              <div>
                {{ row.parent.phone || row.parent.email }}
              </div>
            </div>
          </template>
          <div v-else>-</div>
        </template>
      </el-table-column>
      <el-table-column
        prop="state"
        label="状态"
        width="60"
        align="center"
      >
        <template slot-scope="{ row: { state } }">
          <el-tag v-if="state === 0" type="success">正常</el-tag>
          <el-tag v-else type="danger">禁用</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="created_at"
        label="创建时间"
        width="140"
        align="center"
      />
      <el-table-column
        label="操作"
        width="260"
        fixed="right"
        align="center"
      >
        <template slot-scope="{ row }">
          <div>
            <el-button type="text" @click="onAddOrUpdate(row)">编辑</el-button>
            <el-button type="text" @click="onSubset(row)">团队</el-button>
            <el-button type="text" @click="onScoreOperate(row)">信用分</el-button>
            <!-- <el-button type="text" @click="onRelieveScore(row)">解除信用分锁定</el-button> -->
            <el-button type="text" style="color: #f56c6c;" @click="onDelete(row)">删除</el-button>
          </div>
          <div>
            <el-button type="text" @click="onCollection(row)">他的藏品</el-button>
            <el-button type="text" @click="onWallet(row)">钱包流水</el-button>
            <el-button type="text" @click="onAddress(row)">平台地址</el-button>
            <el-button type="text" @click="onPayment(row)">收款方式</el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="pages.total > 0" :total="pages.total" :page.sync="pages.current" :limit.sync="pages.limit" @pagination="getList()" />

    <!-- 弹窗, 新增 / 修改 -->
    <add-or-update
      v-if="addOrUpdateVisible"
      ref="addOrUpdate"
      @refreshList="getList()"
    />

    <!-- 他的收藏-->
    <collection
      v-if="collectionUpdateVisible"
      ref="collection"
      @refreshList="getList()"
    />

    <!-- 查看邀请 -->
    <subset
      v-if="subsetVisible"
      ref="subset"
    />

    <!-- 钱包 -->
    <wallet
      v-if="walletVisible"
      ref="wallet"
    />

    <!-- 平台地址 -->
    <user-address
      v-if="addressVisible"
      ref="address"
    />

    <!-- 收款方式 -->
    <payment
      v-if="paymentVisible"
      ref="payment"
    />

    <!-- 信用分流水列表 -->
    <score-logs
      v-if="scoreLogsVisible"
      ref="scoreLog"
    />
  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
import { dataList, deleteData, exportOrder } from '@/api/user'
import AddOrUpdate from './components/AddOrUpdate'
import Subset from './components/Subset'
import Wallet from './components/Wallet'
import userAddress from './components/Address'
import scoreLogs from './components/scoreLogs'
import payment from './components/payment'
import Collection from './components/Collection'

import { getToken, DominKey } from '@/utils/auth'
import { pickerOptions, whetherOptions } from '@/utils/explain'

export default {
  name: 'User',
  components: { Collection, Pagination, AddOrUpdate, Subset, Wallet, userAddress, payment, scoreLogs },
  data() {
    return {
      domin: getToken(DominKey),
      pickerOptions,
      dateRangeValue: [],
      list: [],
      search: {
        keywords: '',
        is_auth: '',
        start_time: '',
        end_time: '',
        state: ''
      },
      pages: {
        total: 0,
        limit: 20,
        current: 1
      },
      whetherOptions,
      loading: false,
      addOrUpdateVisible: false,
      exportSerialVisible: false,
      subsetVisible: false,
      walletVisible: false,
      downloadLoading: false,
      updateAddressVisible: false,
      collectionUpdateVisible: false,
      addressVisible: false,
      paymentVisible: false,
      updateScoreVisible: false,
      scoreLogsVisible: false
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
          if (response.code !== 0) return
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
      } else {
        this.search.start_time = this.search.end_time = ''
        this.getList(1)
      }
    },
    onAddOrUpdate(data) {
      this.addOrUpdateVisible = true
      this.$nextTick(() => {
        this.$refs.addOrUpdate && this.$refs.addOrUpdate.init(data)
      })
    },
    onSubset(data) {
      this.subsetVisible = true
      this.$nextTick(() => {
        this.$refs.subset && this.$refs.subset.init(data)
      })
    },
    onCollection(data) {
      this.collectionUpdateVisible = true
      this.$nextTick(() => {
        this.$refs.collection && this.$refs.collection.init(data)
      })
    },
    onWallet(data) {
      this.walletVisible = true
      this.$nextTick(() => {
        this.$refs.wallet && this.$refs.wallet.init(data)
      })
    },
    onAddress(data) {
      this.addressVisible = true
      this.$nextTick(() => {
        this.$refs.address && this.$refs.address.init(data)
      })
    },
    onPayment(data) {
      this.paymentVisible = true
      this.$nextTick(() => {
        this.$refs.payment && this.$refs.payment.init(data)
      })
    },
    onScoreOperate(data) {
      this.scoreLogsVisible = true
      this.$nextTick(() => {
        this.$refs.scoreLog && this.$refs.scoreLog.init(data)
      })
    },
    onDelete({ name, id }) {
      this.$confirm(`确定对(#${id})[${name}]进行[删除]操作？删除用户对整个市场关系影响较大？
      <div style="color: #f56c6c;">注：删除用户之后无法找回，请谨慎操作</div>`, '删除', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        dangerouslyUseHTMLString: true,
        type: 'error'
      }
      )
        .then(() => {
          deleteData(id)
            .then(({ msg = '删除成功' }) => {
              this.$message.success(msg)
              this.init()
            })
            .catch(() => {})
        })
        .catch(() => {})
    },
    onHandleDownload() {
      this.downloadLoading = true
      exportOrder(this.search)
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

<style lang="scss" scoped>

.ellipsis {
  width: 100%;
}
::v-deep .ellipsis span {
  display: inline-block;
  width: 100%;
  overflow:hidden;
  text-overflow:ellipsis;
  white-space:nowrap;
}
</style>
