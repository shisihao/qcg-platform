<template>
  <div class="app-container">
    <div class="filter-container">
      <el-form :inline="true" :model="search">
        <el-form-item label="发起用户">
          <el-input v-model="search.keywords" placeholder="用户ID/昵称/手机号" clearable @clear="getList(1)" @keyup.enter.native="getList(1)" />
        </el-form-item>
        <el-form-item label="发布时间">
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
        <el-form-item label="状态">
          <el-radio-group v-model="search.status" @change="getList(1)">
            <el-badge v-for="item in statusOptions" :key="item.value" class="badge-item">
              <el-radio-button :label="item.value">{{ item.label }}</el-radio-button>
            </el-badge>
          </el-radio-group>
        </el-form-item>
        <el-button icon="el-icon-search" @click="getList(1)">
          {{ $t('table.search') }}
        </el-button>
        <el-button type="primary" icon="el-icon-plus" @click="onAddOrUpdate()">
          {{ $t('table.add') }}
        </el-button>
        <el-button
          :loading="downloadLoading"
          type="success"
          icon="el-icon-document"
          @click="onHandleDownload"
        >
          {{ $t('table.export') }} Excel
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
        prop="name"
        label="发起用户"
        min-width="200"
        header-align="center"
      >
        <template slot-scope="{ row }">
          <div v-if="row.user">
            <el-avatar :key="row.user.id" icon="el-icon-user-solid" :src="row.user.avatar && domin + row.user.avatar" />
            <div style="display: inline-block;margin-left: 2px">
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
      <el-table-column
        label="内容"
        min-width="140"
        header-align="center"
      >
        <template slot-scope="{ row }">
          <el-popover
            popper-class="popover-box"
            placement="bottom"
            trigger="hover"
            :content="row.intro"
          >
            <div slot="reference" class="more-ellipsis-3">
              {{ row.intro }}
            </div>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column
        prop="images"
        label="图片/投票"
        width="365"
        header-align="center"
      >
        <template slot-scope="{ row, $index }">
          <div v-if="!row.type" class="recommend-page">
            <swiper :ref="'mySwiper' + $index" :options="swiperOption">
              <swiper-slide v-for="(item, index) in row.images" :key="index" class="images-list">
                <el-image
                  class="image-item"
                  fit="contain"
                  :src="item ? domin + item.filename : ''"
                  @click="onPicturePreview(row.images, index)"
                />
              </swiper-slide>
            </swiper>
            <div v-if="row.images.length > 3" slot="button-prev" class="swiper-button-prev" @click="prev($index)" />
            <div v-if="row.images.length > 3" slot="button-next" class="swiper-button-next" @click="next($index)" />
          </div>
          <div v-for="(item,index) in row.topic_option" v-else :key="index" style="margin-left:30px">
            选项{{ index+1 }}：{{ item.title }}
          </div>
        </template>
      </el-table-column>
      <el-table-column
        label="观点数据"
        width="120"
        header-align="center"
      >
        <template slot-scope="{ row }">
          <div>
            点赞：{{ row.like }}
          </div>
          <div>
            热度：{{ row.heat }}
          </div>
          <div>
            转发：{{ row.reprint }}
          </div>
          <div>
            评论：{{ row.comment }}
          </div>
        </template>
      </el-table-column>
      <el-table-column
        prop="url"
        label="外链"
        header-align="center"
      />
      <el-table-column
        prop="created_at"
        label="发布时间"
        width="140"
        align="center"
      />
      <el-table-column
        prop="status"
        label="状态"
        width="80"
        align="center"
      >
        <template slot-scope="{ row: { status, reason, handler } }">
          <div v-if="status === 2">
            <el-popover
              placement="bottom-start"
              trigger="hover"
              :content="reason"
            >
              <el-tag slot="reference" :type="status | paraphrase(statusOptions, 'value', 'type')"> {{ status | paraphrase(statusOptions) }} <i class="el-icon-info" /></el-tag>
            </el-popover>
          </div>
          <div v-else>
            <el-tag :type="status | paraphrase(statusOptions, 'value', 'type')"> {{ status | paraphrase(statusOptions) }} </el-tag>
          </div>

          <div v-if="handler">
            <el-popover
              placement="bottom-start"
              trigger="hover"
            >
              <div>
                <div>
                  # {{ handler.id }}
                </div>
                <div>
                  {{ handler.name }}
                </div>
              </div>
              <div slot="reference">
                审核人<i class="el-icon-question" />
              </div>
            </el-popover>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        width="280"
        align="center"
        fixed="right"
      >
        <template slot-scope="{ row }">
          <el-button-group>
            <el-button type="primary" @click="onAddOrUpdate(row)">编辑</el-button>
            <el-button type="info" plain @click="onContent(row)">查看内容</el-button>
            <el-button type="primary" plain @click="onComment(row)">评论</el-button>
            <el-button type="danger" @click="onDelete(row)">删除</el-button>
          </el-button-group>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="pages.total > 0" :total="pages.total" :page.sync="pages.current" :limit.sync="pages.limit" @pagination="getList()" />

    <!-- 弹窗, 新增 / 修改-->
    <add-or-update
      v-if="addOrUpdateVisible"
      ref="addOrUpdate"
      @refreshList="getList()"
    />

    <!-- 弹窗, 评论 -->
    <comment
      v-if="commentVisible"
      ref="comment"
    />

    <el-image-viewer
      v-if="imageViewer"
      :z-index="3000"
      :on-close="closeViewer"
      :url-list="imageViewerList"
    />

    <!--弹窗, 内容  -->
    <el-dialog
      title="查看观点内容"
      :visible.sync="contentVisible"
      width="60%"
    >
      <span>{{ content }}</span>
    </el-dialog>

  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
