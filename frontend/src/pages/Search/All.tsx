import React from 'react'
import {
  CardPlaylist,
  Playlist,
  SlickPlaylist,
  SlickPeople
} from '~/components/features'
import { ECategory } from '~/constants/enum'
import style from '~/styles/Search.module.css'
import {
  DArtist,
  DListTrack,
  DPerson,
  DTrack,
  DUser
} from '~/types/data'

interface Props {
  listTracks: DListTrack[]
  tracks: DTrack[]
  users: DUser[]
  artists: DArtist[]
}
const All = ({
  listTracks,
  tracks,
  users,
  artists
}: Props) => {
  return (
    <React.Fragment>
      <div className={style.main}>
        {listTracks?.filter(
          (track) => track.category !== ECategory.PLAYLIST
        )[0] ? (
          <div className={`${style.top__result} `}>
            <h1>Nổi bật</h1>
            <div className={style.container}>
              <CardPlaylist
                listTrack={
                  listTracks?.filter(
                    (track) =>
                      track.category !== ECategory.PLAYLIST
                  )[0]
                }
              />
            </div>
          </div>
        ) : (
          <div
            className={`${style.top__result} loading `}
          ></div>
        )}
        {tracks?.length > 0 ? (
          <div className={style.songs}>
            <h1>Bài hát</h1>
            <Playlist list={tracks} />
          </div>
        ) : (
          <div className={`${style.songs} loading`}></div>
        )}
      </div>
      <div className={style.map}>
        <SlickPlaylist
          nameSection='Bộ sưu tập'
          listListTrack={listTracks?.filter(
            (track) => track.category != ECategory.PLAYLIST
          )}
        />
      </div>
      <div className={style.map}>
        <SlickPlaylist
          nameSection='Danh sách phát'
          listListTrack={listTracks?.filter(
            (track) => track.category == ECategory.PLAYLIST
          )}
        />
      </div>
      <div className={style.map}>
        <SlickPeople
          nameSection='Nghệ sĩ'
          listPerson={artists as unknown as DPerson[]}
        />
      </div>
      <div className={style.map}>
        <SlickPeople
          nameSection='Người dùng'
          listPerson={users as unknown as DPerson[]}
        />
      </div>
    </React.Fragment>
  )
}

export default All
