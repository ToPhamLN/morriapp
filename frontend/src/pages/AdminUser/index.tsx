import React, { useEffect } from 'react'
import UserTable from './UserTable'
import useSWR, { mutate } from 'swr'
import { useFetcher } from '~/hooks'
import { DUser } from '~/types/data'
import { useSearchParams } from 'react-router-dom'

const AdminArtist = () => {
  const apiUsers = 'api/v1/users/all'
  const apiCountUsers = 'api/v1/users/count'

  const [searchParams, setSearchParams] = useSearchParams()
  const q = searchParams.get('q') ?? ''
  const page = searchParams.get('page') ?? 1
  const fetcher = useFetcher()
  const { data } = useSWR(apiUsers, () =>
    fetcher(apiUsers, {
      params: {
        q: q,
        page: page,
        limit: 20
      }
    })
  ) as { data: DUser[] }

  const { data: countUsers } = useSWR(
    apiCountUsers,
    fetcher
  ) as { data: number }

  useEffect(() => {
    mutate(apiUsers)
  }, [q, page])
  return (
    <div style={{ padding: '1rem' }}>
      <UserTable
        data={data}
        total={Math.ceil(countUsers / 20)}
      />
    </div>
  )
}

export default AdminArtist
