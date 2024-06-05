import React from 'react'
import { useParams } from 'react-router-dom'
import useSWR from 'swr'
import {
  CardPlaylist,
  SlickPlaylist
} from '~/components/features'
import { useFetcher } from '~/hooks'
import style from '~/styles/Topic.module.css'
import style2 from '~/styles/Card.module.css'
import { DListTrack } from '~/types/data'
import { slugToEnum } from '~/utils/helpers'
const GenreDetails = () => {
  const { genreParam } = useParams()
  const genre = slugToEnum(genreParam || '')
  const fetcher = useFetcher()
  const apiListTracks = 'api/v1/listtracks/all'

  const { data: listTracks } = useSWR(
    genre ? apiListTracks + 'genreParam' : null,
    () => {
      if (genre) {
        return fetcher(apiListTracks, {
          params: {
            genre: genre
          }
        })
      }
      return null
    }
  ) as { data: DListTrack[] }
  console.log('listTracks', listTracks)
  const imagePath =
    listTracks && listTracks.length > 0
      ? listTracks[0]?.photo?.path
      : ''
  return (
    <div className={style.genre__details}>
      <div className={style.information}>
        <div
          className={style.background}
          style={{ background: '#0F172A' }}
        ></div>
        <div className={style.container__information}>
          <div className={style.photo__wrapper}>
            {imagePath && (
              <div className={style.photo}>
                <img src={imagePath} alt={''} />
              </div>
            )}
            <div className={`${style.statistical}  `}>
              <span>feerete</span>
              <span>feerete</span>
            </div>
          </div>
          <h1 className={style.listtrack__title}>
            {genre}
          </h1>
        </div>
      </div>
      <div className={style.map}>
        <SlickPlaylist
          nameSection='Do biên tập tuyển chọn'
          listListTrack={listTracks}
        />
      </div>
      <div className={style.topic__ctn}>
        <h1>Dành cho bạn</h1>
        <div
          className={style2.grid}
          style={{ marginTop: '1rem' }}
        >
          {listTracks?.map((listTrack, index) => (
            <CardPlaylist
              key={index}
              listTrack={listTrack}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export default GenreDetails
