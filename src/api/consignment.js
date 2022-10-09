import request from '@/utils/request'

// 广告列表
export function dataList(params) {
  return request.get('/consignment', {
    params
  })
}

// 详情
export function detailList(id, params) {
  return request.get(`/consignment/${id}`, {
    params
  })
}

