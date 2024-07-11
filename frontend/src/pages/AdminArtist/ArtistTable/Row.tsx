import { useState } from 'react'
import {
  MdDelete,
  MdOutlineRemoveRedEye
} from 'react-icons/md'
import { Link } from 'react-router-dom'
import { Deletion } from '~/components/common'
import style from '~/styles/Table.module.css'
import { DArtist } from '~/types/data'

interface Props {
  row: DArtist
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
          <Link to={`/artist/${row?.slug}${row?._id}.html`}>
            {row?.username}
          </Link>
        </td>
        <td>{row?.listens}</td>
        <td>
          <div className={style.option__ctn}>
            <Link
              to={`/artist/${row?.slug}${row?._id}.html`}
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
          api={`api/v1/artists/${row?._id}`}
          reset={'api/v1/artists/all'}
        />
      )}
    </>
  )
}

export default Row
