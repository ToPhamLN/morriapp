import React from 'react'
import { Playlist } from '~/components/features'
import style from '~/styles/Rank.module.css'

const Rank = () => {
  return (
    <div className={style.rank}>
      <div className={style.map}>
        <h1>BXH nhạc mới</h1>
        <Playlist />
      </div>
    </div>
  )
}

export default Rank
