import request from '@/utils/request'

// 列表
export function dataList(params) {
  return request.get('/ma/orders', {
    params
  })
}

// 集市订单导出订单
export function exportOrder(params) {
  return request.get('/ma/orders/export', {
    params
  })
}
// 代金券批次订单导出
export function exportBatches(params) {
  return request.get('/vouchers/export/batches', {
    params
  })
}

// 代金券导出订单
export function exportVouchers(params) {
  return request.get('/vouchers/export/vouchers', {
    params
  })
}

// 代金券空投导出订单
export function exportAirdrops(params) {
  return request.get('/vouchers/export/airdrops', {
    params
  })
}

// 平台介入
export function interveneOrder({ id, ...data }) {
  return request.put(`/ma/orders/${id}/intervene`, {
    ...data
  })
}

// 平台映射
export function platformList(params) {
  return request.get('/ma/platforms', {
    params
  })
}

// 提醒
export function remindOrder({ id, ...data }) {
  return request.put(`/ma/orders/${id}/remind`, {
    ...data
  })
}

// 链上错误订单处理
export function errorOrder(id) {
  return request.put(`order/${id}/handle`)
}
