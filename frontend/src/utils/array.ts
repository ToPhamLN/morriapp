import { DTrack } from '~/types/data'

export const reverseSuffle = (arr: DTrack[]) => {
  if (arr.length <= 1) {
    return arr
  }
  const [firstElement, ...rest] = arr
  const shuffledArray = [...rest].sort(
    () => Math.random() - 0.5
  )
  shuffledArray.unshift(firstElement)

  return shuffledArray
}

export const sortPlayList = (
  index: number,
  arr: DTrack[]
) => {
  const firstPart: DTrack[] = arr.slice(0, index)
  const lastPart: DTrack[] = arr.slice(index)

  const result: DTrack[] = lastPart.concat(firstPart)

  return result
}

export const findTrack = (item: string, arr: DTrack[]) => {
  return arr.findIndex((song) => song._id === item)
}
