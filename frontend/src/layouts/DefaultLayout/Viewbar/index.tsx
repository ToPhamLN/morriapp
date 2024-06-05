import React from 'react'
import style from '~/styles/Viewbar.module.css'
import {
  LuAlarmClock,
  LuMoreHorizontal
} from 'react-icons/lu'
import {
  useAppDispatch,
  useAppSelector,
  useFetcher
} from '~/hooks'
import { setIsRecently } from '~/reduxStore/globalSlice'
import ListPlaying from './ListPlaying'
import { DInteraction } from '~/types/data'
import useSWR from 'swr'
import RecentlyTrack from './RecentlyTrack'

const Viewbar: React.FC = () => {
  const { view } = useAppSelector((state) => state.global)
  const { idRole } = useAppSelector(
    (state) => state.profile
  )
  const dispatch = useAppDispatch()
  const fetcher = useFetcher()

  const { data: interaction } = useSWR(
    idRole?._id
      ? `api/v1/interactions/${idRole?._id}`
      : null,
    fetcher
  ) as { data: DInteraction }

  return (
    <div className={style.viewbar}>
      <div className={style.header}>
        <div className={style.playlist__switch}>
          <button
            className={view.isRecently ? '' : style.focus}
            onClick={() => dispatch(setIsRecently(false))}
          >
            Danh sách phát
          </button>
          <button
            className={view.isRecently ? style.focus : ''}
            onClick={() => dispatch(setIsRecently(true))}
          >
            Nghe gần đây
          </button>
        </div>
        {/* <button className={style.btn__header}>
          <LuAlarmClock />
        </button>
        <button className={style.btn__header}>
          <LuMoreHorizontal />
        </button> */}
      </div>
      {view.isRecently ? (
        <RecentlyTrack interaction={interaction} />
      ) : (
        <ListPlaying interaction={interaction} />
      )}
    </div>
  )
}

export default Viewbar
