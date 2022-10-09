<template>
  <div>
    <el-collapse v-model="activeNames">
      <el-collapse-item name="0">
        <template slot="title">
          <span style="color: #409eff;">{{ `${collapseTitle ? '展开' : '收起' }资产详情` }}</span>
        </template>
        <el-radio-group v-model="radio" style="margin-bottom: 30px;" @change="agreeChange">
          <el-radio-button :label="2">有效</el-radio-button>
          <el-radio-button :label="1">无效</el-radio-button>
        </el-radio-group>
        <div style="margin-bottom: 30px">
          <el-row v-if="radio === 2" style="margin-bottom: 20px">
            <el-col :span="6">有效代金券总计：{{ pages.total }}张</el-col>
            <el-col :span="6">合计面额：{{ amount.original_amount? amount.original_amount:"0" }}元</el-col>
            <el-col :span="6">合计金额：{{ amount.amount?amount.amount:"0" }}元</el-col>
          </el-row>
          <el-row v-if="radio === 1" style="margin-bottom: 20px">
            <el-col :span="6">无效代金券总计：{{ pages.total }}张</el-col>
            <el-col :span="6">合计面额：{{ amount.original_amount? amount.original_amount:"0" }}元</el-col>
            <el-col :span="6">合计金额：{{ amount.amount?amount.amount:"0" }}元</el-col>
          </el-row>
          <el-form ref="form" :inline="true">
            <el-form-item label="代金券ID">
              <el-input v-model="search.voucher_no" style="width: 240px" placeholder="代金券ID" clearable @clear="getList(1)" @keyup.enter.native="getList(1)" />
            </el-form-item>
            <el-form-item>
              <el-button icon="el-icon-search" @click="getList(1)">
                {{ $t('table.search') }}
              </el-button>
            </el-form-item>
            <el-form-item>
              <el-button :loading="downloadLoading" type="success" icon="el-icon-document">
                导出流水 Excel
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
              prop="voucher_no"
              label="代金券ID"
              align="center"
            />
            <el-table-column
              prop="amount"
              label="剩余金额"
              align="center"
            />
            <el-table-column
              prop="action"
              label="有效期"
              align="center"
              width="250"
            >
              <template slot-scope="{row}">
                <ul>
                  <li>开始时间:{{ row.start_time }}</li>
                  <li>结束时间:{{ row.stop_time }}</li>
                </ul>
              </template>
            </el-table-column>
            <el-table-column
              label="获得时间"
              align="center"
            >
              <template slot-scope="{row}">
                <div v-if="row.transfer_time === null">{{ row.airdrop_time }}</div>
                <div v-else>{{ row.transfer_time }}</div>
              </template>
            </el-table-column>
            <el-table-column
              label="获得途径"
              align="center"
            >
              <template slot-scope="{row}">
                <div v-if="row.transfer_time === null">空投</div>
                <div v-else>转增</div>
              </template>
            </el-table-column>
          </el-table>
          <pagination v-show="pages.total > 0" :total="pages.total" :page.sync="pages.current" :limit.sync="pages.limit" @pagination="getList()" />
        </div>
      </el-collapse-item>
    </el-collapse>
    <div>
      <h4>代金券流水</h4>
      <el-form ref="form" :inline="true">
        <el-form-item label="收支">
          <el-select v-model="form.action" clearable @change="getList2(1)" @clear="getList2(1)">
            <el-option v-for="item in actionOptions1" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="流水类型">
          <el-select v-model="form.type" clearable @change="getList2(1)" @clear="getList2(1)">
            <el-option v-for="item in actionOptions3" :key="item.value" :label="item.label" :value="item.value" />
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
        <el-form-item label="代金券ID">
          <el-input v-model="form.voucher_no" placeholder="输入代金券ID" clearable @clear="getList2(1)" @keyup.enter.native="getList2(1)" />
        </el-form-item>
        <el-form-item>
          <el-button icon="el-icon-search" @click="getList2(1)">
            {{ $t('table.search') }}
          </el-button>
        </el-form-item>
        <el-form-item>
          <el-button :loading="downloadLoading" type="success" icon="el-icon-document">
            导出流水 Excel
          </el-button>
        </el-form-item>
      </el-form>
      <el-table
        v-loading="loading2"
        border
        highlight-current-row
        :data="list2"
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
          prop="voucher.voucher_no"
          label="代金券ID"
          align="center"
        />
        <el-table-column
          prop="amount"
          label="金额"
          align="center"
        />
        <el-table-column
          label="收支类型"
          align="center"
        >
          <template slot-scope="{row}">
            <div v-if="row.action == 1">支出</div>
            <div v-if="row.action == 2">收入</div>
          </template>
        </el-table-column>
        <el-table-column
          label="资产类型"
          align="center"
        >
          <div>代金券</div>
        </el-table-column>
        <el-table-column
          label="流水类型"
          align="center"
        >
          <template slot-scope="{row}">
            <div v-if="row.type === 'ma_consignment_pay'">集市扣除</div>
            <div v-if="row.type === 'ma_consignment_refund'">集市退回</div>
            <div v-if="row.type === 'consignment_pay'">链上扣除</div>
            <div v-if="row.type === 'consignment_refund'">链上退回</div>
          </template>
        </el-table-column>
        <el-table-column
          label="时间"
          align="center"
          prop="created_at"
        />
      </el-table>
      <pagination v-show="pages2.total > 0" :total="pages2.total" :page.sync="pages2.current" :limit.sync="pages2.limit" @pagination="getList2()" />
    </div>
  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
