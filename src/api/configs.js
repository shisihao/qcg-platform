import request from '@/utils/request'

// 获取谷歌验证
export function addAuthenticator() {
  return request.post('/configs/google_authenticator')
}

// 删除谷歌验证
export function delAuthenticator(data) {
  return request.delete('/configs/delete_google_png', {
    data
  })
}

// 版本控制状态
export function versionStatus() {
  return request.get('/configs/version')
}

// 修改版本控制状态
export function putVersionStatus(data) {
  return request.put('/configs/version', {
    ...data
  })
}
// 订单失信配置
export function orderLimit() {
  return request.get('/configs/order_limit')
}

// 修改订单失信配置
export function putOrderLimit(data) {
  return request.put('/configs/order_limit', {
    ...data
  })
}
// 解除失信
export function blacklistCancel(data) {
  return request.post('/configs/blacklist/cancel', {
    ...data
  })
}

// 订单失信列表
export function blacklist(params) {
  return request.get('/configs/blacklist', {
    params
  })
}

// 获取邀请配置
export function invite() {
  return request.get('/configs/invite')
}

// 修改邀请配置
export function putInvite(data) {
  return request.put('/configs/invite', {
    ...data
  })
}

// 提现配置
// export function withdrawal() {
//   return request.get('/configs/withdrawal')
// }

// 提现配置
// export function cnyWithdrawal() {
//   return request.get('/configs/cny/withdrawal')
// }

// 获取Fil钱包分发比例
export function fil() {
  return request.get('/configs/fil')
}

// usdt 兑换 RMB
export function usdt() {
  return request.get('/configs/usdt/price')
}

// 获取 `联系方式`
export function contact() {
  return request.get('configs/contact')
}

// 修改 `联系方式`
export function putContact(data) {
  return request.put('configs/contact', data)
}

// 关于
export function about() {
  return request.get('/configs/about')
}

// 修改关于
export function putAbout(data) {
  return request.put('/configs/about', {
    ...data
  })
}

// 注册协议
export function register() {
  return request.get('/configs/register')
}

// 修改注册协议
export function putRegister(data) {
  return request.put('/configs/register', {
    ...data
  })
}

// 用户等级默认图标
export function icon() {
  return request.get('/configs/default_icon')
}

// 密钥配置
export function ant() {
  return request.get('/configs/ant_config')
}

// 修改密钥配置
export function putAnt(data) {
  return request.put('/configs/ant_config', {
    ...data
  })
}

// 签名配置
export function sign() {
  return request.get('/configs/sign')
}

// 赠送配置
export function giveList() {
  return request.get('/configs/give')
}
export function addGiveList(data) {
  return request.put('/configs/give', {
    ...data
  })
}

// 邀请佣金配置
export function inviteList() {
  return request.get('/configs/invite')
}
export function addinviteList(data) {
  return request.put('/configs/invite', {
    ...data
  })
}

// 热度配置
export function hotList() {
  return request.get('/configs/hot')
}

export function putHotList(data) {
  return request.put('/configs/hot', {
    ...data
  })
}

// 链上说明配置
export function chainList() {
  return request.get('/configs/chain_query')
}

export function addChainList(data) {
  return request.put('/configs/chain_query', {
    ...data
  })
}

// 获取邀请配置
export function topicChain() {
  return request.get('/configs/topic_chain')
}

// 修改邀请配置
export function putTopicChain(data) {
  return request.put('/configs/topic_chain', {
    ...data
  })
}

// 铸造商品配置
export function castList() {
  return request.get('/configs/cast')
}
export function addCastList(data) {
  return request.put('/configs/cast', {
    ...data
  })
}

// 修改支付配置
export function putPay(data) {
  return request.put('/configs/pay_switch', {
    ...data
  })
}

// 支付方式开关配置
export function pay() {
  return request.get('/configs/pay_switch')
}

// 充值配置
export function payConfiguration() {
  return request.get('/configs/pay')
}

// 充值配置
export function putPayConfiguration(data) {
  return request.put('/configs/pay', {
    ...data
  })
}

// 销毁配置
export function putDestroy(data) {
  return request.put('/configs/user_goods/destroy', {
    ...data
  })
}

// 销毁配置
export function destroy() {
  return request.get('/configs/user_goods/destroy')
}

// 客服配置
export function putKf(data) {
  return request.put('/configs/kf', {
    ...data
  })
}

// 客服配置
export function kf() {
  return request.get('/configs/kf')
}

