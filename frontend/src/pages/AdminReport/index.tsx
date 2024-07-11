import React, { useEffect } from 'react'
import ReportTable from './ReportTable'
import useSWR, { mutate } from 'swr'
import { useFetcher } from '~/hooks'
import { DReport } from '~/types/data'
import { useSearchParams } from 'react-router-dom'

const AdminReport = () => {
  const apiReports = 'api/v1/reports/all'
  const apiCountReports = 'api/v1/reports/count'

  const [searchParams, setSearchParams] = useSearchParams()
  const q = searchParams.get('q') ?? ''
  const page = searchParams.get('page') ?? 1
  const fetcher = useFetcher()
  const { data } = useSWR(apiReports, () =>
    fetcher(apiReports, {
      params: {
        q: q,
        page: page,
        limit: 20
      }
    })
  ) as { data: DReport[] }

  const { data: countTracks } = useSWR(
    apiCountReports,
    fetcher
  ) as { data: number }

  useEffect(() => {
    mutate(apiReports)
  }, [q, page])
  return (
    <div style={{ padding: '1rem' }}>
      <ReportTable
        data={data}
        total={Math.ceil(countTracks / 20)}
      />
    </div>
  )
}

export default AdminReport
