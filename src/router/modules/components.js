export const localMap = {
  /* login: require('login/index').default // 同步的方式
  login:()=> import('login/index')      // 异步的方式 */
  menu: () => import('@/views/menu/index'), // 权限管理
  role: () => import('@/views/role/index'), // 角色管理
  admin: () => import('@/views/admin/index'), // 管理员管理
  ad: () => import('@/views/ad/index'), // 广告管理
  user: () => import('@/views/user/index'), // 用户管理
  version: () => import('@/views/version/index'), // 版本管理
  verification: () => import('@/views/verification/index'), // 验证码管理
  message: () => import('@/views/message/index'), // 系统消息
  order: () => import('@/views/orders/index'), // 链上订单管理
  marketorder: () => import('@/views/marketorder/index'), // 集市订单管理
  // feedback: () => import('@/views/feedback/index'), // 反馈管理
  sensitive: () => import('@/views/sensitive/index'), // 敏感词
  agreement: () => import('@/views/agreement/index'), // 协议管理
  log: () => import('@/views/log/index'), // 系统日志
  paySeting: () => import('@/views/configs/paySeting'), // 充值配置
  kf: () => import('@/views/configs/kf'), // 客服配置
  gives: () => import('@/views/configs/give'), // 赠送配置
  about: () => import('@/views/configs/about'), // 关于我们
  contact: () => import('@/views/configs/contact'), // 联系配置
  register: () => import('@/views/configs/register'), // 注册协议
  marketPurchase: () => import('@/views/configs/marketPurchase'), // 注册协议
  invite: () => import('@/views/configs/invite'), // 邀请配置
  score: () => import('@/views/configs/score'), // 信用分配置
  sellPrice: () => import('@/views/configs/sellPrice'), // 最高销售额配置
  fee: () => import('@/views/configs/fee'), // 最高销售额配置
  market: () => import('@/views/configs/market'), // 最高销售额配置
  accountType: () => import('@/views/configs/account-type'), // 收款方式配置
  withdrawalSeting: () => import('@/views/configs/withdrawalSeting'), // 提现配置
  transferGuide: () => import('@/views/configs/transferGuide'), // 藏品转移指南配置
  // verifyNums: () => import('@/views/configs/verifyNums'), // 收款方式验证次数配置
  consignmentConfig: () => import('@/views/configs/consignment'), // 藏品寄售协议配置
  intervene: () => import('@/views/configs/intervene'), // 链上客服介入配置
  marketcustomer: () => import('@/views/configs/marketcustomer'), // 集市客服介入配置
  purchase: () => import('@/views/configs/purchase'), // 购买须知配置
  limitOrderNum: () => import('@/views/configs/limitOrderNum'), // 限制订单数量配置
  lock: () => import('@/views/configs/locksetting'), // 锁单配置
  openAmount: () => import('@/views/configs/openAmount'), // 开户费用配置
  goods: () => import('@/views/goods/index'), // 藏品管理
  platform: () => import('@/views/platform/index'), // 链上平台管理
  marketplatform: () => import('@/views/marketplatform/index'), // 集市平台管理
  consignment: () => import('@/views/consignment/index'), // 链上寄售管理
  marketconsignment: () => import('@/views/marketconsignment/index'), // 集市寄售管理
  withdrawals: () => import('@/views/withdrawals/index'), // 提现管理
  give: () => import('@/views/give/index'), // 赠送管理
  transfer: () => import('@/views/transfer/index'), // 转入转出管理
  certification: () => import('@/views/certification/index'), // 认证管理
  poster: () => import('@/views/poster/index'), // 海报管理
  recharge: () => import('@/views/recharge/index'), // 充值管理
  airdrop: () => import('@/views/airdrop/index'), // 代金券空投管理
  circulation: () => import('@/views/circulation/index'), // 代金券流转记录
  Invitationreward: () => import('@/views/Invitationreward/index'), // 邀请奖励记录
  rebate: () => import('@/views/configs/rebate') // 邀请反佣配置
}