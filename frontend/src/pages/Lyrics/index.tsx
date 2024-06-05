import React from 'react'
import { useAppSelector } from '~/hooks'
import style from '~/styles/TrackDetails.module.css'

const Lyrics = () => {
  const { track, listInfo } = useAppSelector(
    (state) => state.trackPlay
  )
  return (
    <div
      className={style.track__lyrics}
      style={{
        backgroundColor: listInfo?.background
          ? listInfo?.background
          : 'unset'
      }}
    >
      <div
        className={style.track__lyrics__ctn}
        dangerouslySetInnerHTML={{
          __html: track?.lyrics
            ? track?.lyrics.replace(/\n/g, '<br />')
            : ''
        }}
      ></div>
    </div>
  )
}

export default Lyrics
