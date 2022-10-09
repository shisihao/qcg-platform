import request from '@/utils/request'

// 列表
export function dataList(params) {
  return request.get('/recharge', {
    params
  })
}

// 导出
export function exportRecharge(params) {
  return request.get('/recharge/export', {
    params
  })
}
