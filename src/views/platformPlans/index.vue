<template>
  <div class="app-container">
    <div class="filter-container">
      <el-form :inline="true" :model="search">
        <el-form-item label="藏品名称">
          <el-input v-model="search.keywords" placeholder="请输入藏品名称" clearable @clear="getList(1)" @keyup.enter.native="getList(1)" />
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
        <el-button type="primary" icon="el-icon-plus" @click="onAddOrUpdate()">
          {{ $t('table.add') }}
        </el-button>
      </el-form>
    </div>

    <el-table
      v-loading="loading"
      border
      :data="list"
    >
      <el-table-column
        prop="name"
        label="藏品名称"
        align="center"
      />
      <el-table-column
        prop="start_time"
        label="发售时间"
        align="center"
      />
      <el-table-column
        prop="total"
        label="发售数量（个）"
        align="center"
      />
      <el-table-column
        label="发售价格（元）"
        align="center"
        width="120"
        prop="total"
      />
      <el-table-column
        width="120"
        label="藏品图片"
        header-align="center"
      >
        <template slot-scope="{ row }">
          <el-image
            class="image-item"
            fit="contain"
            :src="row.show_image && domin + row.show_image"
            :preview-src-list="[domin + row.show_image]"
          >
            <div slot="error" class="image-slot">
              <i class="el-icon-picture-outline" />
            </div>
          </el-image>
        </template>
      </el-table-column>
      <el-table-column
        label="是否展示"
        align="center"
        width="80"
      >
        <template slot-scope="{ row }">
          <el-switch v-model="row.is_show" :active-value="0" :inactive-value="1" @change="onChangeStatus(row)" />
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        width="260"
        align="center"
      >
        <template slot-scope="{ row }">
          <el-button type="primary" @click="onAddOrUpdate(row)">编辑</el-button>
          <el-button type="danger" @click="onDelete(row)">删除</el-button>
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
  </div>

</template>

<script>
import { dataList, addOrUpdate } from '@/api/platformPlans'
import Pagination from '@/components/Pagination'
import AddOrUpdate from './components/AddOrUpdate'
import { whetherOptions } from '@/utils/explain'
import { getToken, DominKey } from '@/utils/auth'
import { pickerOptions } from '@/utils/explain'

export default {
  name: 'PlatformPlans',
  components: { Pagination, AddOrUpdate },
  data() {
    return {
      domin: getToken(DominKey),
      loading: false,
      addOrUpdateVisible: false,
      whetherOptions,
      pickerOptions,
      dateRangeValue: [],
      list: [],
      search: {
        keywords: '',
        start_time: '',
        end_time: ''
      },
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
      dataList({ page, ...this.search, limit: this.pages.limit })
        .then(response => {
          this.list = response.data.data
          this.pages.total = response.data.total
        })
        .catch(() => { })
        .finally(() => {
          this.loading = false
        })
    },
    onAddOrUpdate(data) {
      this.addOrUpdateVisible = true
      this.$nextTick(() => {
        this.$refs.addOrUpdate && this.$refs.addOrUpdate.init(data)
      })
    },
    onChangeStatus(row) {
      addOrUpdate(row).then(({ msg = '操作成功' }) => {
        this.$message.success(msg)
        this.getList()
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
    }
  }
}
</script>

<style lang="scss" scoped>
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
</style>
