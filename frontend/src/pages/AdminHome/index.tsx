import React from 'react'
import style from '~/styles/AdminHome.module.css'
import Total from './Total'
import { SlickPeople } from '~/components/features'
import { useFetcher } from '~/hooks'
import useSWR from 'swr'
import { DPerson } from '~/types/data'
const AdminHome = () => {
  const apiUsers = 'api/v1/users/all'
  const apiArtists = 'api/v1/artists/all'
  const apiCountTracks = 'api/v1/tracks/count'
  const apiCountListTracks = 'api/v1/listtracks/count'
  const apiCountUsers = 'api/v1/users/count'
  const apiCountArtists = 'api/v1/artists/count'
  const fetcher = useFetcher()
  const { data: users } = useSWR(apiUsers, () =>
    fetcher(apiUsers, {
      params: {
        page: 1,
        limit: 10
      }
    })
  ) as { data: DPerson[] }

  const { data: artists } = useSWR(apiArtists, () =>
    fetcher(apiArtists, {
      params: {
        page: 1,
        limit: 10
      }
    })
  ) as { data: DPerson[] }

  const { data: countTracks } = useSWR(
    apiCountTracks,
    fetcher
  )
  const { data: countListTracks } = useSWR(
    apiCountListTracks,
    fetcher
  )
  const { data: countUsers } = useSWR(
    apiCountUsers,
    fetcher
  )
  const { data: countArtists } = useSWR(
    apiCountArtists,
    fetcher
  )

  return (
    <div className={style.container}>
      <Total
        countUsers={countUsers}
        countArtists={countArtists}
        countTracks={countTracks}
        countListTracks={countListTracks}
      />
      <div className={style.map}>
        <SlickPeople
          nameSection='Nghệ sĩ mới'
          listPerson={artists}
        />
      </div>
      <div className={style.map}>
        <SlickPeople
          nameSection='Người nghe mới'
          listPerson={users}
        />
      </div>
    </div>
  )
}

export default AdminHome
