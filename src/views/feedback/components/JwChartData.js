import { getToken, DominKey } from '@/utils/auth'

export class JwChartData {
  constructor(date, text, mine, name, array) {
    this.date = date
    this.text = { 'text': text }
    this.mine = mine
    this.name = name
    this.img
    this.avatar(...array)
  }
  avatar(data, type) {
    if (type === 'user') {
      this.img = data.avatar ? getToken(DominKey) + data.avatar : require('@/assets/images/favicon.png')
    } else if (type === 'system') {
      this.img = require('@/assets/images/favicon.png')
    } else {
      this.img = ''
    }
  }
}
