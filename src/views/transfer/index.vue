<template>
  <div class="app-container">
    <div class="filter-container">
      <el-form :inline="true" :model="search">
        <el-form-item label="藏品名称">
          <el-input v-model="search.goods_name" placeholder="藏品名称" clearable @clear="getList(1)" @keyup.enter.native="getList(1)" />
        </el-form-item>
        <el-form-item label="转出地址">
          <el-input v-model="search.from_address" placeholder="转出地址" clearable @clear="getList(1)" @keyup.enter.native="getList(1)" />
        </el-form-item>
        <el-form-item label="接收人">
          <el-input v-model="search.to_address" placeholder="接收地址" clearable @clear="getList(1)" @keyup.enter.native="getList(1)" />
        </el-form-item>
        <el-form-item label="交易hash">
          <el-input v-model="search.hash" placeholder="交易hash" clearable @clear="getList(1)" @keyup.enter.native="getList(1)" />
        </el-form-item>
        <el-form-item label="藏品编号">
          <el-input v-model="search.serial" placeholder="藏品编号" clearable @clear="getList(1)" @keyup.enter.native="getList(1)" />
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
        <el-form-item label="类型">
          <el-select v-model="search.type" clearable @change="getList(1)">
            <el-option v-for="item in typeOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item v-if="false" label="创建时间">
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
            <el-badge v-for="item in examineStatusOptions" :key="item.value" :value="item.value === 0 && wait_count > 0 ? wait_count : ''" class="badge-item">
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
        label="藏品名称"
        min-width="200px"
        header-align="center"
      >
        <template slot-scope="{ row }">
          <ul class="data-info">
            <li>
              <div>编号：</div>
              <div>{{ row.serial }}</div>
            </li>
            <li>
              <div>名册：</div>
              <div>{{ row.goods_name }}</div>
            </li>
          </ul>
        </template>
      </el-table-column>
      <el-table-column
        label="平台"
        min-width="200px"
        header-align="center"
      >
        <template slot-scope="{ row }">
          <el-image class="icon-logo" fit="cover" :src="row.platform | paraphrase(platformOptions, 'value', 'icon')" />
          {{ row.platform | paraphrase(platformOptions) }}
        </template>
      </el-table-column>
      <el-table-column
        label="地址"
        min-width="500px"
        header-align="center"
      >
        <template slot-scope="{ row }">
          <ul class="data-info">
            <li v-for="(item, index) in chainOption" :key="index">
              <div>{{ item.label }}：</div>
              <div>{{ row[item.value] || '-' }}</div>
            </li>
          </ul>
        </template>
      </el-table-column>
      <el-table-column
        label="类型"
        width="80"
        align="center"
      >
        <template slot-scope="{ row }">
          <el-link :underline="false" :type="row.type | paraphrase(typeOptions, 'value', 'type')">{{ row.type | paraphrase(typeOptions) }}</el-link>
        </template>
      </el-table-column>
      <el-table-column
        label="状态"
        width="80"
        align="center"
      >
        <template slot-scope="{ row }">
          <div v-if="row.status === 2">
            <el-popover placement="bottom-start" max-width="300" trigger="hover">
              <div>
                {{ row.reason || '' }}
              </div>
              <div slot="reference">
                <el-tag :type="row.status | paraphrase(examineStatusOptions, 'value', 'type')">{{ row.status | paraphrase(examineStatusOptions) }} <i class="el-icon-question" /></el-tag>
              </div>
            </el-popover>
          </div>
          <div v-else>
            <el-tag :type="row.status | paraphrase(examineStatusOptions, 'value', 'type')">{{ row.status | paraphrase(examineStatusOptions) }}</el-tag>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        prop="created_at"
        label="赠送时间"
        width="140"
        align="center"
      />
    </el-table>
    <pagination v-show="pages.total > 0" :total="pages.total" :page.sync="pages.current" :limit.sync="pages.limit" @pagination="getList()" />
  </div>
</template>

<script>
import { dataList } from '@/api/transfer'
import { pickerOptions, pages, examineStatusOptions } from '@/utils/explain'
import Pagination from '@/components/Pagination'
import { DominKey, getToken } from '@/utils/auth'
import { platformList } from '@/api/common'

export default {
  name: 'Transfer',
  components: {
    Pagination
  },
  data() {
    return {
      domin: getToken(DominKey),
      list: [],
      dateRangeValue: [],
      pickerOptions,
      examineStatusOptions,
      wait_count: 0,
      search: {
        from_address: '',
        to_address: '',
        hash: '',
        platform: '',
        status: '',
        type: '',
        serial: '',
        goods_name: ''
      },
      typeOptions: [
        { label: '全部', value: '' },
        { label: '转入', value: 0, type: 'primary' },
        { label: '转出', value: 1, type: 'info' }
      ],
      platformOptions: [
        { label: '全部', value: '' }
      ],
      chainOption: [
        { label: 'from', value: 'from_address' },
        { label: 'to', value: 'to_address' },
        { label: 'hash', value: 'hash' }
      ],
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
      this.getPlatformList()
    },
    getList(page = this.pages.current, loading = true) {
      if (this.loading) return
      this.loading = loading
      if (page === 1) this.pages.current = page
      dataList({ page, ...this.search, limit: this.pages.limit })
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
      } else {
        this.search.start_time = this.search.end_time = ''
        this.getList(1)
      }
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
</style>
