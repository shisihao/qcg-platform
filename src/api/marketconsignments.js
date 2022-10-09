import request from '@/utils/request'

// 集市藏品
export function dataList(params) {
  return request.get('/ma/consignments', {
    params
  })
}

// 下架藏品
export function deleteData(id) {
  return request.delete(`/ma/consignments/${id}`)
}
