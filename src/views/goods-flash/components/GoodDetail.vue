<template>

  <el-dialog title="藏品详情" width="1000px" :visible.sync="visible" @closed="onClose()">
    <el-descriptions size="medium" title="藏品">
      <el-descriptions-item label="藏品" :span="3">
        <div class="good-img">
          <el-image
            v-for="(item, index) in row.images"
            :key="index"
            class="image-item"
            fit="contain"
            :src="item && item"
            @click="onPicturePreview(row.images, index)"
          />
        </div>
      </el-descriptions-item>
      <el-descriptions-item label="名称" :span="3">
        {{ row.name }}
      </el-descriptions-item>
      <el-descriptions-item label="标签" :span="3">
        <el-tag v-for="(item, index) in row.tags" :key="index" effect="plain">{{ item }}</el-tag>
      </el-descriptions-item>
      <el-descriptions-item label="编号">
        {{ row.serial }}
      </el-descriptions-item>
      <el-descriptions-item label="铸造总数">
        {{ row.cast_goods_stock }}
      </el-descriptions-item>
      <el-descriptions-item label="是否3D">
        <el-link v-if="row.is_three" class="preview-btn" type="primary" :underline="false" @click="onPreview3d(row)">
          预览<i class="el-icon-view el-icon--right" /></el-link>
        <span v-else :style="`color: ${row.is_three ? '#409eff' : ''}`">{{ row.is_three | paraphrase(whetherOptions)
        }}</span>
      </el-descriptions-item>
      <el-descriptions-item label="发行方">
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
      </el-descriptions-item>
      <el-descriptions-item label="所属平台" :span="2">
        <el-image
          class="icon-logo"
          fit="cover"
          :src="row.issuer && row.issuer.image && domin + row.issuer.image"
        >
          <div slot="error" class="image-slot">
            <i class="el-icon-picture-outline" />
          </div>
        </el-image>
        {{ row.issuer && row.issuer.name }}
      </el-descriptions-item>
      <el-descriptions-item label="合约地址" :span="3">
        {{ row.address }}
      </el-descriptions-item>
      <el-descriptions-item label="交易HASH" :span="3">
        {{ row.hash }}
      </el-descriptions-item>
      <el-descriptions-item label="是否允许寄售" :span="3">
        <el-radio-group v-model="row.sales_status">
          <el-radio v-for="(item,index) in whetherOptions.slice(1)" :key="index" :label="item.value">{{ item.label }}</el-radio>
        </el-radio-group>
      </el-descriptions-item>
      <el-descriptions-item label="自动锁单" :span="3">
        <el-radio-group v-model="row.lock">
          <el-radio v-for="(item,index) in whetherOptions.slice(1)" :key="index" :label="item.value">{{ item.label }}</el-radio>
        </el-radio-group>
      </el-descriptions-item>
      <el-descriptions-item label="自动锁单价格" :span="3">
        <el-input-number v-model="row.lock_price" placeholder="请输入价格" :min="0" :precision="2" controls-position="right" />
      </el-descriptions-item>
      <el-descriptions-item label="藏品描述" :span="3">
        <el-input v-model="row.desc" :disabled="true" type="textarea" :rows="4" />
      </el-descriptions-item>
      <el-descriptions-item label="详情说明" :span="3">
        <el-link type="primary" :underline="false" @click="onTinymce(row.detail)">点击查看</el-link>
      </el-descriptions-item>
    </el-descriptions>

    <el-image-viewer v-if="imageViewer" :z-index="3000" :on-close="closeViewer" :url-list="imageViewerList" />

    <preview-3d ref="preview3d" />

    <edit-tinymce v-if="editTinymceVisible" ref="editTinymce" @info="onInfo" />

    <div slot="footer" class="dialog-footer">
      <el-button type="primary" :loading="btnLoading" @click="onFormSubmit()">
        {{ $t('table.confirm') }}
      </el-button>
      <el-button @click="visible = false">
        {{ $t('table.cancel') }}
      </el-button>
    </div>
  </el-dialog>

</template>

<script>
import { getToken, DominKey } from '@/utils/auth'
import ElImageViewer from 'element-ui/packages/image/src/image-viewer'
import Preview3d from './Preview3d'
import { whetherOptions } from '@/utils/explain'
import EditTinymce from './EditTinymce'
import { putGoodsDetail } from '@/api/goods'

export default {
  name: 'GoodDetail',
  components: { ElImageViewer, Preview3d, EditTinymce },
  data() {
    return {
      domin: getToken(DominKey),
      visible: false,
      whetherOptions,
      imageViewerList: [],
      imageViewer: false,
      editTinymceVisible: false,
      btnLoading: false,
      row: {
        images: [],
        platform_info: {},
        three_url: {}
      }
    }
  },
  methods: {
    init(data) {
      this.visible = true
      this.row = JSON.parse(JSON.stringify(data))
    },
    onPreview3d(data) {
      this.$nextTick(() => {
        this.$refs.preview3d && this.$refs.preview3d.init(data)
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
    onTinymce(data) {
      this.editTinymceVisible = true
      this.$nextTick(() => {
        this.$refs.editTinymce && this.$refs.editTinymce.init(data)
      })
    },
    onInfo(value) {
      this.row.detail = value
    },
    onFormSubmit() {
      this.btnLoading = true
      putGoodsDetail(this.row.id, { detail: this.row.detail, desc: this.row.desc, lock: this.row.lock, lock_price: this.row.lock_price, sales_status: this.row.sales_status })
        .then(({ msg }) => {
          this.$message.success(msg)
          this.visible = false
          this.$emit('refreshList')
        })
        .catch(() => { })
        .finally(() => {
          this.btnLoading = false
        })
    },
    onClose() {
      this.$reset('', false)
    }
  }
}
</script>
<style lang="scss" scoped>
.el-input-number {
  width: 200px;
}
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
</style>
