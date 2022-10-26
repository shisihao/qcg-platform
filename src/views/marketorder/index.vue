<template>
  <div class="app-container">
    <div class="filter-container">
      <el-form :inline="true" :model="search">
        <el-form-item label="藏品名称">
          <el-input
            v-model="search.keywords"
            placeholder="藏品名称"
            clearable
            @clear="getList(1)"
            @keyup.enter.native="getList(1)"
          />
        </el-form-item>
        <el-form-item label="订单号筛选">
          <el-input
            v-model="search.order_no"
            style="width: 220px"
            placeholder="订单号"
            clearable
            @clear="getList(1)"
            @keyup.enter.native="getList(1)"
          />
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
        <el-form-item label="状态" style="margin-left: 10px">
          <el-radio-group v-model="search.status" size="mini" @change="getList(1)">
            <el-badge
              v-for="item in marketorderStatusOptions"
              :key="item.value"
              :value="statusCount.get(item.value) || ''"
              class="badge-item"
            >
              <el-radio-button :label="item.value">
                {{ item.label }}
              </el-radio-button>
            </el-badge>
          </el-radio-group>
        </el-form-item>
        <el-button icon="el-icon-search" @click="getList(1)">
          {{ $t('table.search') }}
        </el-button>
        <el-button :loading="downloadLoading" type="success" icon="el-icon-document" @click="onHandleDownload">
          {{ $t('table.export') }} Excel
        </el-button>
      </el-form>
    </div>

    <el-table
      border
      :show-header="false"
      :cell-style="{ background: '#DCDFE6' }"
      :data="[
        {
          orderInfo: '订单信息',
          status: '状态',
          handle: '操作'
        }
      ]"
    >
      <el-table-column prop="orderInfo" label="订单信息" min-width="1092" header-align="center">
        <template slot-scope="{ row }">
          <span
            style="
              display: inline-block;
              width: calc(100% - 14px);
              text-align: center;
            "
          >
            {{ row.orderInfo }}
          </span>
        </template>
      </el-table-column>
      <el-table-column prop="status" label="状态" width="90" align="center" />
      <el-table-column prop="handle" label="操作" width="200" fixed="right" align="center" />
    </el-table>

    <el-empty v-if="list.length === 0" v-loading="loading" description="暂无数据" />

    <div v-else>
      <el-table
        v-for="item in list"
        :key="item.id"
        class="order-table"
        :data="[item]"
        :cell-style="{ background: '#fff' }"
        :header-cell-style="headNone"
      >
        <el-table-column>
          <template slot="header">
            <span># {{ item.id }}</span>
            <el-divider direction="vertical" />
            <span>订单号: {{ item ? item.order_no : '-' }}</span>
            <el-divider direction="vertical" />
            <span>下单时间：{{ item.created_at }}</span>
          </template>
          <el-table-column min-width="240" header-align="center">
            <template slot-scope="{ row: { consignment } }">
              <div v-if="consignment" class="info-wrapper">
                <el-image
                  class="image-item"
                  :src="Array.isArray(consignment.images) && consignment.images[0] && domin + consignment.images[0]"
                  :preview-src-list="[Array.isArray(consignment.images) && consignment.images[0] && domin + consignment.images[0]]"
                >
                  <div slot="error" class="image-slot">
                    <i class="el-icon-picture-outline" />
                  </div>
                </el-image>
                <ul class="data-info">
                  <li>
                    <div>名称：</div>
                    <el-tooltip popper-class="popover-box" placement="bottom-start" effect="light">
                      <div slot="content">{{ consignment.title }}</div>
                      <div class="more-ellipsis-3">{{ consignment.title }}</div>
                    </el-tooltip>
                  </li>
                  <li v-if="consignment.type === 2">
                    <el-tag type="success">
                      现货
                    </el-tag>
                  </li>
                  <li v-if="consignment.type === 1">
                    <el-tag type="danger">
                      预售
                    </el-tag>
                    <div style="margin-left: 10px">预售时间: {{ consignment.pre_sale_time }}</div>
                  </li>
                </ul>
              </div>
            </template>
          </el-table-column>
          <el-table-column min-width="100" header-align="center">
            <template slot-scope="{ row: { consignment: { platform } } }">
              <div>
                <el-image class="icon-logo" fit="cover" :src="platform.icon && domin + platform.icon" />
                {{ platform.name }}
              </div>
            </template>
          </el-table-column>
          <el-table-column min-width="200" header-align="center">
            <template slot-scope="{ row }">
              <ul class="user-info">
                <li>
                  <div>卖方：</div>
                  <div v-if="row.consignment && row.consignment.user" style="display: flex;align-items: center;">
                    <el-avatar
                      :key="row.consignment.user.id"
                      icon="el-icon-user-solid"
                      style="flex-shrink: 0;"
                      :src="row.consignment.user.avatar ? domin + row.consignment.user.avatar : ''"
                    />
                    <div style="margin-left: 2px">
                      <div>
                        # {{ row.consignment.user.id }}
                        <el-divider direction="vertical" />
                        {{ row.consignment.user.name }}
                      </div>
                      <div>
                        <!--                        {{ row.consignment.user.phone | cancelPhone }}-->
                      </div>
                      <template v-if="row.status === 4">
                        <div v-show="row.intervene_user_id===row.consignment.user_id">
                          <el-tag>申请介入</el-tag>
                        </div>
                      </template>
                    </div>
                  </div>
                  <div v-else>
                    用户已删除
                  </div>
                </li>
              </ul>
              <el-divider />
              <ul class="user-info">
                <li>
                  <div>买方：</div>
                  <div v-if="row.user" style="display: flex;align-items: center;">
                    <el-avatar
                      :key="row.user.id"
                      icon="el-icon-user-solid"
                      style="flex-shrink: 0;"
                      :src="row.user.avatar ? domin + row.user.avatar : ''"
                    />
                    <div style="margin-left: 2px">
                      <div>
                        # {{ row.user.id }}
                        <el-divider direction="vertical" />
                        {{ row.user.name }}
                      </div>
                      <div>
                        <!--                        {{ row.user.phone | cancelPhone }}-->
                      </div>
                      <template v-if="row.status === 4">
                        <div v-show="row.intervene_user_id===row.user.id">
                          <el-tag>申请介入</el-tag>
                        </div>
                      </template>
                    </div>
                  </div>
                  <div v-else>
                    用户已删除
                  </div>
                </li>
              </ul>
            </template>
          </el-table-column>
          <el-table-column width="160" header-align="center">
            <template slot-scope="{ row }">
              <div>支付价格：<svg-icon icon-class="money" style="color: #e6a23c;" /> {{ row.cny_price || 0.0 }}</div>
              <div>
                <el-popover placement="bottom-start" trigger="hover" popper-class="popover-box popover-top">
                  <div>
                    <div>
                      <svg-icon :icon-class="row.pay_type" /> {{ row.pay_type | paraphrase(payOptions) }}
                    </div>
                  </div>
                  <div slot="reference" style="display: inline-block;">支付方式：
                    <svg-icon :icon-class="row.pay_type" /> {{ row.pay_type | paraphrase(payOptions) }} <i class="el-icon-zoom-in" />
                  </div>
                </el-popover>
              </div>
            </template>
          </el-table-column>
          <el-table-column width="122" header-align="center">
            <template slot-scope="{ row }">
              <div v-if="row.transfer_credential">
                <el-image class="img-item" fit="cover" :src="row.transfer_credential && domin + row.transfer_credential" :preview-src-list="[row.transfer_credential && domin + row.transfer_credential]" />
              </div>
              <div v-else>
                -
              </div>
            </template>
          </el-table-column>
          <el-table-column width="130" align="center">
            <template slot-scope="{ row }">
              <el-tag v-if="row.intervene_user_id != row.user.id && row.intervene_user_id != row.consignment.user_id && row.status === 5" effect="dark" type="danger">
                平台系统自动介入
              </el-tag>
              <el-tag v-else :effect="row.status === 5 ? 'plain' : 'light'" :type="row.status | paraphrase(marketorderStatusOptions, 'value', 'type')">
                {{ row.status | paraphrase(marketorderStatusOptions) }}
              </el-tag>
              <div v-if="row.admin">
                <el-popover placement="bottom-start" max-width="300" trigger="hover">
                  <div>
                    <div># {{ row.admin.id }}</div>
                    <div>
                      {{ row.admin.name }}
                    </div>
                  </div>
                  <div slot="reference">
                    审核人<i class="el-icon-question" />
                  </div>
                </el-popover>
              </div>
              <div v-if="row.status === 4">
                <el-popover placement="bottom-start" max-width="300" trigger="hover">
                  <div>
                    {{ row.reason || '' }}
                  </div>
                  <div slot="reference">
                    关闭原因<i class="el-icon-question" />
                  </div>
                </el-popover>
              </div>
            </template>
          </el-table-column>
        </el-table-column>
        <el-table-column width="200" fixed="right" align="center">
          <template slot-scope="{ row }">
            <!--            <el-button v-show="[5].includes(row.status)" type="primary" @click="onIntervene(row)">平台介入</el-button>-->
            <!--            <el-button v-show="[1,2].includes(row.status)" type="warning" @click="onRemind(row)">提醒</el-button>-->
            <el-button type="primary" plain @click="onDetail(row)">订单详情</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <pagination
      v-show="pages.total > 0"
      :total="pages.total"
      :page.sync="pages.current"
      :limit.sync="pages.limit"
      @pagination="getList()"
    />
    <!-- 弹窗, 新增 / 修改 -->
    <order-detail
      v-if="orderDetailVisible"
      ref="orderDetail"
    />

    <platform-remind
      v-if="platformRemindVisible"
      ref="platformRemind"
    />

    <platform-intervene
      v-if="platformInterveneVisible"
      ref="platformIntervene"
      @refreshList="getList()"
    />

  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
