import { useState } from 'react'
import {
  MdDelete,
  MdOutlineRemoveRedEye
} from 'react-icons/md'
import { Link } from 'react-router-dom'
import useSWR from 'swr'
import { Deletion } from '~/components/common'
import { useFetcher } from '~/hooks'
import style from '~/styles/Table.module.css'
import {
  DInteraction,
  DListTrack,
  DPerson,
  DUser
} from '~/types/data'

interface Props {
  row: DUser
  i: number
}

const Row = ({ row, i }: Props) => {
  const [isDelete, setIsDelete] = useState<boolean>(false)

  const handleDelete = () => {
    setIsDelete(true)
  }

  const fetcher = useFetcher()

  const apiListTrack = 'api/v1/listtracks/all' as string
  const { data: listtrack } = useSWR(
    apiListTrack + i + 'usertable',
    () =>
      fetcher(apiListTrack, {
        params: {
          author: row?._id
        }
      })
  ) as {
    data: DListTrack[]
  }

  const apiInteraction = `api/v1/interactions/${row?._id}`
  const { data: interaction } = useSWR(
    apiInteraction + i + 'usertable',
    () =>
      fetcher(apiInteraction, {
        params: {
          author: row?._id
        }
      })
  ) as { data: DInteraction }

  const apiFollowing = `api/v1/followings/users/${row?._id}`
  const { data: following } = useSWR(
    apiFollowing + i + 'usertable',
    () => fetcher(apiFollowing)
  ) as {
    data: DPerson[]
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
        <td>{listtrack?.length}</td>
        <td>{interaction?.wishTrack?.length}</td>
        <td>{following?.length}</td>
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
