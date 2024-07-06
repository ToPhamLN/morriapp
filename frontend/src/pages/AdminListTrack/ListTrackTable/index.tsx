import React, {
  ChangeEvent,
  useEffect,
  useState
} from 'react'
import {
  MdDelete,
  MdFilterList,
  MdMusicNote,
  MdOutlineRemoveRedEye,
  MdSearch
} from 'react-icons/md'
import { Link, useSearchParams } from 'react-router-dom'
import { Pagination } from '~/components/common'
import style from '~/styles/Table.module.css'
import { DListTrack } from '~/types/data'

interface Props {
  data: DListTrack[]
  total: number
}

type SortOrder = 'asc' | 'desc'

const ListTrackTable = ({
  data: initialData,
  total
}: Props) => {
  const [data, setData] =
    useState<DListTrack[]>(initialData)
  const [sortConfig, setSortConfig] = useState<{
    key: keyof DListTrack
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

  const sortData = (key: keyof DListTrack) => {
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

  const getClassNamesFor = (key: keyof DListTrack) => {
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
        <MdMusicNote className={style.icon} />
        <h3>Danh sách nhạc</h3>
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
              onClick={() => sortData('title')}
              className={getClassNamesFor('title')}
            >
              Tên
            </th>
            <th
              onClick={() => sortData('category')}
              className={getClassNamesFor('category')}
            >
              Loại
            </th>
            <th
              onClick={() => sortData('author')}
              className={getClassNamesFor('author')}
            >
              Nghệ sĩ
            </th>
            <th
              onClick={() => sortData('listens')}
              className={getClassNamesFor('listens')}
            >
              Lượt nghe
            </th>
            <th>Tùy chọn</th>
          </tr>
        </thead>
        <tbody>
          {data?.map((row, i) => (
            <tr key={i}>
              <td>{i + 1}</td>
              <td>
                <Link
                  to={`/${row?.category?.toLowerCase()}/${row?.slug}${row?._id}.html`}
                >
                  {row?.title}
                </Link>
              </td>
              <td>{row?.category}</td>
              <td>
                {row.author && (
                  <Link
                    to={`/artist/${row.author?.slug}${row?.author?._id}.html`}
                  >
                    {row?.author?.username}
                  </Link>
                )}
              </td>
              <td>{row?.listens}</td>
              <td>
                <div className={style.option__ctn}>
                  <Link
                    to={`/${row?.category?.toLowerCase()}/${row?.slug}${row?._id}.html`}
                    className={style.option}
                  >
                    <MdOutlineRemoveRedEye />
                  </Link>
                  <span className={style.option}>
                    <MdDelete />
                  </span>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className={style.bottom}>
        <Pagination total={total} />
      </div>
    </div>
  )
}

export default ListTrackTable
