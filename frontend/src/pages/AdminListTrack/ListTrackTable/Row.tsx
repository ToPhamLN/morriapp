import React, { useState } from 'react'
import {
  MdDelete,
  MdOutlineRemoveRedEye
} from 'react-icons/md'
import { Link } from 'react-router-dom'
import { Deletion } from '~/components/common'
import style from '~/styles/Table.module.css'
import { DListTrack } from '~/types/data'

interface Props {
  row: DListTrack
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
          api={`api/v1/listtracks/${row?._id}`}
          reset={'api/v1/listtracks/all'}
        />
      )}
    </>
  )
}

export default Row
