import request from '@/utils/request'

// 列表
export function dataList(params) {
  return request.get('/feedback', {
    params
  })
}

// 往期回复内容
export function detailList(id, params) {
  return request.get(`/feedback/${id}/detail`, {
    params
  })
}

// 回复
export function setReply({ id, ...data }) {
  return request.post(`/feedback/${id}/reply`, {
    ...data
  })
}

// 反馈确认
export function setSolve(id) {
  return request.patch(`/feedback/${id}/solve`)
}

