import Cookies from 'js-cookie'

export const TokenKey = 'qcg-plat-Token'
export const OssKey = 'qcg-plat-oss-Token'
export const DominKey = 'qcg-plat-domin-Token'
export const Userlogo = 'qcg-plat-logo'

export function getToken(key = TokenKey) {
  return Cookies.get(key)
}

export function setToken(token, key = TokenKey) {
  return Cookies.set(key, token)
}

export function setLogo(logo, key = Userlogo) {
  return Cookies.set(key, logo)
}

export function removeToken(key = TokenKey) {
  return Cookies.remove(key)
}
