<template>
  <div>
    <el-row :gutter="20" class="panel-group">
      <el-col :xs="24" :span="7" class="card-panel-col">
        <div class="card-panel">
          <el-col :xs="24" :span="12">
            <div>
              <ul>
                <li class="title">闪汇藏品总数量</li>
                <li class="price"> <count-to :start-val="0" :end-val="+homeData.chain_good_num" :duration="2600" class="card-panel-num" /></li>
              </ul>
              <ul>
                <li class="title">上架中的闪汇藏品</li>
                <li class="price"> <count-to :start-val="0" :end-val="+homeData.chain_consignment_num" :duration="2600" class="card-panel-num" /></li>
              </ul>
            </div>
          </el-col>
          <el-col :xs="24" :span="12">
            <ul>
              <li class="title">集市藏品总数量</li>
              <li class="price"> <count-to :start-val="0" :end-val="+homeData.market_good_num" :duration="2600" class="card-panel-num" /></li>
            </ul>
            <ul>
              <li class="title">上架中的集市藏品</li>
              <li class="price"> <count-to :start-val="0" :end-val="+homeData.market_consignment_num" :duration="2600" class="card-panel-num" /></li>
            </ul>
          </el-col>
        </div>
      </el-col>
      <el-col :xs="24" :span="4" class="card-panel-col">
        <div class="card-panel">
          <el-col :xs="24" :span="12">
            <div>
              <ul>
                <li class="title">本月闪汇交易额</li>
                <li class="price"> <count-to :start-val="0" :end-val="+homeData.issuer_month_sell" :duration="2600" :decimals="2" class="card-panel-num" /></li>
              </ul>
              <ul>
                <li class="title">累计闪汇交易额</li>
                <li class="price"> <count-to :start-val="0" :end-val="+homeData.issuer_total_sell" :duration="2600" :decimals="2" class="card-panel-num" /></li>
              </ul>
            </div>
          </el-col>
        </div>
      </el-col>
      <el-col :xs="24" :span="4" class="card-panel-col">
        <div class="card-panel">
          <el-col :xs="24" :span="12">
            <div>
              <ul>
                <li class="title">本月集市寄售交易额</li>
                <li class="price"> <count-to :start-val="0" :end-val="+homeData.market_month_sell" :duration="2600" :decimals="2" class="card-panel-num" /></li>
              </ul>
              <ul>
                <li class="title">累计集市寄售交易额</li>
                <li class="price"> <count-to :start-val="0" :end-val="+homeData.market_total_sell" :duration="2600" :decimals="2" class="card-panel-num" /></li>
              </ul>
            </div>
          </el-col>
        </div>
      </el-col>
      <el-col v-if="homeData.charge_fee" :xs="24" :span="4" class="card-panel-col">
        <div class="card-panel">
          <el-col :xs="24" :span="12">
            <div>
              <ul>
                <li class="title">本月手续费奖励</li>
                <li class="price"> <count-to :start-val="0" :end-val="+homeData.charge_fee.month_fee" :decimals="4" :duration="2600" class="card-panel-num" /></li>
              </ul>
              <ul>
                <li class="title">累计手续费奖励</li>
                <li class="price"> <count-to :start-val="0" :end-val="+homeData.charge_fee.total_fee" :decimals="4" :duration="2600" class="card-panel-num" /></li>
              </ul>
            </div>
          </el-col>
          <el-col :xs="24" :span="12">
            <ul>
              <li class="title">
                <el-popover placement="bottom-start" max-width="300" trigger="hover">
                  <div>
                    当前比例:{{ homeData.charge_fee.percentage }}%
                  </div>
                  <span slot="reference">
                    <svg-icon icon-class="wenhao" />
                  </span>
                </el-popover>
              </li>
            </ul>
          </el-col>
        </div>
      </el-col>
      <el-col v-if="homeData.copyright_fee" :xs="24" :span="5" class="card-panel-col">
        <div class="card-panel">
          <el-col :xs="24" :span="12">
            <div>
              <ul>
                <li class="title">本月版权费奖励</li>
                <li class="price"> <count-to :start-val="0" :end-val="+homeData.copyright_fee.month_fee" :decimals="4" :duration="2600" class="card-panel-num" /></li>
              </ul>
              <ul>
                <li class="title">累计版权费奖励</li>
                <li class="price"> <count-to :start-val="0" :end-val="+homeData.copyright_fee.total_fee" :decimals="4" :duration="2600" class="card-panel-num" /></li>
              </ul>
            </div>
          </el-col>
          <el-col :xs="24" :span="12">
            <ul>
              <li class="title">
                <el-popover placement="bottom-start" max-width="300" trigger="hover">
                  <div>
                    当前比例:{{ homeData.copyright_fee.percentage }}%
                  </div>
                  <span slot="reference">
                    <svg-icon icon-class="wenhao" />
                  </span>
                </el-popover>
              </li>
            </ul>
          </el-col>
        </div>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import { getHome } from '@/api/dashboard'
import CountTo from 'vue-count-to'

export default {
  name: 'HomeItem',
  components: {
    CountTo
  },
  data() {
    return {
      homeData: {
      }
    }
  },
  created() {
    this.init()
  },
  methods: {
    init() {
      this.getHomeList()
    },
    getHomeList() {
      getHome()
        .then(response => {
          this.homeData = response.data
        })
    }
  }
}
</script>
<style lang="scss" scoped>
.panel-group {
  margin-top: 18px;

  .card-panel-col {
    margin-bottom: 32px;
  }

  .card-panel {
    min-height: 200px;
    //cursor: pointer;
    font-size: 20px;
    position: relative;
    overflow: hidden;
    color: #333333;
    background: #fff;
    box-shadow: 4px 4px 40px rgba(0, 0, 0, .05);
    border-color: rgba(0, 0, 0, .05);
    }
  }
ul,li{
  list-style: none;
  font-weight: 400;
  width: 200px;
}
.title{
  font-size: 14px;
}
.price{
  font-size: 30px;
  margin: 16px 0;
}
</style>
