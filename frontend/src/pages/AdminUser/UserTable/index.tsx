import { ChangeEvent, useEffect, useState } from 'react'
import { IoPeople } from 'react-icons/io5'
import { MdFilterList, MdSearch } from 'react-icons/md'
import { useSearchParams } from 'react-router-dom'
import { Pagination } from '~/components/common'
import style from '~/styles/Table.module.css'
import { DUser } from '~/types/data'
import Row from './Row'

interface Props {
  data: DUser[]
  total: number
}

type SortOrder = 'asc' | 'desc'

const UserTable = ({ data: initialData, total }: Props) => {
  const [data, setData] = useState<DUser[]>(initialData)
  const [sortConfig, setSortConfig] = useState<{
    key: keyof DUser
    order: SortOrder
  } | null>(null)

  const [searchParams, setSearchParams] = useSearchParams()
  const q = searchParams.get('q') ?? ''

  const validHandler = (
    e: ChangeEvent<HTMLInputElement>
  ) => {
    const query = Object.fromEntries(searchParams.entries())
    query.q = e.target.value
    query.page = '1'
    setSearchParams(query)
  }

  const sortData = (key: keyof DUser) => {
    let order: SortOrder = 'asc'
    if (
      sortConfig &&
      sortConfig.key === key &&
      sortConfig.order === 'asc'
    ) {
      order = 'desc'
    }

    const sortedData = [...data].sort((a, b) => {
      const valueA =
        typeof a[key] === 'object'
          ? (a[key] as any).username
          : a[key]
      const valueB =
        typeof b[key] === 'object'
          ? (b[key] as any).username
          : b[key]

      if (valueA === undefined)
        return order === 'asc' ? 1 : -1
      if (valueB === undefined)
        return order === 'asc' ? -1 : 1

      if (
        typeof valueA === 'string' &&
        typeof valueB === 'string'
      ) {
        return order === 'asc'
          ? valueA.localeCompare(valueB)
          : valueB.localeCompare(valueA)
      }

      if (
        typeof valueA === 'number' &&
        typeof valueB === 'number'
      ) {
        return order === 'asc'
          ? valueA - valueB
          : valueB - valueA
      }

      return 0
    })

    setData(sortedData)
    setSortConfig({ key, order })
  }

  const getClassNamesFor = (key: keyof DUser) => {
    if (!sortConfig) return ''

    const sortOrderClass =
      sortConfig.order === 'asc' ? style.asc : style.desc
    const isSortKey = sortConfig.key === key

    return isSortKey ? sortOrderClass : ''
  }
  const resetData = () => {
    setData(initialData)
    setSortConfig(null)
  }

  useEffect(() => {
    setData(initialData)
  }, [initialData])

  return (
    <div className={style.table}>
      <div className={style.header}>
        <IoPeople className={style.icon} />
        <h3>Danh sách người dùng</h3>
        <MdFilterList className={style.icon} />
        <input
          type='text'
          value={q}
          onChange={validHandler}
        />
        <MdSearch className={style.icon} />
      </div>
      <table>
        <thead>
          <tr>
            <th onClick={resetData}>#</th>
            <th
              onClick={() => sortData('username')}
              className={getClassNamesFor('username')}
            >
              Người dùng
            </th>

            <th>Tùy chọn</th>
          </tr>
        </thead>
        <tbody>
          {data?.map((row, i) => (
            <Row key={i} i={i} row={row} />
          ))}
        </tbody>
      </table>
      <div className={style.bottom}>
        <Pagination total={total} />
      </div>
    </div>
  )
}

export default UserTable
