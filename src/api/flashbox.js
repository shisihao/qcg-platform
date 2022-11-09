import request from '@/utils/request'

// 列表
export function dataList(params) {
  return request.get('/box', {
    params
  })
}

// 修改详情
export function putBoxDetail(id, data) {
  return request.put('/box/' + id, {
    ...data
  })
}
