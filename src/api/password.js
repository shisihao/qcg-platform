import request from '@/utils/request'

// 修改密码

export function uploadPassword(data) {
  return request.post('user/change-pass', {
    ...data
  })
}
