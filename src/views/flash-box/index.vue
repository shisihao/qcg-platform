<template>
  <div class="app-container">
    <div class="filter-container">
      <el-form :inline="true" :model="search">
        <el-form-item label="关键词">
          <el-input v-model="search.keywords" style="width: 240px" placeholder="编号/名称/发行方/分类/合约地址" clearable @clear="getList(1)" @keyup.enter.native="getList(1)" />
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
        width="55"
        align="center"
      />
      <el-table-column
        label="藏品"
        width="365"
        header-align="center"
      >
        <template slot-scope="{ row, $index }">
          <div v-if="!loading" class="recommend-page">
            <swiper :ref="'mySwiper' + $index" :options="swiperOption">
              <swiper-slide v-for="(item, index) in row.images" :key="index" class="images-list">
                <el-image
                  class="image-item"
                  fit="contain"
                  lazy
                  :src="item"
                  @click="onPicturePreview(row.images, index)"
                />
              </swiper-slide>
            </swiper>
            <div v-if="row.images.length > 3" slot="button-prev" class="swiper-button-prev" @click="prev($index)" />
            <div v-if="row.images.length > 3" slot="button-next" class="swiper-button-next" @click="next($index)" />
          </div>
        </template>
      </el-table-column>
      <el-table-column
        label="藏品信息"
        header-align="center"
      >
        <template slot-scope="{ row }">
          <ul class="data-info">
            <li>
              <div>名称：</div>
              <el-tooltip popper-class="popover-box" placement="bottom-start" effect="light">
                <div slot="content">{{ row.name }}</div>
                <div class="ellipsis">{{ row.name }}</div>
              </el-tooltip>
            </li>
            <li>
              <div>流通总数：</div>
              <div>{{ row.circulate }}</div>
            </li>
            <li>
              <div>发行总数：</div>
              <div>{{ row.total_stock }}</div>
            </li>
          </ul>
        </template>
      </el-table-column>
      <el-table-column
        label="发行方"
        header-align="center"
      >
        <template slot-scope="{ row }">
          <div>
            <el-image
              class="icon-logo"
              fit="cover"
              :src="row.author_avatar && row.author_avatar"
            >
              <div slot="error" class="image-slot">
                <i class="el-icon-picture-outline" />
              </div>
            </el-image>
            {{ row.author }}
          </div>
        </template>
      </el-table-column>
      <el-table-column
        label="所属平台"
        header-align="center"
      >
        <template slot-scope="{ row: { issuer } }">
          <div>
            <el-image
              class="icon-logo"
              fit="cover"
              :src="issuer.image && domin + issuer.image"
            />
            {{ issuer.name }}
          </div>
        </template>
      </el-table-column>
      <el-table-column label="是否允许寄售" align="center" width="100">
        <template slot-scope="{row}">
          <el-switch
            v-model="row.sales_status"
            :active-value="1"
            :inactive-value="0"
            @change="onBoxSales(row)"
          />
        </template>
      </el-table-column>
      <el-table-column label="自动锁单状态" align="center" width="100">
        <template slot-scope="{row}">
          <el-switch
            v-model="row.lock"
            :active-value="1"
            :inactive-value="0"
            @change="onBoxLock(row)"
          />
        </template>
      </el-table-column>
      <el-table-column
        label="自动锁单价格"
        align="center"
        prop="lock_price"
        width="100"
      />
      <el-table-column label="寄售限价开关" align="center" width="100">
        <template slot-scope="{row}">
          <el-switch
            v-model="row.price_range_status"
            :active-value="1"
            :inactive-value="0"
            @change="onBoxprice(row)"
          />
        </template>
      </el-table-column>
      <el-table-column label="寄售限价区间" align="center" width="100">
        <template slot-scope="{row}">
          <ul class="data-info">
            <li>低: &nbsp;{{ row.price_min }}</li>
            <li>高: &nbsp;{{ row.price_max }}</li>
          </ul>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        width="120"
        align="center"
        fixed="right"
      >
        <template slot-scope="{ row }">
          <el-button type="primary" plain @click="onBoxDetail(row)">查看详情</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="pages.total > 0" :total="pages.total" :page.sync="pages.current" :limit.sync="pages.limit" @pagination="getList()" />

    <el-image-viewer
      v-if="imageViewer"
      :z-index="3000"
      :on-close="closeViewer"
      :url-list="imageViewerList"
    />

    <box-detail
      v-if="boxDetailVisible"
      ref="boxDetail"
      @refreshList="getList()"
    />

  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
