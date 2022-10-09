<template>
  <div class="app-container">
    <el-tabs v-model="activeName" type="card">
      <el-tab-pane label="提现开关" name="0">
        <withdrawal-switch ref="switch" />
      </el-tab-pane>
      <el-tab-pane label="提现配置" name="1">
        <cny-withdrawal ref="seting" />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import withdrawalSwitch from './components/withdrawalSwitch'
import cnyWithdrawal from './components/cnyWithdrawal'

export default {
  name: 'WithdrawalSeting',
  components: { withdrawalSwitch, cnyWithdrawal },
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

