import { useState } from 'react'
import {
  MdDelete,
  MdOutlineRemoveRedEye
} from 'react-icons/md'
import { Link } from 'react-router-dom'
import { Deletion } from '~/components/common'
import style from '~/styles/Table.module.css'
import { DArtist, DReport } from '~/types/data'

interface Props {
  row: DReport
  i: number
}

const Row = ({ row, i }: Props) => {
  const [isDelete, setIsDelete] = useState<boolean>(false)

  const handleDelete = () => {
    setIsDelete(true)
  }

  return (
    <>
      <tr>
        <td>{i + 1}</td>
        <td>
          <Link to={row?.path ? row?.path : ''}>
            {row?.title}
          </Link>
        </td>
        <td>{row?.category}</td>
        <td>
          {row.sender && (
            <Link
              to={`/${row?.sender?.role === 'Artist' ? 'artist' : 'user'}/${row.sender?.slug}${row?.sender?._id}.html`}
            >
              {row?.sender?.username}
            </Link>
          )}
        </td>
        <td>
          <div className={style.option__ctn}>
            <Link
              to={`/report/${row?.slug}${row?._id}.html`}
              className={style.option}
            >
              <MdOutlineRemoveRedEye />
            </Link>
            <span
              className={style.option}
              onClick={handleDelete}
            >
              <MdDelete />
            </span>
          </div>
        </td>
      </tr>
      {isDelete && (
        <Deletion
          setExit={setIsDelete}
          api={`api/v1/reports/${row?._id}`}
          reset={'api/v1/reports/all'}
        />
      )}
    </>
  )
}

export default Row
