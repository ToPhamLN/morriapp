import React from 'react'
import { Link } from 'react-router-dom'
import useSWR from 'swr'
import { EGenre } from '~/constants/enum'
import { useFetcher } from '~/hooks'
import style from '~/styles/Topic.module.css'
import { DListTrack } from '~/types/data'
import { enumToSlug } from '~/utils/helpers'

const GenrePage = () => {
  return (
    <div className={style.topic}>
      <div className={style.topic__ctn}>
        <h1>Tất cả chủ đề</h1>
        <div className={style.parent}>
          {Object.keys(EGenre).map((genre, index) => (
            <Child
              key={index}
              genre={EGenre[genre as keyof typeof EGenre]}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export default GenrePage

const Child = ({ genre }: { genre: string }) => {
  const fetcher = useFetcher()
  const apiListTracks = 'api/v1/listtracks/all'

  const { data: listTracks } = useSWR(
    genre ? apiListTracks + genre : null,
    () => {
      if (genre) {
        return fetcher(apiListTracks, {
          params: {
            genre: genre,
            ramdom: 1
          }
        })
      }
      return null
    }
  ) as { data: DListTrack[] }
  const imagePath =
    listTracks && listTracks.length > 0
      ? listTracks[0]?.photo?.path
      : ''
  return (
    <Link to={enumToSlug(genre)} state={{ genre: genre }}>
      <div className={style.child}>
        <div className={style.image}>
          {imagePath && <img src={imagePath} alt='' />}
        </div>
        <div className={style.title}>
          <h1>{genre}</h1>
        </div>
      </div>
    </Link>
  )
}
