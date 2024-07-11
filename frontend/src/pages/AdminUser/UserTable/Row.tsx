import { useState } from 'react'
import {
  MdDelete,
  MdOutlineRemoveRedEye
} from 'react-icons/md'
import { Link } from 'react-router-dom'
import { Deletion } from '~/components/common'
import style from '~/styles/Table.module.css'
import { DUser } from '~/types/data'

interface Props {
  row: DUser
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
          <Link to={`/user/${row?.slug}${row?._id}.html`}>
            {row?.username}
          </Link>
        </td>

        <td>
          <div className={style.option__ctn}>
            <Link
              to={`/user/${row?.slug}${row?._id}.html`}
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
          api={`api/v1/users/${row?._id}`}
          reset={'api/v1/users/all'}
        />
      )}
    </>
  )
}

export default Row
