import request from '@/utils/request'

// 用户列表
export function dataList(params) {
  return request.get('/users', {
    params
  })
}

// 添加 / 修改
export function addOrUpdate({ id, ...data }) {
  let method = 'POST'
  let url = '/users'

  if (id > 0) {
    method = 'PUT'
    url += `/${id}`
    data.id = id
  }

  return request({ url, method, data })
}

// 删除
export function deleteData(id) {
  return request.delete(`/users/${id}/delete`)
}

// 用户收藏的
export function userCollection(id, params) {
  return request.get(`/users/collection/${id}`, {
    params
  })
}

// 查询子集
export function subset(id, params) {
  return request.get(`/users/${id}/subset`, {
    params
  })
}

// 导出用户信息
export function exportOrder(params) {
  return request.get('/users/export/info', {
    params
  })
}

// 钱包详情
export function wallet(params) {
  return request.get('/users/wallet', {
    params
  })
}

// 某用户钱包列表
export function walletList(params) {
  return request.get('/users/wallet/logs', {
    params
  })
}

// 销毁
export function onDestroy(data) {
  return request.put(`/users/collection/destroy`, {
    ...data
  })
}

// 指定藏品导出
export function exportSerialExcel(params) {
  return request.get(`/users/serial/export`, {
    params
  })
}

// 用户平台地址
export function address(id) {
  return request.get(`/users/address/${id}`)
}

// 用户收款方式
export function payment(id) {
  return request.get(`/users/payment/${id}`)
}

// 解除信用分锁定
export function relieveScore(id) {
  return request.get(`/users/score/${id}`)
}

// 信用分增减
export function updateScore(id, data) {
  return request.put(`/users/handle_score/${id}`, {
    ...data
  })
}

// 用户藏品冻结
export function collectionFrozen(id, data) {
  return request.put(`/users/collection/${id}/frozen`, {
    ...data
  })
}

// 信用分流水列表
export function scoreLogsList(id, params) {
  return request.get(`/users/score/${id}/logs`, {
    params
  })
}
