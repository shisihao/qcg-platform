<template>
  <div>
    <el-dialog
      top="30px"
      width="1000px"
      title="查看回复"
      :visible.sync="visible"
      @closed="onClose()"
    >
      <div class="comment-list">
        <div class="comment-item comment-none-border">
          <div class="comment-meta">
            <el-avatar class="avatar" size="small" icon="el-icon-user-solid" :src="data.user && domin + data.user.avatar" />
            <el-popover
              placement="bottom-start"
              width="200"
              trigger="hover"
            >
              <div>
                <div>#{{ data.user.id }}</div>
                <div>{{ data.user.name }}</div>
                <div>{{ data.user.phone }}</div>
              </div>
              <span slot="reference">
                <span class="name">{{ data.user.name }}</span>
              </span>
            </el-popover>
            <span class="time">{{ data.created_at }}</span>
          </div>
          <div class="comment-content comment-sibling">
            <div class="comment-text">
              {{ data.content }}
            </div>
            <div class="comment-footer">
              <span class="item-btn"><i class="el-icon-thumb" />{{ data.like }}</span>
              <span class="item-btn"><i class="el-icon-chat-line-round" />{{ data.replys_count }}</span>
            </div>
          </div>
        </div>
      </div>
      <div class="reply-num">
        {{ pages.total }} 条回复
      </div>
      <el-empty v-if="list.length === 0" v-loading="loading" description="暂无数据" />
      <div v-else v-loading="loading" class="comment-list">
        <div v-for="(item, index) in list" :key="index" class="comment-item comment-sibling">
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
            <span>
              回复
              <el-popover
                placement="bottom-start"
                width="200"
                trigger="hover"
              >
                <div>
                  <div>#{{ item.reply.user.id }}</div>
                  <div>{{ item.reply.user.name }}</div>
                  <div>{{ item.reply.user.phone }}</div>
                </div>
                <span slot="reference">
                  <span class="name">{{ item.reply.user.name }}</span>
                </span>
              </el-popover>
            </span>
            <span class="time">{{ item.created_at }}</span>
          </div>
          <div class="comment-content comment-sibling">
            <div class="comment-text">
              {{ item.content }}
            </div>
            <div class="comment-footer">
              <span class="item-btn"><i class="el-icon-thumb" />{{ item.like }}</span>
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
  </div>
</template>
<script>
import { DominKey, getToken } from '@/utils/auth'
import Pagination from '@/components/Pagination'
import { replyList } from '@/api/topics'

export default {
  name: 'Comment',
  components: { Pagination },
  data() {
    return {
      visible: false,
      loading: false,
      forbidVisible: false,
      domin: getToken(DominKey),
      search: {
        id: 0
      },
      data: {
        id: 3,
        content: '',
        created_at: '',
        like: 0,
        replys_count: 0,
        user: {
          id: 0,
          name: '',
          phone: '',
          avatar: ''
        }
      },
      list: [],
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
      this.data = data
      this.search.id = data.id
      this.getList()
    },
    getList(page = this.pages.current, loading = true) {
      if (this.loading) return
      this.loading = loading
      if (page === 1) this.pages.current = page
      replyList({ page, limit: this.pages.limit, ...this.search })
        .then((response) => {
          this.list = response.data.data
          this.pages.total = response.data.total
        })
        .catch(() => {})
        .finally(() => {
          this.loading = false
        })
    },
    onClose() {
      this.$reset('search', false)
    }
  }
}
</script>

<style lang="scss" scoped>
.comment-list {
  .comment-item {
    padding: 10px 0;
    position: relative;
    &::after {
      content: '';
      position: absolute;
      left: 0;
      right: 0;
      bottom: 0;
      display: block;
      margin-left: 80px;
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
.reply-num {
  padding: 12px 10px 10px;
  border-top: 1px solid #dcdfe6;
  border-bottom: 1px solid #dcdfe6;
  font-size: 16px;
  font-weight: 500;
}
</style>
