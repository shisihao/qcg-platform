export const localMap = {
  /* login: require('login/index').default // 同步的方式
  login:()=> import('login/index')      // 异步的方式 */
  menu: () => import('@/views/menu/index'), // 权限管理
  role: () => import('@/views/role/index'), // 角色管理
  admin: () => import('@/views/admin/index'), // 管理员管理
  ad: () => import('@/views/ad/index'), // 广告管理
  accountmanagement: () => import('@/views/accountmanagement/index'), // 平台方法账单
  topics: () => import('@/views/topics/index'), // 观点管理
  billing: () => import('@/views/billing/index'), // 我的公户信息
  information: () => import('@/views/information/index'), // 资讯管理
  home: () => import('@/views/home/index'), // 藏友之家管理
  plans: () => import('@/views/plans/index'), // 发售计划
  flashorder: () => import('@/views/flash-order/index'), // 闪汇订单管理
  flashgoods: () => import('@/views/flash-goods/index'), // 闪汇藏品管理
  flashbox: () => import('@/views/flash-box/index'), // 闪汇盲盒管理
  marketorder: () => import('@/views/marketorder/index'), // 集市订单管理
  marketplatform: () => import('@/views/marketplatform/index'), // 集市平台管理
  servicecharge: () => import('@/views/servicecharge/index'), // 手续费奖励明细
  copyrightfee: () => import('@/views/copyrightfee/index'), // 版权费奖励明细
  lockFlash: () => import('@/views/configs/lock-flash'), // 版权费奖励明细
  score: () => import('@/views/configs/score') // 信用分管理
}
