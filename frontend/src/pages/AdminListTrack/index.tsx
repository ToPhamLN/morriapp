import React, { useEffect } from 'react'
import useSWR, { mutate } from 'swr'
import { useFetcher } from '~/hooks'
import { DListTrack } from '~/types/data'
import { useSearchParams } from 'react-router-dom'
import ListTrackTable from './ListTrackTable'

const AdminListTrack = () => {
  const apiListTracks = 'api/v1/listtracks/all'
  const apiCountListTracks = 'api/v1/listtracks/count'
  const [searchParams, setSearchParams] = useSearchParams()
  const q = searchParams.get('q') ?? ''
  const page = searchParams.get('page') ?? 1
  const fetcher = useFetcher()
  const { data } = useSWR(apiListTracks, () =>
    fetcher(apiListTracks, {
      params: {
        q: q,
        page: page,
        limit: 20
      }
    })
  ) as { data: DListTrack[] }
  const { data: countListTracks } = useSWR(
    apiCountListTracks,
    fetcher
  ) as { data: number }

  useEffect(() => {
    mutate(apiListTracks)
  }, [q, page])
  return (
    <div style={{ padding: '1rem' }}>
      <ListTrackTable
        data={data}
        total={Math.ceil(countListTracks / 20)}
      />
    </div>
  )
}

export default AdminListTrack