import PlatformRemind from './components/PlatformRemind'
import PlatformIntervene from './components/PlatformIntervene'
import OrderDetail from './components/OrderDetail'
import { getToken, DominKey } from '@/utils/auth'
import { dataList, exportOrder } from '@/api/marketorder'
import { payOptions, pickerOptions, marketorderStatusOptions, pages } from '@/utils/explain'

export default {
  name: 'Orders',
  components: { Pagination, OrderDetail, PlatformRemind, PlatformIntervene },
  data() {
    return {
      domin: getToken(DominKey),
      dateRangeValue: [],
      pickerOptions,
      payOptions,
      marketorderStatusOptions,
      list: [],
      statusCount: new Map([
        [0, 0],
        [5, 0]
      ]),
      search: {
        keywords: '',
        status: '',
        order_no: '',
        start_time: '',
        end_time: ''
      },
      pages: Object.assign({}, pages),
      orderDetailVisible: false,
      platformRemindVisible: false,
      platformInterveneVisible: false,
      downloadLoading: false,
      loading: false
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
      this.list = []
      dataList({ page, ...this.search, limit: this.pages.limit })
        .then((response) => {
          this.list = response.data.data.data
          this.pages.total = response.data.data.total
          this.statusCount.set(0, response.data.wait_count || 0)
          this.statusCount.set(5, response.data.intervene_count || 0)
        })
        .catch(() => { })
        .finally(() => {
          this.loading = false
        })
    },
    onHandleDownload() {
      this.downloadLoading = true
      exportOrder(this.search)
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
        this.search.start_time = value[0]
        this.search.end_time = value[1]
      } else {
        this.search.start_time = this.search.end_time = ''
        this.getList(1)
      }
    },
    onRemind(data) {
      this.platformRemindVisible = true
      this.$nextTick(() => {
        this.$refs.platformRemind && this.$refs.platformRemind.init(data)
      })
    },
    onIntervene(data) {
      this.platformInterveneVisible = true
      this.$nextTick(() => {
        this.$refs.platformIntervene && this.$refs.platformIntervene.init(data)
      })
    },
    onDetail(data) {
      this.orderDetailVisible = true
      this.$nextTick(() => {
        this.$refs.orderDetail && this.$refs.orderDetail.init(data)
      })
    },
    headNone({ row, colunm, rowIndex, columnIndex }) {
      if (rowIndex > 0) {
        return { display: 'none' }
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.info-wrapper {
  display: flex;

  .image-item {
    flex-shrink: 0;
    width: 100px;
    height: 100px;
    display: flex;
    align-items: center;

    img {
      height: auto;
    }

    ::v-deep .image-slot {
      font-size: 30px;
      display: flex;
      justify-content: center;
      align-items: center;
      width: 100%;
      height: 100%;
      background: #f5f7fa;
      color: #909399;
    }
  }
}

.user-info {
  padding: 0;
  line-height: 1.3;
  margin: 6px auto;
  +.el-divider {
    margin: 0 auto;
  }
  li {
    display: flex;
    align-items: center;
    div {
      line-height: 1.3;
    }
    div:nth-child(1) {
      flex-shrink: 0;
    }
  }
}

  .data-info {
    padding: 0;
    margin-left: 4px;
    li {
      display: flex;
      div:nth-child(1) {
        flex-shrink: 0;
      }
    }
  }

.icon-logo {
  width: 30px;
  height: 30px;
  margin-right: 3px;
  vertical-align: middle;
}

.img-item {
  width: 100px;
  height: 100px;
}

.chain {
  display: flex;

  .chain-title {
    flex-shrink: 0;
  }
}

::v-deep .el-table th {
  user-select: auto;
}

.order-table {
  margin-top: 20px;
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
