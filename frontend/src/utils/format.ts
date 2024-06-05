import { format } from 'date-fns'

export const formatTime = (time: number) => {
  if (time >= 3600) {
    const hours = Math.floor(time / 3600)
    const remainingTime = time - hours * 3600
    const minutes = Math.floor(remainingTime / 60)
    const seconds = Math.floor(remainingTime % 60)
    const formattedSeconds = seconds
      .toString()
      .padStart(2, '0')
    return `${hours}:${minutes}:${formattedSeconds}`
  } else {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    const formattedSeconds = seconds
      .toString()
      .padStart(2, '0')
    return `${minutes}:${formattedSeconds}`
  }
}

export const formatDay = (date: string): string => {
  const newDate: Date = new Date(date)
  const formatDay = format(newDate, 'MMM dd, yyyy')
  return formatDay
}

export const calculateDate = (date: string): string => {
  const currentDate: Date = new Date()
  const specificDate: Date = new Date(date)
  const timeDiff: number =
    currentDate.getTime() - specificDate.getTime()

  const monthsDiff: number =
    currentDate.getMonth() +
    1 -
    (specificDate.getMonth() + 1)

  if (monthsDiff < 1) {
    return `Mới tham gia.`
  } else {
    const yearsDiff: number =
      timeDiff / (1000 * 3600 * 24 * 365.25)

    if (yearsDiff < 1) {
      return `${monthsDiff} tháng.`
    } else {
      return `${yearsDiff.toFixed(2)} năm.`
    }
  }
}
export const formatNumber = (number: number) => {
  if (number < 1000) {
    return number.toString()
  } else if (number < 10000) {
    return (number / 1000).toFixed(1) + 'k'
  } else {
    return Math.round(number / 1000) + 'k'
  }
}
