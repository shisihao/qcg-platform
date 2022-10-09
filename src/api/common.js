import request from '@/utils/request'
// 登录
export function login(data) {
  return request.post('/login',
    data
  )
}

// 校验是否绑定谷歌验证码
export function checkBind(data) {
  return request.post('/check_bind',
    data
  )
}

// 绑定谷歌验证码
export function setBind(data) {
  return request.post('/bind',
    data
  )
}

// 获取 菜单栏 Sidebar
export function getMenuNav() {
  return request.get('/nav')
}

// 标签列表
export function tagList(params) {
  return request.get('/public/tag', {
    params
  })
}

// 身份列表
export function identityList(params) {
  return request.get('/public/identity', {
    params
  })
}

// 余额
export function balanceList(id) {
  return request.get(`/public/balance/${id}`)
}

// 平台映射
export function platformList(params) {
  return request.get('/public/platform', {
    params
  })
}

// 发送验证码
export function getCode(data) {
  return request.post('/verification-codes', {
    ...data
  })
}
