import request from '@/utils/request'

// 列表
export function dataList(params) {
  return request.get('/goods', {
    params
  })
}

// 修改详情
export function putGoodsDetail(id, data) {
  return request.put('/goods/' + id, {
    ...data
  })
}
