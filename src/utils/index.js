import { DateTime } from 'luxon'

export function isPlainObject (obj) {
  return Object.prototype.toString.call(obj) === '[object Object]'
}

export function isDateObejct (value) {
  return value instanceof Date
}

export function isValidDate (date) {
  if (date === null || date === undefined) {
    return false
  }
  // TODO: check that the date is actually valid
  return typeof date === 'object'
}

export function isValidRange (date) {
  return Array.isArray(date) &&
    date.length === 2 &&
    isValidDate(date[0]) &&
    isValidDate(date[1]) &&
    (date[1] >= date[0])
}

export function parseTime (time) {
  const values = (time || '').split(':')
  if (values.length >= 2) {
    const hours = parseInt(values[0], 10)
    const minutes = parseInt(values[1], 10)
    return {
      hours,
      minutes
    }
  }
  return null
}

export function formatTime (time, type = '24', a = 'a') {
  let hours = time.hours
  hours = (type === '24') ? hours : (hours % 12 || 12)
  hours = hours < 10 ? '0' + hours : hours
  let minutes = time.minutes < 10 ? '0' + time.minutes : time.minutes
  let result = hours + ':' + minutes
  if (type === '12') {
    let suffix = time.hours >= 12 ? 'pm' : 'am'
    if (a === 'A') {
      suffix = suffix.toUpperCase()
    }
    result = `${result} ${suffix}`
  }
  return result
}

export function formatDate (date, format) {
  try {
    return date.toFormat(format)
  } catch (e) {
    return ''
  }
}

export function parseDate (value, format) {
  try {
    return DateTime.fromFormat(value, format, { zone: 'utc' })
  } catch (e) {
    return false
  }
}

export function throttle (action, delay) {
  let lastRun = 0
  let timeout = null
  return function () {
    if (timeout) {
      return
    }
    const args = arguments
    const elapsed = Date.now() - lastRun
    const callBack = () => {
      lastRun = Date.now()
      timeout = null
      action.apply(this, args)
    }
    if (elapsed >= delay) {
      callBack()
    } else {
      timeout = setTimeout(callBack, delay)
    }
  }
}
