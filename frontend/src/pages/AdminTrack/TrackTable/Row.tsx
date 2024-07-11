import { useState } from 'react'
import {
  MdDelete,
  MdOutlineRemoveRedEye
} from 'react-icons/md'
import { Link } from 'react-router-dom'
import { Deletion } from '~/components/common'
import style from '~/styles/Table.module.css'
import { DTrack } from '~/types/data'

interface Props {
  row: DTrack
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
          <Link to={`/track/${row?.slug}${row?._id}.html`}>
            {row?.title}
          </Link>
        </td>
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
        <td>{row?.likes}</td>
        <td>
          <div className={style.option__ctn}>
            <Link
              to={`/track/${row?.slug}${row?._id}.html`}
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
          api={`api/v1/tracks/${row?._id}`}
          reset={'api/v1/tracks/all'}
        />
      )}
    </>
  )
}

export default Row
