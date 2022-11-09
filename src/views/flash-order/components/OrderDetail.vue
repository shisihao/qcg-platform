<template>
  <el-dialog :title="`${row.type==='goods'?'藏品':'盲盒'}详情`" width="1000px" :visible.sync="visible" @closed="onClose()">
    <el-descriptions size="medium">
      <el-descriptions-item :label="row.type==='goods'?'藏品':'盲盒'" :span="3">
        <div v-if="row.type==='goods'" class="good-img">
          <el-image
            v-for="(item, index) in row.goods.images"
            :key="index"
            class="image-item"
            fit="contain"
            :src="item"
            @click="onPicturePreview(row.goods.images, index)"
          />
        </div>
        <div v-else class="good-img">
          <el-image
            v-for="(item, index) in row.box.images"
            :key="index"
            class="image-item"
            fit="contain"
            :src="item"
            @click="onPicturePreview(row.box.images, index)"
          />
        </div>
      </el-descriptions-item>
      <el-descriptions-item label="名称" :span="3">
        {{ row.type==='goods'?row.goods.name:row.box.name }}
      </el-descriptions-item>
      <div v-if="row.type==='goods'">
        <el-descriptions-item label="编号">
          {{ row.goods.serial }}
        </el-descriptions-item>
        <el-descriptions-item label="铸造总数">
          {{ row.goods.cast_goods_stock }}
        </el-descriptions-item>
      </div>
      <el-descriptions-item label="所属平台" :span="2">
        <el-image
          class="icon-logo"
          fit="cover"
          :src="row.issuer.image&& domin + row.issuer.image"
        >
          <div slot="error" class="image-slot">
            <i class="el-icon-picture-outline" />
          </div>
        </el-image>
        {{ row.issuer.name }}
      </el-descriptions-item>
    </el-descriptions>

    <el-descriptions size="medium" title="订单详情">
      <el-descriptions-item label="订单号">
        {{ row.order_no }}
      </el-descriptions-item>
      <el-descriptions-item label="订单状态">
        <el-tag :effect="row.status === 4 ? 'plain' : 'light'" :type="row.status | paraphrase(orderStatusOptions, 'value', 'type')">
          {{ row.status | paraphrase(orderStatusOptions) }}
        </el-tag>
      </el-descriptions-item>
      <el-descriptions-item label="支付价格">
        <svg-icon icon-class="money" style="color: #e6a23c;" /> {{ row.cny_price }}
      </el-descriptions-item>
      <el-descriptions-item label="保证金比例">
        {{ row. deposit }}(%)
      </el-descriptions-item>
      <el-descriptions-item label="保证金数量">
        {{ row. deposit_amount }}
      </el-descriptions-item>
      <el-descriptions-item label="保证金状态">
        <el-tag effect="plain" :type="row.deposit_status | paraphrase(depositOptions,'value', 'type')">{{ row.deposit_status | paraphrase(depositOptions) }}</el-tag>
      </el-descriptions-item>
      <el-descriptions-item label="手续费金额">
        {{ row.consignment.extend.charge_fee }}（{{ row.consignment.extend.charge }}%）
      </el-descriptions-item>
      <el-descriptions-item label="版权费金额">
        {{ row.consignment.extend.copyright_fee }}（{{ row.consignment.extend.copyright }}%）
      </el-descriptions-item>
      <el-descriptions-item label="总计">
        {{ row.consignment.extend.total_fee }}（{{ row.consignment.extend.charge + row.consignment.extend.copyright }}%）
      </el-descriptions-item>
      <el-descriptions-item label="创建时间">
        {{ row.created_at || '-' }}
      </el-descriptions-item>
      <el-descriptions-item label="支付时间">
        {{ row.pay_time || '-' }}
      </el-descriptions-item>
      <el-descriptions-item label="确认时间">
        {{ row.confirm_time || '-' }}
      </el-descriptions-item>
      <el-descriptions-item label="平台介入时间">
        {{ row.intervene_time || '-' }}
      </el-descriptions-item>
      <el-descriptions-item label="平台处理时间">
        {{ row.handle_time || '-' }}
      </el-descriptions-item>
      <el-descriptions-item label="关闭时间">
        {{ row.close_time || '-' }}
      </el-descriptions-item>
      <el-descriptions-item label="卖方信息">
        <div v-if="row.consignment && row.consignment.user">
          <el-avatar
            :key="row.consignment.user.id"
            icon="el-icon-user-solid"
            :src="row.consignment.user.avatar ? domin + row.consignment.user.avatar : ''"
          />
          <div style="display: inline-block;margin-left: 2px">
            <div>
              # {{ row.consignment.user.id }}
              <el-divider direction="vertical" />
              {{ row.consignment.user.name }}
            </div>
            <div>
              {{ row.consignment.user.phone || row.consignment.user.email }}
            </div>
            <div v-show="row.intervene_user_id===row.consignment.user_id">
              <el-tag>申请介入</el-tag>
            </div>
          </div>
        </div>
        <div v-else>
          用户已删除
        </div>
      </el-descriptions-item>
      <el-descriptions-item label="买方信息">
        <div v-if="row.user">
          <el-avatar
            :key="row.user.id"
            icon="el-icon-user-solid"
            :src="row.user.avatar ? domin + row.user.avatar : ''"
          />
          <div style="display: inline-block;margin-left: 2px">
            <div>
              # {{ row.user.id }}
              <el-divider direction="vertical" />
              {{ row.user.name }}
            </div>
            <div>
              {{ row.user.phone || row.user.email }}
            </div>
            <div v-show="row.intervene_user_id===row.user.id">
              <el-tag>申请介入</el-tag>
            </div>
          </div>
        </div>
        <div v-else>
          用户已删除
        </div>
      </el-descriptions-item>
      <el-descriptions-item label="支付方式">
        <el-popover placement="bottom-start" trigger="hover" popper-class="popover-box popover-top">
          <div>
            <div>
              <svg-icon :icon-class="row.pay_type" /> {{ row.pay_type | paraphrase(payOptions) }}
            </div>
            <div>{{ row.account_info.name }}</div>
            <div>{{ row.account_info.account }}</div>
            <div v-show="row.account_info.qr_code">
              <el-image class="img-item" :src="row.account_info.qr_code && domin + row.account_info.qr_code" :preview-src-list="[row.account_info.qr_code && domin + row.account_info.qr_code]" />
            </div>
            <div v-show="row.account_info.deposit_bank">{{ row.account_info.deposit_bank }}</div>
          </div>
          <div slot="reference" style="display: inline-block;">
            <svg-icon :icon-class="row.pay_type" /> {{ row.pay_type | paraphrase(payOptions) }} <i class="el-icon-zoom-in" />
          </div>
        </el-popover>
      </el-descriptions-item>
      <el-descriptions-item label="处理结果" :span="3">
        {{ row.handle_result==='buy'?'归属买方':row.handle_result==='sell'?'归属卖方':'-' }}
      </el-descriptions-item>
      <el-descriptions-item label="操作人" :span="3">
        {{ row.admin?row.admin.name : '-' }}
      </el-descriptions-item>
      <el-descriptions-item v-if="row.type==='goods'" label="交易HASH" :span="3">
        {{ row.hash || '-' }}
      </el-descriptions-item>
      <el-descriptions-item label="付款凭证" :span="3">
        <div v-if="row.credential">
          <el-image class="img-item" fit="cover" :src="row.credential && domin + row.credential" :preview-src-list="[row.credential && domin + row.credential]" />
        </div>
        <div v-else>
          -
        </div>
      </el-descriptions-item>
    </el-descriptions>

    <el-image-viewer
      v-if="imageViewer"
      :z-index="3000"
      :on-close="closeViewer"
      :url-list="imageViewerList"
    />

    <el-dialog
      title="详情说明"
      width="800px"
      append-to-body
      :visible.sync="editTinymceVisible"
    >
      <div class="dialog-img" v-html="row.detail" />
    </el-dialog>

  </el-dialog>
