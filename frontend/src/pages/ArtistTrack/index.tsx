import React from 'react'
import useSWR from 'swr'
import { Playlist } from '~/components/features'
import { useAppSelector, useFetcher } from '~/hooks'
import style from '~/styles/ArtistTrack.module.css'

const ArtistTrack = () => {
  const { idRole } = useAppSelector(
    (state) => state.profile
  )
  const fetcher = useFetcher()
  const { data: list } = useSWR('api/v1/tracks/all', () =>
    fetcher('api/v1/tracks/all', {
      params: {
        author: idRole?._id
      }
    })
  )

  return (
    <div className={style.artist__track}>
      <h1>Danh sách bài hát của tôi</h1>
      <Playlist list={list} />
    </div>
  )
}

export default ArtistTrack
