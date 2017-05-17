import { UNITS } from 'utils/config'
import datetime from 'nd-datetime'

const { SECOND, MINUTE, HOUR, KM, METER, GROUP, NUM, CLUD } = UNITS

const getNetStatus = () => {
  if (window.Bridge) {
    const network = window.Bridge.require('sdp.network')
    return network && network.getStatus({}).toLowerCase() !== 'unknown'
  } else {
    return navigator.onLine
  }
}

/**
 * 单位转换
 * @method getUnit
 * @param  {Object} unitData 单位详细对象
 * @return {Object}          单位对象
 */
const getUnit = unitData => {
  const tmp = {
    type: 1,
    icon: 'fire',
    unit: 'NUM'
  }
  switch (unitData.unit) {
    case SECOND:
      tmp.label = '运动时长'
      tmp.unitLabel = '秒'
      tmp.icon = 'hour-glass'
      break
    case MINUTE:
      tmp.label = '运动时长'
      tmp.unitLabel = '分钟'
      tmp.icon = 'hour-glass'
      break
    case HOUR:
      tmp.label = '运动时长'
      tmp.unitLabel = '小时'
      tmp.icon = 'hour-glass'
      break
    case KM:
      tmp.label = '运动距离'
      tmp.unitLabel = '千米'
      tmp.type = 2
      break
    case METER :
      tmp.label = '运动距离'
      tmp.unitLabel = '米'
      tmp.type = 2
      break
    case GROUP:
      tmp.label = '运动组数'
      tmp.unitLabel = '组'
      tmp.type = 2
      break
    case NUM:
      tmp.label = '运动次数'
      tmp.unitLabel = '次'
      tmp.type = 2
      break
    case CLUD:
      tmp.label = '运动杆数'
      tmp.unitLabel = '杆'
      tmp.type = 2
      break
    case 'DAY':
      tmp.unitLabel = '天'
      tmp.type = 2
      break
    case 'MONTH':
      tmp.unitLabel = '月'
      tmp.type = 2
      break
    case 'YEAR':
      tmp.unitLabel = '年'
      tmp.type = 2
      break
    default:
      tmp.label = '运动量'
      tmp.unitLabel = ''
      tmp.type = 2
      break
  }
  Object.assign(tmp, unitData)
  return tmp
}

/**
 * 格式化记录
 * @method formatLog
 * @param  {Array}  items 原始数组
 * @return {Object}        日期排列
 */
const formatLog = items => {
  const logs = {}
  items.map(item => {
    const date = datetime(item['record_time'], 'yyyy-MM-dd').format()
    if (!logs.hasOwnProperty(date)) {
      logs[date] = []
    }
    item.unitItems = item.units.map(unit => {
      return getUnit(unit)
    })
    logs[date].push(item)
  })
  return logs
}

/**
 * 根据单位返回时间戳
 * @method setTimeByUnit
 * @param  {Number}      [num=0]       数值
 * @param  {[type]}      unit          单位
 * @param  {Boolean}     [format=true] 是否格式化，仅对时间有效
 * @return {[type]}                    对应数值
 */
const setTimeByUnit = (num = 0, unit, format = true) => {
  let seconds
  switch (unit) {
    case MINUTE:
      seconds = num * 60
      break
    case HOUR:
      seconds = num * 3600
      break
    case SECOND:
      seconds = num
      break
    default:
      if (num > 1000) {
        return `${(num / 1000)}k`
      }
      return num
  }
  const floor = Math.floor
  const hour = floor(seconds / 3600)
  const minute = floor((seconds - hour * 3600) / 60)
  let second = seconds - hour * 3600 - minute * 60
  if (`${second}`.indexOf('.') !== -1) {
    second = window.parseFloat(window.parseFloat(second).toFixed(2))
  }
  return `${hour}:${minute}:${second}`
}

export {
  getNetStatus,
  formatLog,
  setTimeByUnit
}
