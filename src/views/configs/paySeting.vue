<template>
  <div class="app-container">
    <el-tabs v-model="activeName" type="card">
      <el-tab-pane label="支付开关" name="0">
        <pay-switch ref="switch" />
      </el-tab-pane>
      <el-tab-pane label="充值配置" name="1">
        <pay ref="seting" />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import pay from './components/pay'
import paySwitch from './components/paySwitch'

export default {
  name: 'PaySeting',
  components: { pay, paySwitch },
  data() {
    return {
      activeName: 0
    }
  },
  watch: {
    activeName(newName) {
      if (newName === '1') {
        this.$refs.seting.getList()
      } else {
        this.$refs.switch.getList()
      }
    }
  },
  methods: {
  }
}
</script>

