import request from '@/utils/request'

// 资产增加/扣除
export function updateScore({ ...data }) {
  return request.post(`/config/score`, {
    ...data
  })
}
