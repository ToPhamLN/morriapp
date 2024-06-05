import React from 'react'
import style from '~/styles/Home.module.css'
import style2 from '~/styles/Card.module.css'
import CardPlaylist from '../CardPlayList'
import { DListTrack } from '~/types/data'
interface Props {
  setExit: React.Dispatch<React.SetStateAction<boolean>>
  listListTrack: DListTrack[]
  nameSection: string
}
const Section = ({
  setExit,
  listListTrack,
  nameSection
}: Props) => {
  return (
    <div className={style.section__playlistrow}>
      <div className={style.container}>
        <button
          className={style.exit}
          onClick={() => setExit(false)}
        >
          X
        </button>
        <h1>{nameSection}</h1>
        <div className={`${style.wrapper} ${style2.grid}`}>
          {listListTrack?.length &&
            listListTrack.map((list, index) => (
              <CardPlaylist key={index} listTrack={list} />
            ))}
        </div>
      </div>
    </div>
  )
}

export default Section
