import React from 'react'
import style from '~/styles/AdminHome.module.css'
import {
  MdMusicNote,
  MdOutlineLibraryMusic
} from 'react-icons/md'
import { IoPeople } from 'react-icons/io5'

interface Props {
  countUsers: number
  countArtists: number
  countListTracks: number
  countTracks: number
}

const Total = ({
  countArtists,
  countListTracks,
  countTracks,
  countUsers
}: Props) => {
  return (
    <div className={style.total}>
      <div className={style.item}>
        <div className={style.icon}>
          <MdMusicNote />
        </div>
        <div>
          <h1 className={style.value}>{countTracks}</h1>
          <h2 className={style.name}>Bài hát</h2>
        </div>
      </div>
      <div className={style.item}>
        <div className={style.icon}>
          <MdOutlineLibraryMusic />
        </div>
        <div>
          <h1 className={style.value}>{countListTracks}</h1>
          <h2 className={style.name}>Danh sách phát</h2>
        </div>
      </div>
      <div className={style.item}>
        <div className={style.icon}>
          <IoPeople />
        </div>
        <div>
          <h1 className={style.value}>{countUsers}</h1>
          <h2 className={style.name}>Người nghe</h2>
        </div>
      </div>
      <div className={style.item}>
        <div className={style.icon}>
          <IoPeople />
        </div>
        <div>
          <h1 className={style.value}>{countArtists}</h1>
          <h2 className={style.name}>Nghệ sĩ</h2>
        </div>
      </div>
    </div>
  )
}

export default Total
