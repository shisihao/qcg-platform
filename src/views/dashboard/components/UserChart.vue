<template>
  <el-card shadow="never" class="card-boder">
    <div slot="header" class="clearfix">
      <div class="filter-container">
        <el-form :inline="true" :model="search">
          <el-form-item label="数据报表">
            <el-select v-model="search.type" clearable @change="salesChange($event)">
              <el-option v-for="item in salesOptions" :key="item.value" :label="item.label" :value="item.value">
                <svg-icon v-show="item.value" :icon-class="item.value" /> {{ item.label }}
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="时间">
            <el-date-picker
              v-model="dateRangeValue"
              type="daterange"
              value-format="yyyy-MM-dd HH:mm:ss"
              :picker-options="pickerOptions"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              align="right"
              @change="onChangeDateRange"
            />
          </el-form-item>
          <el-button icon="el-icon-search" @click="getList()">
            {{ $t('table.search') }}
          </el-button>
        </el-form>
      </div>
    </div>
    <div v-loading="loading">
      <div id="chart-table" class="chart-table" :class="className" :style="{height:height,width:width}" />
    </div>
  </el-card>
</template>

<script>
import echarts from 'echarts'
require('echarts/theme/macarons') // echarts theme
import resize from '../mixins/resize'
import { usersSales } from '@/api/dashboard'
import { pickerOptions } from '@/utils/explain'
import moment from 'moment'

export default {
  mixins: [resize],
  props: {
    className: {
      type: String,
      default: 'chart'
    },
    width: {
      type: String,
      default: '100%'
    },
    height: {
      type: String,
      default: '350px'
    },
    autoResize: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      chart: null,
      chartData: {},
      dateRangeValue: [],
      pickerOptions,
      loading: false,
      search: {
        to_time: '',
        from_time: '',
        type: 'sales'
      },
      salesOptions: [
        { label: '链上交易额', value: 'sales' },
        { label: '集市交易额', value: 'ma_sales' },
        { label: '手续费奖励', value: 'charge_fee' },
        { label: '版权费奖励', value: 'copyright_fee' }
      ]
    }
  },
  watch: {
    chartData: {
      deep: true,
      handler(val) {
        this.setOptions(val)
      }
    }
  },
  created() {
    this.init()
  },
  mounted() {
    this.$nextTick(() => {
      this.initChart()
    })
  },
  methods: {
    init() {
      this.getList()
    },
    getList() {
      this.loading = true
      usersSales(this.search)
        .then(response => {
          const result = {
            countData: [],
            timeData: []
          }
          response.data.forEach(v => {
            result.countData.push(v.amount)
            result.timeData.push(v.date)
          })
          this.chartData = result
        })
        .finally(() => {
          this.loading = false
        })
    },
    onChangeDateRange(value) {
      if (Array.isArray(value)) {
        this.search.from_time = value[0]
        this.search.to_time = value[1]
      } else {
        this.search.from_time = this.search.to_time = ''
        this.getList()
      }
    },
    salesChange(val) {
      this.search.type = val
      this.getList()
    },
    initChart() {
      this.chart = echarts.init(document.querySelector('.chart-table'), 'macarons')
      this.setOptions(this.chartData)
    },
    setOptions({ countData, timeData } = {}) {
      this.chart.setOption({
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          data: ['交易额']
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: timeData
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            name: '交易额',
            type: 'line',
            data: countData,
            smooth: true,
            itemStyle: {
              normal: {
                color: '#f56c6c',
                lineStyle: {
                  color: '#f56c6c'
                }
              }
            }
            /* areaStyle: {
              color: '#fdecec'
            } */
          }
        ]
      })
    }
  }
}
</script>
<style lang="scss" scoped>
</style>
