import request from '@/utils/request'

// 用户列表
export function dataList(params) {
  return request.get('ma/platforms', {
    params
  })
}

// 添加 / 修改
export function addOrUpdate({ id, ...data }) {
  let method = 'POST'
  let url = 'ma/platforms'

  if (id > 0) {
    method = 'PUT'
    url += `/${id}`
    data.id = id
  }

  return request({ url, method, data })
}

// 集市服务费配置
export function fee() {
  return request.get('/configs/ma_consignment_fee')
}

// 集市服务费配置
export function putFee(data) {
  return request.put('/configs/ma_consignment_fee', {
    ...data
  })
}

// 集市信用分配置
export function marketscore() {
  return request.get('/configs/ma_score')
}

// 集市信用分配置
export function marketputScore(data) {
  return request.put('/configs/ma_score', {
    ...data
  })
}

// 集市客服介入时间
export function intervene() {
  return request.get('/configs/ma_intervene')
}

// 集市客服介入时间
export function putIntervene(data) {
  return request.put('/configs/ma_intervene', {
    ...data
  })
}

// 集市购买须知
export function register() {
  return request.get('/configs/ma_purchase')
}

// 集市购买须知
export function putRegister(data) {
  return request.put('/configs/ma_purchase', {
    ...data
  })
}

