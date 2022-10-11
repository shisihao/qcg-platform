import request from '@/utils/request'

// 列表
export function dataList(params) {
  return request.get('/topics', {
    params
  })
}

// 添加
export function addOrUpdate(data) {
  return request.post('/topics', {
    ...data
  })
}

// 评论列表
export function commentsList(params) {
  return request.get(`/comments`, {
    params
  })
}

// 回复列表
export function replyList({ id, ...params }) {
  return request.get(`/comments/${id}/reply`, {
    params
  })
}

// 导出订单
export function exportOrder(params) {
  return request.get('/topics/export', {
    params
  })
}

// 删除
export function deleteData(id) {
  return request.delete(`/topics/${id}`)
}
