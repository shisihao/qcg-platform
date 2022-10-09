<template>
  <div class="app-container">
    <div class="filter-container">
      <el-form :inline="true" :model="search">
        <el-form-item label="账号">
          <el-input v-model="search.keywords" placeholder="ID/昵称/手机号" clearable @clear="getList(1)" @keyup.enter.native="getList(1)" />
        </el-form-item>
        <el-form-item label="状态">
          <el-radio-group v-model="search.status" @change="getList(1)">
            <el-badge v-for="item in statusOptions" :key="item.value" class="badge-item">
              <el-radio-button :label="item.value">{{ item.label }}</el-radio-button>
            </el-badge>
          </el-radio-group>
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
      </el-form>
    </div>

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
        label="用户信息"
        width="200"
        header-align="center"
      >
        <template slot-scope="{ row }">
          <div v-if="row.user">
            <el-avatar :key="row.user.id" icon="el-icon-user-solid" style="vertical-align: top;" :src="row.user.avatar ? (domin + row.user.avatar) : ''" />
            <div style="display: inline-block;margin-left: 2px">
              <div>
                {{ row.user.name }}
                <span v-if="row.user.certification">
                  <el-divider direction="vertical" />
                  <el-tag effect="plain">{{ row.user.certification.name }}</el-tag>
                </span>
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
      <el-table-column
        prop="content"
        label="反馈内容"
        min-width="200"
        header-align="center"
      >
        <template slot-scope="{ row, $index }">
          <div class="RichContent-collapsedText" :class="{ellipsis: row.ellipsis}">
            {{ row.content }}
            <div class="RichContent-lookText" @click="onLookAll($index)">
              {{ row.ellipsis ? '查看全部' : '收起内容' }}
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        prop="images"
        label="反馈图片"
        width="365"
        header-align="center"
      >
        <template slot-scope="{ row, $index }">
          <div v-if="!loading" class="recommend-page">
            <swiper :ref="'mySwiper' + $index" :options="swiperOption">
              <swiper-slide v-for="(item,index) in row.images" :key="index" class="images-list">
                <el-image
                  class="image-item"
                  fit="contain"
                  :src="domin + item.filename"
                  @click="onPicturePreview(item)"
                />
              </swiper-slide>
            </swiper>
            <div v-if="row.images.length > 3" slot="button-prev" class="swiper-button-prev" @click="prev($index)" />
            <div v-if="row.images.length > 3" slot="button-next" class="swiper-button-next" @click="next($index)" />
          </div>
        </template>
      </el-table-column>
      <el-table-column
        label="联系方式"
        width="120"
        align="center"
      >
        <template slot-scope="{ row }">
          <div v-if="row.user">
            {{ row.user.phone || row.user.email }}
          </div>
          <div v-else>
            -
          </div>
        </template>
      </el-table-column>
      <el-table-column
        prop="from"
        label="来源"
        width="80"
        align="center"
      />
      <el-table-column
        prop="status"
        label="状态"
        width="80"
        align="center"
      >
        <template slot-scope="{ row: { status } }">
          <el-tag v-if="status === 0" type="warning">未解决</el-tag>
          <el-tag v-else type="success">已解决</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="created_at"
        width="140"
        label="反馈时间"
        align="center"
      />
      <el-table-column
        width="150"
        label="操作"
        align="center"
      >
        <template slot-scope="{ row }">
          <el-button type="primary" @click="onJwChatTalk(row)">回复</el-button>
          <el-button v-if="row.status === 0" type="success" @click="onSolve(row)">解决</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="pages.total > 0" :total="pages.total" :page.sync="pages.current" :limit.sync="pages.limit" @pagination="getList()" />

    <jw-chat-talk
      v-if="talkVisible"
      ref="talk"
      @refreshList="getList()"
    />
    <el-image-viewer
      v-if="imageViewer"
      :on-close="closeViewer"
      :url-list="imageViewerList"
    />

  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
import { dataList, setSolve } from '@/api/feedback'
import { DominKey, getToken } from '@/utils/auth'
import { pickerOptions } from '@/utils/explain'
import JwChatTalk from './components/JwChatTalk'
import ElImageViewer from 'element-ui/packages/image/src/image-viewer'
import { Swiper, SwiperSlide } from 'vue-awesome-swiper'
import 'swiper/swiper-bundle.css'

export default {
  name: 'Feedback',
  components: { Pagination, JwChatTalk, ElImageViewer, Swiper, SwiperSlide },
  data() {
    return {
      domin: getToken(DominKey),
      list: [],
      search: {
        keywords: '',
        status: '',
        start_time: '',
        end_time: ''
      },
      pages: {
        total: 0,
        limit: 20,
        current: 1
      },
      statusOptions: [
        { label: '全部', value: '' },
        { label: '未解决', value: 0 },
        { label: '已解决', value: 1 }
      ],
      swiperOption: {
        slidesPerView: 3,
        spaceBetween: 10,
        navigation: {
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev'
        }
      },
      imageViewer: false,
      imageViewerList: [],
      dateRangeValue: [],
      pickerOptions,
      loading: false,
      talkVisible: false
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
          if (response.code !== 0) return
          this.list = response.data.data.map(v => {
            return Object.assign(v, { ellipsis: true })
          })
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
    onJwChatTalk(data) {
      this.talkVisible = true
      this.$nextTick(() => {
        this.$refs.talk && this.$refs.talk.init(data)
      })
    },
    onPicturePreview(img) {
      this.imageViewerList = [this.domin + img.filename]
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
    onSolve(data) {
      this.$confirm(`确定进行设置解决操作?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'success'
      })
        .then(() => {
          setSolve(data.id)
            .then(({ msg }) => {
              this.getList()
              this.$message.success(msg)
            })
            .catch(() => {})
        })
        .catch(() => {})
    },
    onLookAll(index) {
      if (this.list[index].ellipsis) {
        this.list[index].ellipsis = false
      } else {
        this.list[index].ellipsis = true
      }
    }
  }
}
</script>
<style lang="scss" scoped>
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

  ::v-deep .images-list .image-item img {
    height: auto;
  }
  .swiper-button-prev,.swiper-button-next {
    display: none;
  }
  .recommendPage:hover .swiper-button-prev,.recommendPage:hover .swiper-button-next {
    /*display: block;*/
  }
  ::v-deep .detail-content  img {
    width: 100%;
    height: auto;
  }
  ::v-deep .el-image-viewer__canvas {
    width: 80%;
    margin: 0 auto;
  }
  ::v-deep .edit-input {
    padding-right: 50px;
  }
  ::v-deep .cancel-btn {
    position: absolute;
    right: 15px;
    top: 50%;
    margin-top: -14px;
  }
  ::v-deep .edit-input .el-input-number__decrease,::v-deep .edit-input .el-input-number__increase{
    display: none;
  }
  ::v-deep .edit-input.is-controls-right .el-input__inner {
    padding: 0;
  }

  .goods_name{
    width: 150px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .recommend-page {
    width: 291px;
    margin: 0 auto;
    .swiper-button-prev,.swiper-button-next {
      display: none;
      pointer-events: auto;
      cursor: pointer;
    }
    .swiper-button-prev::after, .swiper-button-next::after {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
    }
    &:hover .swiper-button-prev, &:hover .swiper-button-next {
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

  ::v-deep .RichContent-collapsedText {
    position: relative;
    left: 0;
    top: 0;
    padding-right: 60px;
  }
  ::v-deep .RichContent-lookText {
    position: absolute;
    right: 0;
    top: 0;
    color: #409eff;
    cursor: pointer;
    user-select: none;
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
