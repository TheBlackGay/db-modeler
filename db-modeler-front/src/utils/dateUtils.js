/**
 * 格式化日期
 * @param {string|Date} date 日期
 * @param {string} format 格式化模式
 * @returns {string} 格式化后的日期字符串
 */
export function formatDate(date, format = 'YYYY-MM-DD HH:mm:ss') {
  if (!date) return '-'

  const d = new Date(date)
  
  const formatMap = {
    'YYYY': d.getFullYear(),
    'MM': String(d.getMonth() + 1).padStart(2, '0'),
    'DD': String(d.getDate()).padStart(2, '0'),
    'HH': String(d.getHours()).padStart(2, '0'),
    'mm': String(d.getMinutes()).padStart(2, '0'),
    'ss': String(d.getSeconds()).padStart(2, '0')
  }

  return format.replace(/(YYYY|MM|DD|HH|mm|ss)/g, match => formatMap[match])
}

/**
 * 获取相对时间描述
 * @param {string|Date} date 日期
 * @returns {string} 相对时间描述
 */
export function getRelativeTime(date) {
  const now = new Date()
  const past = new Date(date)
  const diff = now.getTime() - past.getTime()
  
  const seconds = Math.floor(diff / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)
  
  if (days > 30) return formatDate(past)
  if (days > 0) return `${days}天前`
  if (hours > 0) return `${hours}小时前`
  if (minutes > 0) return `${minutes}分钟前`
  if (seconds > 0) return `${seconds}秒前`
  
  return '刚刚'
}

/**
 * 计算两个日期之间的天数
 * @param {string|Date} start 开始日期
 * @param {string|Date} end 结束日期
 * @returns {number} 天数差
 */
export function daysBetween(start, end) {
  const startDate = new Date(start)
  const endDate = new Date(end)
  const timeDiff = Math.abs(endDate.getTime() - startDate.getTime())
  return Math.ceil(timeDiff / (1000 * 3600 * 24))
}

export default {
  formatDate,
  getRelativeTime,
  daysBetween
}
