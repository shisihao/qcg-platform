export const pages = {
  total: 0,
  limit: 20,
  current: 1
}

export const actionOptions = [
  { label: '全部', value: '' },
  { label: '收入', value: 1 },
  { label: '支出', value: 2 }
]

export const statusOptions = [
  { label: '全部', value: '' },
  { label: '上架', value: 0 },
  { label: '下架', value: 1 }
]
export const statusAccount = [
  { label: '全部', value: '' },
  { label: '待申请', value: 0, type: '' },
  { label: '审核中', value: 1, type: 'info' },
  { label: '被驳回', value: 3, type: 'warning' },
  { label: '已完成', value: 2, type: 'success' }
]
export const consignmentOptions = [
  { label: '全部', value: '' },
  { label: '下架', value: 0, type: 'danger' },
  { label: '在售', value: 1, type: 'primary' },
  { label: '锁定', value: 2, type: 'warning' },
  { label: '售出', value: 3, type: 'success' }
]
export const marketconsignmentOptions = [
  { label: '全部', value: '' },
  { label: '下架', value: 0, type: 'danger' },
  { label: '上架', value: 1, type: 'primary' },
  { label: '锁定', value: 2, type: 'warning' },
  { label: '售出', value: 3, type: 'success' }
]

export const verifyStatusOptions = [
  { label: '全部', value: '' },
  { label: '待审核', value: 0, type: '' },
  { label: '通过', value: 1, type: 'success' },
  { label: '驳回', value: 2, type: 'danger' },
  { label: '处理中', value: 3, type: 'warning' }
]

export const whetherOptions = [
  { label: '全部', value: '' },
  { label: '否', value: 0 },
  { label: '是', value: 1 }
]

export const orderStatusOptions = [
  { label: '全部', value: '' },
  { label: '待支付', value: 0, type: 'warning' },
  { label: '已支付', value: 1, type: 'primary' },
  { label: '已完成', value: 2, type: 'success' },
  { label: '已关闭', value: 3, type: 'info' },
  { label: '平台介入', value: 4, type: 'danger' }
]

export const marketorderStatusOptions = [
  { label: '全部', value: '' },
  { label: '待支付', value: 0, type: 'warning' },
  { label: '已支付', value: 1, type: 'primary' },
  { label: '已发货', value: 2, type: 'success' },
  { label: '已完成', value: 3, type: 'primary' },
  { label: '已关闭', value: 4, type: 'info' },
  { label: '平台介入', value: 5, type: 'danger' }
]

export const payOptions = [
  { label: '全部', value: '' },
  { label: '微信', value: 'wxpay' },
  { label: '支付宝', value: 'alipay' },
  { label: '银行卡', value: 'bank' },
  { label: '京东', value: 'jdpay' },
  { label: '云账户', value: 'sandpay' },
  { label: '杉德快捷充值', value: 'sandpay_recharge' }
]

export const examineStatusOptions = [
  { label: '全部', value: '' },
  { label: '通过', value: 1, type: 'success' },
  { label: '失败', value: 2, type: 'danger' }
]

export const remindTypeOptions = [
  { label: '卖方', value: 'sell' },
  { label: '买方', value: 'buy' }
]

export const orderstatusOptions = [
  { label: '完成', value: 'success' },
  { label: '关闭', value: 'close' }
]

export const payTypeOptions = [
  { label: '全部', value: '' },
  { label: '人民币', value: 'cny' }
]

export const goodsTypeOptions = [
  { label: '藏品', value: 'goods', type: 'primary' },
  { label: '盲盒', value: 'box', type: 'danger' }
]

export const disabledPickerOptions = {
  disabledDate(time) {
    return time.getTime() < Date.now() - 8.64e7
  }
}

export const pickerOptions = {
  shortcuts: [{
    text: '最近24小时',
    onClick(picker) {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24)
      picker.$emit('pick', [start, end])
    }
  }, {
    text: '最近一周',
    onClick(picker) {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
      picker.$emit('pick', [start, end])
    }
  }, {
    text: '最近一个月',
    onClick(picker) {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
      picker.$emit('pick', [start, end])
    }
  }, {
    text: '最近三个月',
    onClick(picker) {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
      picker.$emit('pick', [start, end])
    }
  }]
}
