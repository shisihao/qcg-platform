<template>
  <div class="app-container">
    <div class="filter-container">
      <el-form :inline="true" :model="search">
        <el-form-item label="藏品名称" prop="keywords">
          <el-input v-model="search.keywords" placeholder="藏品名称" clearable @clear="getList(1)" @keyup.enter.native="getList(1)" />
        </el-form-item>
        <el-form-item label="手机号" prop="phone">
          <el-input v-model="search.phone" placeholder="手机号" clearable @clear="getList(1)" @keyup.enter.native="getList(1)" />
        </el-form-item>
        <el-form-item label="状态" style="margin-left: 10px">
          <el-radio-group v-model="search.status" size="mini" @change="getList(1)">
            <el-badge v-for="item in marketconsignmentOptions" :key="item.value" class="badge-item">
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
      <el-table-column prop="handle" label="操作" width="110" fixed="right" align="center" />
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
            <span>状态：<el-link :underline="false" :type="item.status | paraphrase(marketconsignmentOptions, 'value', 'type')">{{ item.status | paraphrase(marketconsignmentOptions) }}</el-link></span>
          </template>
          <el-table-column min-width="240" header-align="center">
            <template slot-scope="{ row }">
              <div class="info-wrapper">
                <el-image class="image-item" :src="row.images[0] && domin + row.images[0]" :preview-src-list="[row.images[0]&& domin + row.images[0]]">
                  <div slot="error" class="image-slot">
                    <i class="el-icon-picture-outline" />
                  </div>
                </el-image>
                <ul v-if="row.title" class="data-info" style="margin-left: 10px;">
                  <li>
                    <div>名称：</div>
                    <el-tooltip popper-class="popover-box" placement="bottom-start" effect="light">
                      <div slot="content">{{ row.title }}</div>
                      <div class="ellipsis">{{ row.title }}</div>
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
                :src="row.platform.icon && domin + row.platform.icon"
              />
              {{ row.platform.name }}
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
                  <div>服务费：</div>
                  <div>{{ row.extend.total_fee }}（{{ row.extend.total_fee }}%）</div>
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
                  </div>
                  <div slot="reference" style="display: inline-block;"><svg-icon :icon-class="key" /> {{ key | paraphrase(payOptions) }} <i class="el-icon-zoom-in" /></div>
                </el-popover>
              </div>
            </template>
          </el-table-column>
        </el-table-column>
        <el-table-column width="110" fixed="right" align="center">
          <template slot-scope="{ row }">
            <!--            <span v-if="item.status === 1">状态：<el-link :underline="false" :type="item.status | paraphrase(marketconsignmentOptions, 'value', 'type')" @click="shelf(item)">{{ item.status | paraphrase(marketconsignmentOptions) }}</el-link></span>-->
            <el-button v-if="row.is_delete === 0" type="primary" plain @click="shelf(row)">下架</el-button>
          </template>
        </el-table-column>
        <!--         <el-table-column width="110" fixed="right" align="center">-->
        <!--          <template slot-scope="{ row }">-->
        <!--            <el-button type="primary" @click="onDetail(row)" plain>订单详情</el-button>-->
        <!--          </template>-->
        <!--        </el-table-column> -->
      </el-table>
    </div>
    <pagination v-show="pages.total > 0" :total="pages.total" :page.sync="pages.current" :limit.sync="pages.limit" @pagination="getList()" />
  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
import { getToken, DominKey } from '@/utils/auth'
import { dataList, deleteData } from '@/api/marketconsignments'
import { marketconsignmentOptions, pages, payOptions } from '@/utils/explain'

export default {
  name: 'Consignment',
  components: { Pagination },
  data() {
    return {
      domin: getToken(DominKey),
      marketconsignmentOptions,
      payOptions,
      list: [],
      search: {
        keywords: '',
        phone: '',
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
    headNone({ row, colunm, rowIndex, columnIndex }) {
      if (rowIndex > 0) {
        return { display: 'none' }
      }
    },
    // 下架
    shelf(item) {
      this.$confirm(`是否下架藏品名称为[${item.title}]的藏品?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteData(item.id).then((res) => {
          if (res.code === 0) {
            this.getList()
            this.$message({
              type: 'success',
              message: '下架成功!'
            })
          }
        })
      }).catch(() => {

      })
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