// 购买资格提示
export function qualification() {
  return request.get('/configs/qualification')
}

// 购买资格提示
export function putQualification(data) {
  return request.put('/configs/qualification', {
    ...data
  })
}

// 运费配置
export function postage() {
  return request.get('/configs/postage')
}

// 运费配置
export function putpostage(data) {
  return request.put('/configs/postage', {
    ...data
  })
}

// 商品卷配置
export function commodity() {
  return request.get('/configs/commodity')
}

// 商品卷配置
export function putCommodity(data) {
  return request.put('/configs/commodity', {
    ...data
  })
}

// 实名认证配置
export function certType() {
  return request.get('/configs/cert_type')
}

// 实名认证配置
export function putcertType(data) {
  return request.put('/configs/cert_type', {
    ...data
  })
}

// 短信发送配置
export function smsType() {
  return request.get('/configs/sms_type')
}

// 短信发送配置
export function putSmsType(data) {
  return request.put('/configs/sms_type', {
    ...data
  })
}

// 自动发货时间配置
export function receipt() {
  return request.get('/configs/receipt')
}

// 短信发送配置
export function putReceipt(data) {
  return request.put('/configs/receipt', {
    ...data
  })
}

// 信用分配置
export function score() {
  return request.get('/configs/score')
}

// 信用分配置
export function putScore(data) {
  return request.put('/configs/score', {
    ...data
  })
}

// 最高出售额配置
export function sellPrice() {
  return request.get('/configs/sell_price')
}

// 最高出售额配置
export function putSellPrice(data) {
  return request.put('/configs/sell_price', {
    ...data
  })
}

// 服务费配置
export function fee() {
  return request.get('/configs/fee')
}

// 服务费配置
export function putFee(data) {
  return request.put('/configs/fee', {
    ...data
  })
}

// 收款方式配置
export function accountType() {
  return request.get('/configs/account_type')
}

// 收款方式配置
export function putAccountType(data) {
  return request.put('/configs/account_type', {
    ...data
  })
}

// 提现配置
export function cnyWithdrawal() {
  return request.get('/configs/cny_withdrawal')
}

// 提现配置
export function putCnyWithdrawal(data) {
  return request.put('/configs/cny_withdrawal', {
    ...data
  })
}

// 藏品转移指南
export function transferGuide() {
  return request.get('/configs/transfer_guide')
}

// 藏品转移指南
export function putTransferGuide(data) {
  return request.put('/configs/transfer_guide', {
    ...data
  })
}

// 收款方式验证次数
export function verifyNum() {
  return request.get('/configs/verify_num')
}

// 收款方式验证次数
export function putVerifyNum(data) {
  return request.put('/configs/verify_num', {
    ...data
  })
}

// 藏品寄售协议
export function consignment() {
  return request.get('/configs/consignment_config')
}

// 藏品寄售协议
export function putConsignment(data) {
  return request.put('/configs/consignment_config', {
    ...data
  })
}

// 提现开关配置
export function withdrawalSwitch() {
  return request.get('/configs/withdrawal_switch')
}

// 提现开关配置
export function putWithdrawalSwitch(data) {
  return request.put('/configs/withdrawal_switch', {
    ...data
  })
}

// 客服接入配置
export function intervene() {
  return request.get('/configs/intervene')
}

// 提现开关配置
export function putIntervene(data) {
  return request.put('/configs/intervene', {
    ...data
  })
}

// 购买须知配置
export function purchase() {
  return request.get('/configs/purchase')
}

// 购买须知配置
export function putPurchase(data) {
  return request.put('/configs/purchase', {
    ...data
  })
}

// 限制订单数量
export function limitNumber() {
  return request.get('/configs/un_order_num')
}

// 限制订单数量
export function putLimitNumber(data) {
  return request.put('/configs/un_order_num', {
    ...data
  })
}

// 链上锁单配置
export function lock() {
  return request.get('config/lock')
}

// 链上锁单配置
export function putLock(data) {
  return request.put('config/lock', {
    ...data
  })
}

// 闪汇锁单配置
export function lockFlash() {
  return request.get('config/issuer_lock')
}

// 闪汇锁单配置
export function putLockFlash(data) {
  return request.put('config/issuer_lock', {
    ...data
  })
}

// 开户费用配置
export function openAmount() {
  return request.get('/configs/open_amount')
}

// 开户费用配置
export function putOpenAmount(data) {
  return request.put('/configs/open_amount', {
    ...data
  })
}
