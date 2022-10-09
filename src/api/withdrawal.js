import request from '@/utils/request'

// 列表
export function dataList(params) {
  return request.get('/withdrawals', {
    params
  })
}

// 审核
export function examineStatus(id, data) {
  return request.put(`/withdrawals/audit/${id}`, {
    ...data
  })
}

// 导出
export function exportWithdrawalsExcel(params) {
  return request.get(`/withdrawals/export`, {
    params
  })
}

// 导出线下充值
export function exportRechargeExcel(params) {
  return request.get(`/sys_recharge/export`, {
    params
  })
}
