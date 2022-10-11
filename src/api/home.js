import request from '@/utils/request'

// 列表
export function dataList(params) {
  return request.get('/home', {
    params
  })
}

// 添加
export function addOrUpdate(data) {
  return request.post('/home', {
    ...data
  })
}
