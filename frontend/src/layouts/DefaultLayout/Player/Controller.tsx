import style from '~/styles/Player.module.css'
import {
  IoPlayCircle,
  IoPlayBack,
  IoPlayForward,
  IoPauseCircle,
  IoHeartSharp,
  IoHeartOutline
} from 'react-icons/io5'
import {
  TbArrowsShuffle2,
  TbArrowCapsule
} from 'react-icons/tb'

import { useAppDispatch, useAppSelector } from '~/hooks'

import {
  setWaitingList,
  setTrack,
  setMode,
  setIsPlaying
} from '~/reduxStore/trackPlaySlice'
import { DTrack } from '~/types/data'
import { sortPlayList } from '~/utils/array'
import { MdLyrics } from 'react-icons/md'
import { setIsView } from '~/reduxStore/globalSlice'
import { RiPlayListFill } from 'react-icons/ri'

type Props = {
  likedTrack: boolean
  handleLikeTrack: () => Promise<void>
}

const Controller = ({
  likedTrack,
  handleLikeTrack
}: Props) => {
  const {
    waitingList,

    mode,
    isPlaying
  } = useAppSelector((state) => state.trackPlay)
  const dispatch = useAppDispatch()
  const { view } = useAppSelector((state) => state.global)

  const handlePlayForward = () => {
    const newList: DTrack[] = sortPlayList(1, waitingList)
    dispatch(setTrack(newList[0]))
    dispatch(setWaitingList(newList))
  }

  const handleShuffle = () => {
    dispatch(
      setMode({
        ...mode,
        isSuffle: !mode.isSuffle
      })
    )
  }
  const handlePlayBack = () => {
    const newList: DTrack[] = sortPlayList(-1, waitingList)
    dispatch(setTrack(newList[0]))
    dispatch(setWaitingList(newList))
  }
  const handleLoopRePlay = () => {
    if (mode.isLoop)
      dispatch(
        setMode({ ...mode, isLoop: false, isReplay: true })
      )

    if (mode.isReplay)
      dispatch(
        setMode({
          ...mode,
          isLoop: false,
          isReplay: false
        })
      )

    if (!mode.isLoop && !mode.isReplay)
      dispatch(
        setMode({ ...mode, isLoop: true, isReplay: false })
      )
  }
  const togglePlayPause = () => {
    dispatch(setIsPlaying(!isPlaying))
  }

  return (
    <div className={style.track__control}>
      <div className={style.left}>
        <button
          className={style.like}
          onClick={handleLikeTrack}
        >
          {likedTrack ? (
            <IoHeartSharp />
          ) : (
            <IoHeartOutline />
          )}
        </button>
        <button
          className={`${style.suffle} ${mode.isSuffle && style.choose}`}
          onClick={handleShuffle}
        >
          <TbArrowsShuffle2 />
        </button>
        <button
          className={style.playback}
          onClick={handlePlayBack}
        >
          <IoPlayBack />
        </button>
      </div>
      <button
        className={style.play}
        onClick={togglePlayPause}
      >
        {!isPlaying ? <IoPlayCircle /> : <IoPauseCircle />}
      </button>
      <div className={style.right}>
        <button
          className={style.playforward}
          onClick={handlePlayForward}
        >
          <IoPlayForward />
        </button>
        <button
          onClick={handleLoopRePlay}
          className={`${mode.isReplay && style.replay} ${mode.isLoop && style.loop}`}
        >
          <TbArrowCapsule />
        </button>
        <button
          hover-content={'Lời bài hát'}
          className={style.lyrics}
        >
          <MdLyrics />
        </button>
        <button
          hover-content={'Danh sách chờ'}
          onClick={() => dispatch(setIsView(!view.isView))}
          className={`${style.queue} ${view.isView ? style.choose : ''}`}
        >
          <RiPlayListFill />
        </button>
      </div>
    </div>
  )
}

export default Controller
