import React from 'react'
import { Playlist } from '~/components/features'
import { DTrack } from '~/types/data'
import style from '~/styles/Search.module.css'

interface Props {
  tracks: DTrack[]
}

const TrackSection = ({ tracks }: Props) => {
  const render: boolean = tracks?.length > 0
  if (!render)
    return (
      <div
        className={`${style.map} loading`}
        style={{
          width: 'auto',
          margin: '0 1rem',
          height: '100vh'
        }}
      ></div>
    )
  return (
    <div
      className={style.map}
      style={{ width: 'auto', margin: '0 1rem' }}
    >
      <h1>Bài hát</h1>
      <Playlist list={tracks} />
    </div>
  )
}

export default TrackSection
