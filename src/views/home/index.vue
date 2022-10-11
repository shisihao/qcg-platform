<template>
  <div class="app-container">
    <el-descriptions title="藏友之家信息" :column="1">
      <el-descriptions-item label="名称">{{ data.name }}</el-descriptions-item>
      <el-descriptions-item label="字母索引">{{ data.index }}</el-descriptions-item>
      <el-descriptions-item label="logo">
        <el-image
          style="width: 100px; height: 100px"
          :src="domin+data.logo"
          fit="contain"
        />
      </el-descriptions-item>
      <el-descriptions-item label="链接">{{ data.url }}</el-descriptions-item>
      <el-descriptions-item label="平台简介">{{ data.intro }}</el-descriptions-item>
    </el-descriptions>
    <el-button type="primary" style="margin-top:10px" @click="onAddOrUpdate(data)">编辑</el-button>

    <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshList="getList()" />
  </div>
</template>

<script>
import { dataList } from '@/api/home'
import AddOrUpdate from './components/AddOrUpdate'
import { getToken, DominKey } from '@/utils/auth'

export default {
  name: 'Index',
  components: { AddOrUpdate },
  data() {
    return {
      domin: getToken(DominKey),
      show: true,
      addOrUpdateVisible: false,
      data: {}
    }
  },
  created() {
    this.init()
  },
  methods: {
    init() {
      this.getList()
    },
    getList() {
      dataList().then(response => {
        if (!response.data) {
          this.onAddOrUpdate()
          return
        }
        this.data = response.data
      })
    },
    onAddOrUpdate(data) {
      this.addOrUpdateVisible = true
      this.$nextTick(() => {
        this.$refs.addOrUpdate && this.$refs.addOrUpdate.init(data)
      })
    }
  }
}
</script>

<style  scoped>
</style>
