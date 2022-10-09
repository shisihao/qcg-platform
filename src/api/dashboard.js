import request from '@/utils/request'

// 首页数据
export function getHome() {
  return request.get('summary')
}

// 用户报表
export function usersSales(params) {
  return request.get('summary/charts', {
    params
  })
}
