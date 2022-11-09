<template>
  <el-dialog title="藏品详情" width="1000px" :visible.sync="visible" @closed="onClose()">
    <el-descriptions v-if="row.consignment" size="medium" title="藏品">
      <el-descriptions-item label="藏品" :span="3">
        <div class="good-img">
          <el-image
            v-for="(item, index) in row.consignment.images"
            :key="index"
            class="image-item"
            fit="fill"
            :src="item && domin + item"
            @click="onPicturePreview(row.consignment.images, index, domin)"
          />
        </div>
      </el-descriptions-item>
      <el-descriptions-item label="名称" :span="3">
        {{ row.consignment.title }}
      </el-descriptions-item>
      <el-descriptions-item label="所属平台" :span="2">
        <el-image
          class="icon-logo"
          fit="cover"
          :src="row.consignment.platform && row.consignment.platform.icon && domin + row.consignment.platform.icon"
        >
          <div slot="error" class="image-slot">
            <i class="el-icon-picture-outline" />
          </div>
        </el-image>
        {{ row.consignment.platform && row.consignment.platform.name }}
      </el-descriptions-item>
    </el-descriptions>

    <el-descriptions v-if="row.consignment" size="medium" title="订单详情">
      <el-descriptions-item label="订单号">
        {{ row.order_no }}
      </el-descriptions-item>
      <el-descriptions-item label="订单状态">
        <el-tag v-if="row.intervene_user_id != row.user.id && row.intervene_user_id != row.consignment.user_id && row.status === 5" effect="dark" type="danger">
          平台系统自动介入
        </el-tag>
        <el-tag v-else :effect="row.status === 5 ? 'plain' : 'light'" :type="row.status | paraphrase(marketorderStatusOptions, 'value', 'type')">
          {{ row.status | paraphrase(marketorderStatusOptions) }}
        </el-tag>
      </el-descriptions-item>
      <el-descriptions-item label="支付价格">
        <svg-icon icon-class="money" style="color: #e6a23c;" /> {{ row.cny_price }}
      </el-descriptions-item>
      <el-descriptions-item label="手续费金额">
        {{ row.consignment.extend.total_fee }}
      </el-descriptions-item>
      <el-descriptions-item label="创建时间">
        {{ row.created_at || '-' }}
      </el-descriptions-item>
      <el-descriptions-item label="支付时间">
        {{ row.pay_time || '-' }}
      </el-descriptions-item>
      <el-descriptions-item label="发货时间">
        {{ row.transfer_time || '-' }}
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
      <el-descriptions-item label="支付方式">
        <svg-icon :icon-class="row.pay_type" /> {{ row.pay_type | paraphrase(payOptions) }}
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
      <el-descriptions-item label="处理结果">
        {{ row.handle_result==='buy'?'归属买方':row.handle_result==='sell'?'归属卖方':'-' }}
      </el-descriptions-item>
      <el-descriptions-item label="收货地址">
        {{ row.address_info.address || '-' }}
      </el-descriptions-item>
      <el-descriptions-item label="收货地址备注" :span="3">
        {{ row.address_info.remark || '-' }}
      </el-descriptions-item>
      <el-descriptions-item label="操作人" :span="3">
        {{ row.admin?row.admin.name : '-' }}
      </el-descriptions-item>
      <el-descriptions-item label="发货凭证" :span="3">
        <div v-if="row.transfer_credential">
          <el-image class="img-item" fit="cover" :src="row.transfer_credential && domin + row.transfer_credential" :preview-src-list="[row.transfer_credential && domin + row.transfer_credential]" />
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

  </el-dialog>
</template>

<script>
import { getToken, DominKey } from '@/utils/auth'
import ElImageViewer from 'element-ui/packages/image/src/image-viewer'
import { whetherOptions, marketorderStatusOptions, payOptions } from '@/utils/explain'

export default {
  name: 'OrderDetail',
  components: { ElImageViewer },
  data() {
    return {
      domin: getToken(DominKey),
      visible: false,
      whetherOptions,
      payOptions,
      marketorderStatusOptions,
      depositOptions: [
        { label: '冻结', value: 0, type: 'danger' },
        { label: '退还', value: 1, type: '' },
        { label: '扣除', value: 2, type: 'warning' }
      ],
      imageViewerList: [],
      imageViewer: false,
      row: {}
    }
  },
  methods: {
    init(data) {
      this.visible = true
      this.row = JSON.parse(JSON.stringify(data))
    },
    onPicturePreview(imgArr, index, domin = '') {
      const newImgArr = imgArr.concat()
      const currentItemArr = newImgArr.slice(index, index + 1)
      newImgArr.splice(index, 1)
      const currentArr = currentItemArr.concat(newImgArr).map((v) => {
        return domin ? domin + v : this.domin + v
      })
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
    height:80px;
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
