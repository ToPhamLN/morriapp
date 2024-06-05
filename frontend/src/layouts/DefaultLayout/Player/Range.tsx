import React from 'react'
import { useAppSelector } from '~/hooks'
import style from '~/styles/Player.module.css'

import { formatTime } from '~/utils/format'

type Props = {
  handleSeek: (
    event: React.ChangeEvent<HTMLInputElement>
  ) => void
}

const Range = ({ handleSeek }: Props) => {
  const { currentTime, track } = useAppSelector(
    (state) => state.trackPlay
  )
  const duration = track?.duration
  return (
    <div className={style.track__range}>
      <span>{formatTime(currentTime)}</span>
      <input
        type='range'
        value={currentTime}
        max={duration || 0}
        onChange={handleSeek}
      />
      <span>{formatTime(duration || 0)}</span>
    </div>
  )
}

export default Range
