import React, { useEffect, useState } from 'react'
import {
  HomeSlick,
  SlickPlaylist
} from '~/components/features'
import style from '~/styles/Home.module.css'
import { PlaylistGrid } from '../../components/features'
import { EGenre } from '~/constants/enum'
import { useAppSelector, useFetcher } from '~/hooks'
import useSWR from 'swr'
import { DListTrack } from '~/types/data'

const HomePage: React.FC = () => {
  const [taste, setTaste] = useState<EGenre[]>([])
  const fetcher = useFetcher()
  const apiListTracks = 'api/v1/listtracks/all'
  const { idRole } = useAppSelector(
    (state) => state.profile
  )

  useEffect(() => {
    const uniqueTaste = new Set(
      Object.values(EGenre)
        .sort(() => Math.random() - 0.5)
        .slice(0, 5)
    )

    setTaste(Array.from(uniqueTaste))
  }, [])

  const useGenreData = (genreIndex: number) => {
    const { data: listTracks } = useSWR(
      taste[genreIndex]
        ? apiListTracks + taste[genreIndex]
        : null,
      () => {
        if (taste[genreIndex]) {
          return fetcher(apiListTracks, {
            params: {
              genre: taste[genreIndex],
              ramdom: 20
            }
          })
        }
        return null
      }
    ) as { data: DListTrack[] }

    return listTracks
  }

  return (
    <div className={style.home}>
      <HomeSlick />
      {idRole && (
        <div className={style.playlist__row}>
          <div className={style.header}>
            <h1>Thư viện của tôi</h1>
          </div>
          <PlaylistGrid />
        </div>
      )}
      <div className={style.map}>
        <SlickPlaylist
          nameSection={taste[0]}
          listListTrack={useGenreData(0)}
        />
      </div>
      <div className={style.map}>
        <SlickPlaylist
          nameSection={taste[1]}
          listListTrack={useGenreData(1)}
        />
      </div>
      <div className={style.map}>
        <SlickPlaylist
          nameSection={taste[2]}
          listListTrack={useGenreData(2)}
        />
      </div>
      <div className={style.map}>
        <SlickPlaylist
          nameSection={taste[3]}
          listListTrack={useGenreData(3)}
        />
      </div>
      <div className={style.map}>
        <SlickPlaylist
          nameSection={taste[4]}
          listListTrack={useGenreData(4)}
        />
      </div>
    </div>
  )
}

export default HomePage
