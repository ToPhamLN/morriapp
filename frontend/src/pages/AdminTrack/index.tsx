import React, { useEffect } from 'react'
import TrackTable from './TrackTable'
import useSWR, { mutate } from 'swr'
import { useFetcher } from '~/hooks'
import { DTrack } from '~/types/data'
import { useSearchParams } from 'react-router-dom'

const AdminTrack = () => {
  const apiTracks = 'api/v1/tracks/all'
  const apiCountTracks = 'api/v1/tracks/count'

  const [searchParams, setSearchParams] = useSearchParams()
  const q = searchParams.get('q') ?? ''
  const page = searchParams.get('page') ?? 1
  const fetcher = useFetcher()
  const { data } = useSWR(apiTracks, () =>
    fetcher(apiTracks, {
      params: {
        q: q,
        page: page,
        limit: 20
      }
    })
  ) as { data: DTrack[] }

  const { data: countTracks } = useSWR(
    apiCountTracks,
    fetcher
  ) as { data: number }

  useEffect(() => {
    mutate(apiTracks)
  }, [q, page])
  return (
    <div style={{ padding: '1rem' }}>
      <TrackTable
        data={data}
        total={Math.ceil(countTracks / 20)}
      />
    </div>
  )
}

export default AdminTrack
