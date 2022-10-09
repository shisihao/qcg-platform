<template>
  <div class="app-container">
    <div class="filter-container">
      <el-form :inline="true" :model="search">
        <el-form-item label="关键词" prop="keywords">
          <el-input v-model="search.keywords" placeholder="编号/名称" clearable @clear="getList(1)" @keyup.enter.native="getList(1)" />
        </el-form-item>
        <el-form-item label="标签" prop="tags">
          <el-input v-model="search.tags" placeholder="标签" clearable @clear="getList(1)" @keyup.enter.native="getList(1)" />
        </el-form-item>
        <el-form-item label="平台">
          <el-select v-model="search.platform" clearable @change="getList(1)">
            <el-option v-for="(item, index) in platformOptions" :key="index" :label="item.label" :value="item.value">
              <el-image
                v-show="item.icon"
                class="select-img"
                fit="cover"
                :src="item.icon"
              >
                <div slot="error" class="image-slot">
                  <i class="el-icon-picture-outline" />
                </div>
              </el-image>
              {{ item.label }}
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="状态" style="margin-left: 10px">
          <el-radio-group v-model="search.status" size="mini" @change="getList(1)">
            <el-badge v-for="item in consignmentOptions" :key="item.value" class="badge-item">
              <el-radio-button :label="item.value">{{ item.label }}</el-radio-button>
            </el-badge>
          </el-radio-group>
        </el-form-item>
        <el-button icon="el-icon-search" @click="getList(1)">
          {{ $t('table.search') }}
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
      <el-table-column prop="orderInfo" label="订单信息" min-width="878" header-align="center">
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
      <!-- <el-table-column prop="handle" label="操作" width="110" fixed="right" align="center" /> -->
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
            <span>寄售时间：{{ item.created_at }}</span>
            <el-divider direction="vertical" />
            <span>状态：<el-link :underline="false" :type="item.status | paraphrase(consignmentOptions, 'value', 'type')">{{ item.status | paraphrase(consignmentOptions) }}</el-link></span>
          </template>
          <el-table-column min-width="240" header-align="center">
            <template slot-scope="{ row }">
              <div class="info-wrapper">
                <el-image class="image-item" :src="row.user_goods.goods.images && row.platform_info.oss_url + row.user_goods.goods.images" :preview-src-list="[row.user_goods.goods.images && row.platform_info.oss_url + row.user_goods.goods.images]">
                  <div slot="error" class="image-slot">
                    <i class="el-icon-picture-outline" />
                  </div>
                </el-image>
                <ul v-if="row.user_goods.goods" class="data-info" style="margin-left: 10px;">
                  <li>
                    <div>编号：</div>
                    <div>{{ row.user_goods.goods.serial }}</div>
                  </li>
                  <li>
                    <div>名称：</div>
                    <el-tooltip popper-class="popover-box" placement="bottom-start" effect="light">
                      <div slot="content">{{ row.user_goods.goods.name }}</div>
                      <div class="ellipsis">{{ row.user_goods.goods.name }}</div>
                    </el-tooltip>
                  </li>
                  <li>
                    <div>价格：</div>
                    <div><svg-icon icon-class="money" style="color: #e6a23c;" /> {{ row.price }}</div>
                  </li>
                </ul>
              </div>
            </template>
          </el-table-column>
          <el-table-column width="180" header-align="center">
            <template slot-scope="{ row }">
              <el-image
                class="icon-logo"
                fit="cover"
                :src="row.platform_info.icon && domin + row.platform_info.icon"
              />
              {{ row.platform_info.name }}
            </template>
          </el-table-column>
          <el-table-column min-width="160" header-align="center">
            <template slot-scope="{ row }">
              <div v-if="row.user">
                <el-avatar
                  :key="row.user.id"
                  icon="el-icon-user-solid"
                  :src="row.user.avatar ? domin + row.user.avatar : ''"
                />
                <div style="display: inline-block; margin-left: 2px">
                  <div>
                    # {{ row.user.id }}
                    <el-divider direction="vertical" />
                    {{ row.user.name }}
                  </div>
                  <div>
                    {{ row.user.phone || row.user.email }}
                  </div>
                </div>
              </div>
              <div v-else>
                用户已删除
              </div>
            </template>
          </el-table-column>
          <el-table-column width="180" header-align="center">
            <template slot-scope="{ row }">
              <ul v-if="row.extend" class="data-info">
                <li>
                  <div>手续费：</div>
                  <div>{{ row.extend.charge_fee }}（{{ row.extend.charge }}%）</div>
                </li>
                <li>
                  <div>版权费：</div>
                  <div>{{ row.extend.copyright_fee }}（{{ row.extend.copyright }}%）</div>
                </li>
                <li>
                  <div>总计：</div>
                  <div>{{ row.extend.total_fee }}（{{ row.extend.copyright + row.extend.charge }}%）</div>
                </li>
              </ul>
            </template>
          </el-table-column>
          <el-table-column min-width="180" header-align="center">
            <template slot-scope="{ row }">
              <div v-for="(value, key ,index) in row.pay_type" :key="index">
                <el-popover
                  placement="bottom-start"
                  trigger="hover"
                  popper-class="popover-box popover-top"
                >
                  <div>
                    <div><svg-icon :icon-class="key" /> {{ key | paraphrase(payOptions) }}</div>
                    <div>{{ row.pay_type[key].name }}</div>
                    <div>{{ row.pay_type[key].account }}</div>
                    <div v-show="row.pay_type[key].qr_code">
                      <el-image class="img-item" fit="cover" :src="row.pay_type[key].qr_code && domin + row.pay_type[key].qr_code" :preview-src-list="[row.pay_type[key].qr_code && domin + row.pay_type[key].qr_code]" />
                    </div>
                    <div v-show="row.pay_type[key].deposit_bank">{{ row.pay_type[key].deposit_bank }}</div>
                  </div>
                  <div slot="reference" style="display: inline-block;"><svg-icon :icon-class="key" /> {{ key | paraphrase(payOptions) }} <i class="el-icon-zoom-in" /></div>
                </el-popover>
              </div>
            </template>
          </el-table-column>
        </el-table-column>
        <!-- <el-table-column width="110" fixed="right" align="center">
          <template slot-scope="{ row }">
            <el-button type="primary" @click="onDetail(row)" plain>订单详情</el-button>
          </template>
        </el-table-column> -->
      </el-table>
    </div>
    <pagination v-show="pages.total > 0" :total="pages.total" :page.sync="pages.current" :limit.sync="pages.limit" @pagination="getList()" />
  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
