import request from '@/utils/request'

// 列表
export function dataList(params) {
  return request.get('/topics', {
    params
  })
}

// 添加 / 修改
export function addOrUpdate({ id, ...data }) {
  let method = 'POST'
  let url = '/topics'

  if (id > 0) {
    method = 'PUT'
    url += `/${id}`
    data.id = id
  }

  return request({ url, method, data })
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
