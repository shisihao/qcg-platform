<template>
  <div class="dashboard-container">
    <div class="app-container">
      <home-item />
      <user-chart />
    </div>
  </div>
</template>

<script>
import HomeItem from './components/HomeItem'
import UserChart from './components/UserChart'

export default {
  name: 'Dashboard',
  components: { HomeItem, UserChart },
  data() {
    return {

    }
  }
}
</script>
<style lang="scss" scoped>
  .dashboard-container {
    background-color: #F0F2F5;
  }
</style>
