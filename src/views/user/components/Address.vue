<template>
  <el-dialog :title="`用户 ${name} 的平台地址`" :visible.sync="visible" @closed="onClose()">
    <el-empty v-if="!data.length" v-loading="loading" description="暂无数据" />
    <el-descriptions v-for="(item,index) in data" v-else :key="index" size="medium" :title="`${item.platform_info.name||'-'}`" :column="1" style="margin-bottom:15px">
      <el-descriptions-item label="logo">
        <el-image
          class="image-item"
          :src="item.platform_info.icon&&domin+item.platform_info.icon"
          fit="cover"
          :preview-src-list="[domin+item.platform_info.icon]"
        >
          <div slot="error" class="image-slot">
            <i class="el-icon-picture-outline" />
          </div>
        </el-image>
      </el-descriptions-item>
      <el-descriptions-item label="地址">{{ item.address }}</el-descriptions-item>
    </el-descriptions>
  </el-dialog>
</template>
<script>
import { address } from '@/api/user'
import { getToken, DominKey } from '@/utils/auth'
export default {
  name: 'Address',
  data() {
    return {
      domin: getToken(DominKey),
      visible: false,
      loading: false,
      name: '',
      data: []
    }
  },
  methods: {
    init(data) {
      this.visible = true
      if (data) {
        this.name = data.name
        this.getAddress(data.id)
      }
    },
    getAddress(id) {
      this.loading = true
      address(id)
        .then(response => {
          this.data = response.data
        })
        .finally(() => {
          this.loading = false
        })
    },
    onClose() {
      this.$reset('', false)
    }
  }
}
</script>

<style lang="scss"  scoped>
  .image-item {
    flex-shrink: 0;
    width: 60px;
    height: 60px;
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
</style>
