<template>
  <el-dialog title="信用分流水详情" top="30px" :visible.sync="visible" @closed="onClose()">
    <el-form ref="form" :inline="true" :model="search">
      <el-form-item label="信用分增减">
        <el-select v-model="search.action" clearable @change="getList(1)" @clear="getList(1)">
          <el-option v-for="item in actionOptions" :key="item.value" :label="item.label" :value="item.value" />
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
      <el-form-item>
        <el-button icon="el-icon-search" @click="getList(1)">
          {{ $t('table.search') }}
        </el-button>
        <el-button type="primary" plain @click="onUpdateScore">信用分</el-button>
      </el-form-item>
    </el-form>
    <el-table
      v-loading="loading"
      border
      highlight-current-row
      :data="list"
    >
      <el-table-column
        header-align="center"
        align="center"
        prop="title"
        label="标题"
      />
      <el-table-column
        prop="action"
        label="增减类型"
        align="center"
      >
        <template slot-scope="{ row }">
          <el-tag :type="row.action === 1 ? 'primary' : 'danger'"> {{ row.action | paraphrase(actionOptions) }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        header-align="center"
        align="center"
        prop="amount"
        label="信用分"
      />
      <el-table-column
        header-align="center"
        align="center"
        prop="created_at"
        label="创建时间"
      />
    </el-table>
    <pagination v-show="pages.total > 0" :total="pages.total" :page.sync="pages.current" :limit.sync="pages.limit" @pagination="getList()" />

    <!-- 信誉分增减 -->
    <update-score
      v-if="updateScoreVisible"
      ref="updateScores"
      @refreshList="getList()"
    />
  </el-dialog>
</template>

<script>
import { pickerOptions } from '@/utils/explain'
import { scoreLogsList } from '@/api/user'
import Pagination from '@/components/Pagination'
import updateScore from './updateScore'
export default {
  name: 'ScoreLogs',
  components: { Pagination, updateScore },
  data() {
    return {
      visible: false,
      row: {},
      search: {
        action: '',
        start_time: '',
        end_time: ''
      },
      loading: false,
      updateScoreVisible: false,
      dateRangeValue: [],
      list: [],
      pickerOptions,
      actionOptions: [
        { label: '全部', value: '' },
        { label: '增加', value: 1 },
        { label: '扣除', value: 2 }
      ],
      pages: {
        total: 0,
        limit: 20,
        current: 1
      }
    }
  },
  methods: {
    init(data) {
      this.visible = true
      if (data) {
        this.row = data
        this.getList()
      }
    },
    getList(page = this.pages.current, loading = true) {
      if (this.loading) return
      this.loading = loading
      if (page === 1) this.pages.current = page
      scoreLogsList(this.row.id, { page, ...this.search, limit: this.pages.limit })
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
    onUpdateScore() {
      this.updateScoreVisible = true
      this.$nextTick(() => {
        this.$refs.updateScores && this.$refs.updateScores.init(this.row)
      })
    },
    onClose() {
      this.$reset()
    }
  }
}
</script>

<style  scoped>
::v-deep .el-dialog {
  width: 1000px;
}
</style>