import { getToken, DominKey } from '@/utils/auth'
import { dataList } from '@/api/consignment'
import { platformList } from '@/api/common'
import { consignmentOptions, pages, payOptions } from '@/utils/explain'

export default {
  name: 'Consignment',
  components: { Pagination },
  data() {
    return {
      domin: getToken(DominKey),
      consignmentOptions,
      payOptions,
      platformOptions: [
        { label: '全部', value: '' }
      ],
      list: [],
      search: {
        keywords: '',
        tags: '',
        platform: '',
        status: ''
      },
      pages: Object.assign({}, pages),
      loading: false,
      btnLoading: false
    }
  },
  created() {
    this.init()
  },
  methods: {
    init() {
      this.getList()
      this.getPlatformList()
    },
    getList(page = this.pages.current, loading = true) {
      if (this.loading) return
      this.loading = loading
      if (page === 1) this.pages.current = page
      this.list = []
      dataList({ page, ...this.search, limit: this.pages.limit })
        .then((response) => {
          this.list = response.data.data
          this.pages.total = response.data.total
        })
        .catch(() => {})
        .finally(() => {
          this.loading = false
        })
    },
    getPlatformList() {
      platformList()
        .then((response) => {
          this.platformOptions = this.platformOptions.concat(response.data.map(v => {
            return {
              label: v.name,
              value: v.alias,
              icon: this.domin + v.icon
            }
          }))
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

  .data-info {
    padding: 0;
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

  ::v-deep .el-table th {
    user-select: auto;
  }
  .order-table {
    margin-top: 20px;
  }
  .order-table .el-button + .el-button {
    margin-left: 0;
  }
</style>