import AddOrUpdate from './components/AddOrUpdate'
import Comment from './components/Comment'
import { dataList, deleteData, exportOrder } from '@/api/topics'
import { whetherOptions, pickerOptions } from '@/utils/explain'
import { DominKey, getToken } from '@/utils/auth'
import ElImageViewer from 'element-ui/packages/image/src/image-viewer'
import { Swiper, SwiperSlide } from 'vue-awesome-swiper'
import 'swiper/swiper-bundle.css'

export default {
  name: 'Topics',
  components: { Pagination, ElImageViewer, AddOrUpdate, Comment, Swiper, SwiperSlide },
  data() {
    return {
      swiperOption: {
        slidesPerView: 3,
        spaceBetween: 10,
        navigation: {
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev'
        }
      },
      domin: getToken(DominKey),
      whetherOptions,
      pickerOptions,
      dateRangeValue: [],
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
        { label: '待审核', type: 'warning', value: 0 },
        { label: '已通过', type: 'success', value: 1 },
        { label: '已驳回', type: 'danger', value: 2 }
      ],
      form: {
        topic_id: [],
        status: '',
        reason: ''
      },
      content: '',
      list: [],
      loading: false,
      downloadLoading: false,
      contentVisible: false,
      commentVisible: false,
      addOrUpdateVisible: false,
      imageViewerList: [],
      imageViewer: false
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
    onContent(row) {
      this.contentVisible = true
      this.content = row.intro
    },
    onHandleDownload() {
      this.downloadLoading = true
      exportOrder(this.search)
        .then((response) => {
          location.href = '/' + response.data.filename
        })
        .catch(() => {})
        .finally(() => {
          this.downloadLoading = false
        })
    },
    onAddOrUpdate(data) {
      if (!JSON.parse(getToken('userInfo'))) return this.$message.warning('请联系管理员绑定APP账号')
      this.addOrUpdateVisible = true
      this.$nextTick(() => {
        this.$refs.addOrUpdate && this.$refs.addOrUpdate.init(data)
      })
    },
    onComment(data) {
      this.commentVisible = true
      this.$nextTick(() => {
        this.$refs.comment && this.$refs.comment.init(data)
      })
    },
    onDelete(row) {
      this.$confirm(`确定删除「#${row.id}」<span style="color: #eb7340;">#${row.title}#</span> ？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'error',
        dangerouslyUseHTMLString: true,
        cancelButtonClass: 'btn-custom-cancel'
      })
        .then(() => {
          deleteData(row.id)
            .then((msg = '删除成功') => {
              this.$message.success(msg)
              this.init()
            })
            .catch(() => {})
        })
        .catch(() => {})
    },
    onPicturePreview(imgArr, index) {
      const newImgArr = imgArr.concat().map(v => v.filename)
      const currentItemArr = newImgArr.slice(index, index + 1)
      newImgArr.splice(index, 1)
      const currentArr = currentItemArr.concat(newImgArr).map((v) => {
        return this.domin + v
      })
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
    }
  }
}
</script>

<style lang="scss" scoped>
::v-deep .image-item {
  width: 80px;
  height: 80px;
  margin-bottom: 5px;
  margin-top: 5px;
  float: left;

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
  .image-slot {
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

.el-radio-group {
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
}

.recommend-page {
  width: 291px;
  margin: 0 auto;
  .swiper-container {
    user-select: none;
  }
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
</style>
