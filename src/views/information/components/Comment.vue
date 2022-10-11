<template>
  <div>
    <el-dialog
      top="30px"
      width="1000px"
      title="查看评论"
      :visible.sync="visible"
      @closed="onClose()"
    >
      <div class="topic">
        资讯：<span>#{{ data.title }}#</span>
      </div>

      <el-empty v-if="list.length === 0" v-loading="loading" description="暂无数据" />
      <div v-else v-loading="loading" class="comment-list">
        <div v-for="(item, index) in list" :key="index" class="comment-item">
          <div class="comment-meta">
            <el-avatar class="avatar" size="small" icon="el-icon-user-solid" :src="item.user && domin + item.user.avatar" />
            <el-popover
              placement="bottom-start"
              width="200"
              trigger="hover"
            >
              <div>
                <div>#{{ item.user.id }}</div>
                <div>{{ item.user.name }}</div>
                <div>{{ item.user.phone }}</div>
              </div>
              <span slot="reference">
                <span class="name">{{ item.user.name }}</span>
              </span>
            </el-popover>
            <span class="time">{{ item.created_at }}</span>
          </div>
          <div class="comment-content comment-sibling">
            <div class="comment-text">
              {{ item.content }}
            </div>
            <div class="comment-footer">
              <span class="item-btn"><i class="el-icon-thumb" />{{ item.like }}</span>
              <span class="item-btn" :class="item.replys_count > 0 ? 'item-round' : ''" @click="onLookReplys(item)"><i class="el-icon-chat-line-round" />{{ item.replys_count }}</span>
            </div>
          </div>
        </div>
      </div>
      <pagination
        v-show="pages.total > 0"
        :total="pages.total"
        :page.sync="pages.current"
        :limit.sync="pages.limit"
        @pagination="getList()"
      />
    </el-dialog>
    <!-- 弹窗, 回复 -->
    <replys
      v-if="replysVisible"
      ref="replys"
    />
  </div>
</template>
<script>
import { DominKey, getToken } from '@/utils/auth'
import Pagination from '@/components/Pagination'
import Replys from './Replys'
import { commentsList } from '@/api/information'

export default {
  name: 'Comment',
  components: { Pagination, Replys },
  data() {
    return {
      visible: false,
      loading: false,
      forbidVisible: false,
      domin: getToken(DominKey),
      search: {
        target_id: 0,
        target_type: 'information'
      },
      data: {
        id: 0,
        title: ''
      },
      list: [],
      pages: {
        total: 0,
        limit: 20,
        current: 1
      },
      replysVisible: false
    }
  },
  methods: {
    init(data) {
      this.visible = true
      this.search.id = data.id
      this.data = data
      this.getList()
    },
    getList(page = this.pages.current, loading = true) {
      if (this.loading) return
      this.loading = loading
      if (page === 1) this.pages.current = page
      commentsList({ page, limit: this.pages.limit, ...this.search })
        .then((response) => {
          this.list = response.data.data
          this.pages.total = response.data.total
        })
        .catch(() => {})
        .finally(() => {
          this.loading = false
        })
    },
    onLookReplys(data) {
      this.replysVisible = true
      this.$nextTick(() => {
        this.$refs.replys && this.$refs.replys.init(data)
      })
    },
    onClose() {
      this.$reset('search', false)
    }
  }
}
</script>

<style lang="scss" scoped>
.topic {
  margin-bottom: 20px;
  font-size: 16px;
  span {
    color: #eb7340;
  }
}
.comment-list {
  .comment-item {
    padding: 10px 0;
    position: relative;
    &:first-child {
      border-top: 1px solid #dcdfe6;
    }
    &::after {
      content: '';
      position: absolute;
      left: 0;
      right: 0;
      bottom: 0;
      display: block;
      margin-left: 40px;
      border-bottom: 1px solid #dcdfe6;
    }
    &:hover {
      .comment-content .comment-footer .item-delete {
        visibility: visible;
      }
    }
  }
  .comment-none-border {
    &::after {
      border-bottom: 0;
    }
  }
  .comment-sibling {
    padding-left: 40px;
  }
  .comment-meta {
    margin-bottom: 4px;
    .avatar {
      vertical-align: middle;
      margin-right: 12px;
    }
    .name {
      font-weight: 500;
      font-size: 15px;
    }
    .time {
      float: right;
      color: #8590a6;
    }
  }
  .comment-content {
    margin-bottom: 6px;
    .comment-text{
      margin-bottom: 6px;
      font-size: 15px;
    }
    .comment-footer {
      color: #8590a6;
      .item-btn {
        margin-right: 12px;
        i {
          margin-right: 4px;
        }
      }
      .item-round {
        color: #409eff;
        cursor: pointer;
      }
      .item-delete {
        color: #f56c6c;
        cursor: pointer;
      }
    }
  }
}
</style>
