import React from 'react'
import { BsFilePlayFill } from 'react-icons/bs'
import {
  ImVolumeMedium,
  ImVolumeMute2
} from 'react-icons/im'
import { MdLyrics } from 'react-icons/md'
import { RiPlayListFill } from 'react-icons/ri'
import { useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '~/hooks'
import { setIsView } from '~/reduxStore/globalSlice'
import style from '~/styles/Player.module.css'

type Props = {
  handleMute: () => void
  handleVolume: (
    event: React.ChangeEvent<HTMLInputElement>
  ) => void
}

const Option = ({ handleMute, handleVolume }: Props) => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { track } = useAppSelector(
    (state) => state.trackPlay
  )
  const { volume } = useAppSelector(
    (state) => state.trackPlay
  )
  const { view } = useAppSelector((state) => state.global)

  return (
    <div className={style.track__option}>
      <button
        hover-content={'Chế độ xem'}
        className={style.watch__mode}
        onClick={() =>
          navigate(
            `/track/${track?.slug}${track?._id}.html`
          )
        }
      >
        <BsFilePlayFill />
      </button>
      <button
        hover-content={'Lời bài hát'}
        onClick={() => navigate('/lyrics')}
      >
        <MdLyrics />
      </button>
      <button
        onClick={handleMute}
        hover-content={
          volume.isMute ? 'Hủy tắt tiếng' : 'Tắt tiếng'
        }
      >
        {volume.isMute ? (
          <ImVolumeMute2 />
        ) : (
          <ImVolumeMedium />
        )}
      </button>
      <input
        type='range'
        value={volume.isMute ? 0 : volume.value}
        max={1}
        onChange={handleVolume}
        step={0.1}
        className={style.input__volume}
      />
      <div
        style={{
          height: '3rem',
          width: '1px',
          background: 'var(--text-color)'
        }}
      ></div>
      <button
        hover-content={'Danh sách chờ'}
        onClick={() => dispatch(setIsView(!view.isView))}
        className={view.isView ? style.choose : ''}
      >
        <RiPlayListFill />
      </button>
    </div>
  )
}

export default Option
