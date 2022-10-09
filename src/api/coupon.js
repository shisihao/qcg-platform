import request from '@/utils/request'

// 获取代金券批次列表
export function dataList(params) {
  return request.get('/vouchers/batches', {
    params
  })
}

// 创建代金券批次
export function addOrUpdate({ id, ...data }) {
  let method = 'POST'
  let url = '/vouchers/batches'

  if (id > 0) {
    method = 'PUT'
    url += `/${id}`
    data.id = id
  }

  return request({ url, method, data })
}

// 获取当前批次代金券列表
export function couponList(params) {
  return request.get('/vouchers', {
    params
  })
}

//
// 空投代金券
export function addOrconoup(data) {
  return request({
    url: '/vouchers/airdrop',
    method: 'post',
    data: data
  })
}

// 批次空投记录
export function recordList(params) {
  return request.get('/vouchers/airdrops', {
    params
  })
}

// 批次赠送记录列表
export function transfersList(params) {
  return request.get('/vouchers/transfers', {
    params
  })
}

// 获取代金券流水
export function logList(params) {
  return request.get('/vouchers/logs', {
    params
  })
}
// 获取代金券流水
export function inviteList(params) {
  return request.get('/rebate/invite/income', {
    params
  })
}

