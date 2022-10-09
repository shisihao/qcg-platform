import request from '@/utils/request'

// 配置公户信息
export function UpdateAccount(data) {
  return request.post('bank-info', {
    ...data
  })
}
// 获取用户信息
export function dataList() {
  return request.get('/user')
}

// 获取账单
export function billsList(params) {
  return request.get('/bills', {
    params
  })
}

// 获取配置信息
export function configList() {
  return request.get('/config')
}

// 申请账单
export function UpdateBills(id) {
  return request.put(`bills/${id}/submit`)
}

// 收益账单导出
export function exportAccount(params) {
  return request.get('export/bills', {
    params
  })
}