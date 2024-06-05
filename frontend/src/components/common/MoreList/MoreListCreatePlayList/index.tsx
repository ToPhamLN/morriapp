import React, { useState } from 'react'
import { FaSearch } from 'react-icons/fa'
import {
  MdOutlineAdd,
  MdOutlineClose
} from 'react-icons/md'
import useSWR from 'swr'
import { useAppSelector, useFetcher } from '~/hooks'
import style from '~/styles/MoreList.module.css'
import { DListTrack, DTrack } from '~/types/data'
import AddNew from './AddNew'
import { Link } from 'react-router-dom'

interface Props {
  track: DTrack
}

interface DListTrackWithStringList
  extends Omit<DListTrack, 'list'> {
  list: string[]
}

const MoreListCreatePlayList = ({ track }: Props) => {
  const [validSearch, setValidSearch] = useState<string>('')
  const { idRole } = useAppSelector(
    (state) => state.profile
  )

  const fetcher = useFetcher()
  const API = 'api/v1/listtracks/all' as string
  const { data: playlistCreated } = useSWR(
    API + 'user',
    () =>
      fetcher(API, {
        params: {
          author: idRole?._id
        }
      })
  ) as {
    data: DListTrackWithStringList[]
  }

  return (
    <div className={style.add__playlist}>
      <div className={style.searchlist}>
        <button className={style.icon}>
          <FaSearch />
        </button>
        <input
          type='text'
          name='search'
          placeholder='Tìm kiếm _ _ _'
          autoComplete='off'
          value={validSearch}
          onChange={(e) => setValidSearch(e.target.value)}
        />
        {validSearch && (
          <button
            className={style.icon}
            onClick={() => setValidSearch('')}
          >
            <MdOutlineClose />
          </button>
        )}
      </div>
      <Link to={'/mylist/create'}>
        <button className={style.add__new}>
          <MdOutlineAdd className={style.icon} />
          Tạo danh sách mới
        </button>
      </Link>
      <div className={style.my__list}>
        {playlistCreated?.map((listTrack, index) => (
          <AddNew
            key={index}
            listTrack={listTrack}
            track={track}
          />
        ))}
      </div>
    </div>
  )
}

export default MoreListCreatePlayList