import BoxDetail from './components/BoxDetail'
import { getToken, DominKey } from '@/utils/auth'
import { dataList, putBoxDetail } from '@/api/flashbox'
import { pages } from '@/utils/explain'
import ElImageViewer from 'element-ui/packages/image/src/image-viewer'
import { Swiper, SwiperSlide } from 'vue-awesome-swiper'
import 'swiper/swiper-bundle.css'
import { whetherOptions } from '@/utils/explain'

export default {
  name: 'FlashBox',
  components: { Pagination, ElImageViewer, Swiper, SwiperSlide, BoxDetail },
  data() {
    return {
      domin: getToken(DominKey),
      loading: false,
      whetherOptions,
      swiperOption: {
        slidesPerView: 3,
        spaceBetween: 10,
        navigation: {
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev'
        }
      },
      pages: Object.assign({}, pages),
      search: {
        keywords: '',
        type: 2
      },
      list: [],
      imageViewer: false,
      imageViewerList: [],
      boxDetailVisible: false
    }
  },
  computed: {
    swiper() {
      return function(v = 0) {
        return this.$refs[`mySwiper${v}`].$swiper
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
    onBoxDetail(data) {
      this.boxDetailVisible = true
      this.$nextTick(() => {
        this.$refs.boxDetail && this.$refs.boxDetail.init(data)
      })
    },
    onPicturePreview(imgArr, index) {
      const newImgArr = imgArr.concat()
      const currentItemArr = newImgArr.slice(index, index + 1)
      newImgArr.splice(index, 1)
      const currentArr = currentItemArr.concat(newImgArr)
      this.imageViewerList = currentArr
      this.imageViewer = true
    },
    closeViewer() {
      this.imageViewer = false
    },
    prev(index) {
      this.swiper(index).slidePrev()
    },
    next(index) {
      this.swiper(index).slideNext()
    },
    onBoxLock(row) {
      if (row.lock) {
        this.$prompt('请输入自动锁单价格', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          inputPattern: /^[1-9]\d{0,9}(\.\d{1,2})?$/,
          inputErrorMessage: '价格为纯数字，小数点最高2位'
        }).then(({ value }) => {
          this.updateSwitch(row, +value)
        }).catch(() => {

        })
      } else {
        this.updateSwitch(row)
      }
    },
    onBoxSales(row) {
      if (row.sales_status) {
        this.updateSwitch(row, row.lock_price, 1)
      } else {
        this.updateSwitch(row, row.lock_price, 0)
      }
    },

    onBoxprice(row) {
      if (row.price_range_status) {
        this.onBoxDetail(row)
      } else {
        this.updateSwitch(row)
      }
    },
    updateSwitch(row, value = row.lock_price, sales = row.sales_status, price_range_status = row.price_range_status) {
      putBoxDetail(row.id, { detail: row.detail, desc: row.desc, price_min: row.price_min, price_max: row.price_max, lock: row.lock, lock_price: value, sales_status: sales, price_range_status: price_range_status })
        .then(({ msg }) => {
          this.$message.success(msg)
          this.getList()
        })
        .catch(() => { })
    }
  }
}
</script>
<style lang="scss" scoped>
.recommend-page {
  width: 291px;
  margin: 0 auto;
  .swiper-container {
    user-select: none;
  }
  .swiper-button-prev,
  .swiper-button-next {
    display: none;
    pointer-events: auto;
    cursor: pointer;
  }
  .swiper-button-prev::after,
  .swiper-button-next::after {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
  }
  &:hover .swiper-button-prev,
  &:hover .swiper-button-next {
    display: flex;
  }
  .images-list {
    width: 80px;
    height: 80px;
    .image-item {
      height: 100%;
      cursor: pointer;
      display: -webkit-box;
      display: -ms-flexbox;
      display: -webkit-flex;
      display: flex;
      -webkit-box-pack: center;
      -ms-flex-pack: center;
      -webkit-justify-content: center;
      justify-content: center;
      -webkit-box-align: center;
      -ms-flex-align: center;
      -webkit-align-items: center;
      align-items: center;
      img {
        height: auto;
      }
    }
  }
}
::v-deep .image-slot {
  font-size: 14px;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  background: #f5f7fa;
  color: #909399;
}
.el-tag {
  margin-right: 4px;
}
.icon-logo {
  width: 30px;
  height: 30px;
  margin-right: 3px;
  vertical-align: middle;
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

.preview-btn {
  font-size: 12px;
}
</style>
