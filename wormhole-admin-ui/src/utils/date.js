let formatNum = n => n > 10 ? n : ('0' + n)

export const formatDate = (date) => {
  const o = {
    year: date.getFullYear(),
    month: formatNum(date.getMonth() + 1),
    day: formatNum(date.getDate()),
    hours: formatNum(date.getHours()),
    minutes: formatNum(date.getMinutes()),
    seconds: formatNum(date.getSeconds())
  }
  return `${o.year}-${o.month}-${o.day} ${o.hours}:${o.minutes}:${o.seconds}`
}
