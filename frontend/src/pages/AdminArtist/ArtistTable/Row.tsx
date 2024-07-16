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
  DArtist,
  DListTrack,
  DPerson,
  DTrack
} from '~/types/data'

interface Props {
  row: DArtist
  i: number
}

const Row = ({ row, i }: Props) => {
  const [isDelete, setIsDelete] = useState<boolean>(false)

  const handleDelete = () => {
    setIsDelete(true)
  }
  const fetcher = useFetcher()

  const apiFollower = `api/v1/followings/artists/${row?._id}`
  const { data: follower } = useSWR(
    apiFollower + i + 'artisttable',
    () => fetcher(apiFollower)
  ) as { data: DPerson[] }
  console.log(follower)

  const apiTrack = `api/v1/tracks/all`
  const { data: tracks } = useSWR(
    apiTrack + i + 'artisttable',
    () =>
      fetcher(apiTrack, {
        params: {
          author: row?._id
        }
      })
  ) as { data: DTrack[] }

  const apiListTrack = `api/v1/listtracks/all`
  const { data: listTracks } = useSWR(
    apiListTrack + i + 'artisttable',
    () =>
      fetcher(apiListTrack, {
        params: {
          author: row?._id
        }
      })
  ) as { data: DListTrack[] }

  return (
    <>
      <tr>
        <td>{i + 1}</td>
        <td>
          <Link to={`/artist/${row?.slug}${row?._id}.html`}>
            {row?.username}
          </Link>
        </td>
        <td>{listTracks?.length}</td>
        <td>{tracks?.length}</td>
        <td>{follower?.length}</td>
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
