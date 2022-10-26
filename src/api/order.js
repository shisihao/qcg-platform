import request from '@/utils/request'

// 列表
export function dataList(params) {
  return request.get('/orders', {
    params
  })
}

// 集市订单导出订单
export function exportOrder(params) {
  return request.get('/orders/export', {
    params
  })
}

// 平台介入
export function interveneOrder({ id, ...data }) {
  return request.put(`/order/${id}/intervene`, {
    ...data
  })
}

// 提醒
export function remindOrder({ id, ...data }) {
  return request.put(`/order/${id}/remind`, {
    ...data
  })
}

// 链上错误订单处理
export function errorOrder(id) {
  return request.put(`order/${id}/handle`)
}

// 手续费奖励明细
export function serviceList(params) {
  return request.get('/rebate-logs', {
    params
  })
}

// 导出手续费奖励明细
export function exportService(params) {
  return request.get('export/rebate-logs', {
    params
  })
}