</template>

<script>
import { getToken, DominKey } from '@/utils/auth'
import ElImageViewer from 'element-ui/packages/image/src/image-viewer'
import { whetherOptions, orderStatusOptions, payOptions, goodsTypeOptions } from '@/utils/explain'

export default {
  name: 'OrderDetail',
  components: { ElImageViewer },
  data() {
    return {
      domin: getToken(DominKey),
      visible: false,
      whetherOptions,
      payOptions,
      orderStatusOptions,
      goodsTypeOptions,
      depositOptions: [
        { label: '冻结', value: 0, type: 'danger' },
        { label: '退还', value: 1, type: '' },
        { label: '扣除', value: 2, type: 'warning' }
      ],
      imageViewerList: [],
      imageViewer: false,
      editTinymceVisible: false,
      row: {
        pay_type: '',
        goods: {
          images: []
        },
        box: {
          images: []
        },
        issuer: {
          name: '',
          image: ''
        },
        consignment: {
          pay_type: {},
          extend: {},
          user: {},
          user_goods: {}
        },
        user: {},
        account_info: {}
      }
    }
  },
  methods: {
    init(data) {
      this.visible = true
      this.row = JSON.parse(JSON.stringify(data))
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
    onClose() {
      this.$reset('', false)
    }
  }
}
</script>
<style lang="scss" scoped>
.good-img {
  display: flex;
  flex-wrap: wrap;
  .image-item {
    width: 80px;
    height: 80px;
    margin-right: 10px;
    margin-bottom: 10px;
  }
}
.icon-logo {
  width: 30px;
  height: 30px;
  vertical-align: middle;
  margin-right: 3px;
}
.el-tag {
  margin-right: 4px;
}

.img-item {
  width: 100px;
  height: 100px;
}
.el-avatar {
  vertical-align: top;
}
</style>
