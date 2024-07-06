import React, { useEffect } from 'react'
import ArtistTable from './ArtistTable'
import useSWR, { mutate } from 'swr'
import { useFetcher } from '~/hooks'
import { DArtist } from '~/types/data'
import { useSearchParams } from 'react-router-dom'

const AdminArtist = () => {
  const apiArtists = 'api/v1/artists/all'
  const apiCountArtists = 'api/v1/artists/count'

  const [searchParams, setSearchParams] = useSearchParams()
  const q = searchParams.get('q') ?? ''
  const page = searchParams.get('page') ?? 1
  const fetcher = useFetcher()
  const { data } = useSWR(apiArtists, () =>
    fetcher(apiArtists, {
      params: {
        q: q,
        page: page,
        limit: 20
      }
    })
  ) as { data: DArtist[] }

  const { data: countArtists } = useSWR(
    apiCountArtists,
    fetcher
  ) as { data: number }

  useEffect(() => {
    mutate(apiArtists)
  }, [q, page])
  return (
    <div style={{ padding: '1rem' }}>
      <ArtistTable
        data={data}
        total={Math.ceil(countArtists / 20)}
      />
    </div>
  )
}

export default AdminArtist