import { pickerOptions } from '@/utils/explain'
import { couponList, logList } from '@/api/coupon'
export default {
  name: 'Coupon',
  components: { Pagination },
  props: ['user_id'],
  data() {
    return {
      pickerOptions,
      loading: false,
      loading2: false,
      radio: 2,
      search: {
        voucher_no: ''
      },
      amount: {},
      list: [],
      list2: [],
      form: {
        action: '',
        type: '',
        voucher_no: '',
        from_time: '',
        to_time: ''
      },
      dateRangeValue: [],
      pages: {
        total: 0,
        limit: 20,
        current: 1
      },
      pages2: {
        total: 0,
        limit: 20,
        current: 1
      },
      activeNames: ['0'],
      collapseTitle: 0,
      downloadLoading: false,
      actionOptions1: [
        { label: '全部', value: '' },
        { label: '收入', value: 2 },
        { label: '支出', value: 1 }
      ],
      actionOptions3: [
        { label: '全部', value: '' },
        { label: '集市扣除', value: 'ma_consignment_pay' },
        { label: '集市退回', value: 'ma_consignment_refund' },
        { label: '链上扣除', value: 'consignment_pay' },
        { label: '链上退回', value: 'consignment_refund' }
      ]
    }
  },
  watch: {
    activeNames(val, oldVal) { // 普通的watch监听
      this.collapseTitle = val.length - 1
    }
  },
  // mounted() {
  //   this.init()
  // },
  methods: {
    init() {
      this.getList()
      this.getList2()
    },

    getList(page = this.pages.current, loading = true) {
      if (this.loading) return
      this.loading = loading
      if (page === 1) this.pages.current = page
      this.list = []
      couponList({ user_id: this.user_id, type: this.radio, page, ...this.search, limit: this.pages.limit })
        .then(response => {
          this.list = response.data.data.data
          this.amount = response.data.amount
          this.pages.total = response.data.data.total
        })
        .catch(() => {})
        .finally(() => {
          this.loading = false
        })
    },

    getList2(page = this.pages2.current, loading = true) {
      if (this.loading2) return
      this.loading2 = loading
      if (page === 1) this.pages2.current = page
      this.list2 = []
      logList({ user_id: this.user_id, page, ...this.form, limit: this.pages2.limit })
        .then(response => {
          this.list2 = response.data.data
          this.pages2.total = response.data.total
        })
        .catch(() => {})
        .finally(() => {
          this.loading2 = false
        })
    },

    // 时间
    onChangeDateRange(value) {
      if (Array.isArray(value)) {
        this.form.from_time = value[0]
        this.form.to_time = value[1]
        this.getList2()
      } else {
        this.form.from_time = this.form.to_time = ''
        this.getList2()
      }
    },

    //  有效 无效
    agreeChange(val) {
      this.radio = val
      this.getList(1)
    },

    //  关闭弹框
    offClose() {
      this.$reset()
    }
  }
}
</script>

<style scoped>
ul,li{
  list-style: none;
}
</style>
