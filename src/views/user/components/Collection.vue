<template>
  <div>
    <el-dialog top="30px" :title="`用户 ${form.name} 的藏品`" :visible.sync="visible" @closed="onClose()">
      <el-form :inline="true" :model="search">
        <el-form-item label="藏品类型">
          <el-select v-model="search.type" @change="getList(1)">
            <el-option v-for="item in typeOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="顺序">
          <el-select v-model="search.sort_time" @change="getList(1)">
            <el-option v-for="item in sortTypeOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
      </el-form>
      <h4>商品总数: {{ pages.total }}</h4>
      <el-table
        v-loading="loading"
        border
        highlight-current-row
        :data="list"
      >
        <el-table-column
          type="index"
          label="ID"
          width="60"
          align="center"
        />
        <el-table-column
          width="320"
          label="藏品信息"
          header-align="center"
        >
          <template slot-scope="{ row }">
            <div class="info-wrapper">
              <el-image
                class="image-item"
                fit="contain"
                :src="row.images&&`${row.oss_url}${row.images}`"
                :preview-src-list="[row.images&&`${row.oss_url}${row.images}`]"
              >
                <div slot="error" class="image-slot">
                  <i class="el-icon-picture-outline" />
                </div>
              </el-image>
              <div class="goods-info">
                <div class="goods-name">
                  <span>
                    名称：{{ row.name || '-' }}
                  </span>
                </div>
                <div>编号：{{ `${row.serial}/${row.num}/${row.cast_goods_stock}` }}</div>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          label="平台"
          align="center"
          prop="platform"
        />
        <el-table-column
          label="寄售价格"
          align="center"
          prop="price"
        >
          <template slot-scope="{row}">
            {{ search.type==="own"?'-':row.price }}
          </template>
        </el-table-column>
        <el-table-column
          label="收藏时间"
          width="140"
          align="center"
        >
          <template slot-scope="{ row }">
            {{ row.time|| '-' }}
          </template>
        </el-table-column>
        <el-table-column
          v-if="search.type==='own'"
          align="center"
          label="冻结状态"
        >
          <template slot-scope="{ row }">
            <el-switch
              v-model="row.frozen_status"
              :active-value="1"
              :inactive-value="0"
              @change="onChange(row)"
            />
          </template>

        </el-table-column>
      </el-table>
      <pagination v-show="pages.total > 0" :total="pages.total" :page.sync="pages.current" :limit.sync="pages.limit" @pagination="getList()" />
    </el-dialog>
  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
import { DominKey, getToken } from '@/utils/auth'
import { userCollection, collectionFrozen } from '@/api/user'

export default {
  name: 'CollectionUpdate',
  components: { Pagination },
  data() {
    return {
      typeOptions: [
        { label: '已发布', value: 'publish' },
        { label: '已购买', value: 'buy' },
        { label: '已售出', value: 'selled' },
        { label: '已拥有', value: 'own' }
      ],
      sortTypeOptions: [
        { label: '正序', value: 'asc' },
        { label: '倒序', value: 'desc' }
      ],
      visible: false,
      loading: false,
      list: [],
      domin: getToken(DominKey),
      pages: {
        total: 0,
        limit: 20,
        current: 1
      },
      search: {
        type: 'publish',
        sort_time: 'asc'
      },
      form: {
        id: '',
        name: ''
      }
    }
  },
  methods: {
    init(data) {
      this.visible = true
      this.form.id = data.id
      this.form.name = data.name
      this.getList()
    },
    getList(page = this.pages.current, loading = true) {
      if (this.loading) return
      this.loading = loading
      if (page === 1) this.pages.current = page
      this.list = []
      userCollection(this.form.id, { page, limit: this.pages.limit, ...this.search })
        .then(response => {
          if (response.code !== 0) return
          this.list = response.data.data
          this.pages.total = response.data.total || 0
        })
        .catch(() => { })
        .finally(() => {
          this.loading = false
        })
    },
    onChange(row) {
      collectionFrozen(this.form.id, { frozen_status: row.frozen_status, user_goods_id: row.user_goods_id }).then(res => {
        this.$message.success(res.msg)
      })
    },
    onClose() {
      this.visible = false
    }

  }
}
</script>

<style lang="scss" scoped>
::v-deep .el-dialog {
  width: 850px;
}
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

.goods-info {
  display: inline-block;
  margin-left: 10px;
  vertical-align: top;

  .goods-name {
    width: 185px;
    height: 60px;

    span {
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 3;
      -webkit-box-orient: vertical;
    }
  }

  div:nth-child(2) {
    width: 169px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}
$bg: #2d3a4b;
$dark_gray: #889aa4;
$light_gray: #eee;

.login-container {
  height: 100%;
  width: 100%;
  background-color: $bg;
  overflow: hidden;

  .login-content {
    height: 100%;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }

  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }

  .title-container {
    position: relative;

    .title {
      font-size: 26px;
      color: $light_gray;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: bold;
    }

    .set-language {
      color: #fff;
      position: absolute;
      top: 3px;
      font-size: 18px;
      right: 0px;
      cursor: pointer;
    }
  }

  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }

  .thirdparty-button {
    position: absolute;
    right: 0;
    bottom: 6px;
  }

  @media only screen and (max-width: 470px) {
    .thirdparty-button {
      display: none;
    }
  }
}
</style>
