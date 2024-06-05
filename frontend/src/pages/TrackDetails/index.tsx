import { useParams } from 'react-router-dom'
import useSWR, { mutate } from 'swr'
import {
  useAppDispatch,
  useAppSelector,
  useAxiosPrivate,
  useClickOutside,
  useFetcher
} from '~/hooks'
import style from '~/styles/TrackDetails.module.css'
import { DTrack } from '~/types/data'
import { MdMoreVert } from 'react-icons/md'
import Range from '~/layouts/DefaultLayout/Player/Range'
import {
  setCurrentTime,
  setIsPlaying,
  setList,
  setTrack
} from '~/reduxStore/trackPlaySlice'
import {
  IoPauseCircle,
  IoPlayCircle
} from 'react-icons/io5'
import { Navigator } from '~/components/features'
import { ERole } from '~/constants/enum'
import {
  MouseEvent,
  useEffect,
  useRef,
  useState
} from 'react'
import AudioForArtist from './AudioForArtist'
import { MoreList } from '~/components/common'

const TrackDetails = () => {
  const [isMoreVisible, setIsMoreVisible] =
    useState<boolean>(false)
  const moreOptionRef = useRef<HTMLDivElement>(null)
  const [location, setLocation] = useState<{
    top: number
    left: number
  }>({
    top: 0,
    left: 0
  })
  const {
    listInfo,
    isPlaying,
    track: trackPlaying
  } = useAppSelector((state) => state.trackPlay)
  const { role, idRole } = useAppSelector(
    (state) => state.profile
  )
  const fetcher = useFetcher()
  const dispatch = useAppDispatch()
  const idTrack = useParams().trackParam?.slice(-29, -5)
  const apiTrack = `api/v1/tracks/${idTrack}`

  const axios = useAxiosPrivate()
  const userID = role == ERole.USER ? idRole?._id : null
  const { data: interaction } = useSWR(
    userID ? `api/v1/interactions/${userID}` : null,
    fetcher
  )
  const { data: trackReq } = useSWR(
    apiTrack,
    fetcher
    // {
    //   revalidateOnFocus: false,
    //   revalidateOnReconnect: false,
    //   revalidateOnMount: false
    // }
  ) as {
    data: DTrack
  }
  const track = trackPlaying || trackReq
  useEffect(() => {
    const handleAddTrack = () => {
      dispatch(setTrack(trackReq))
      if (role != ERole.ARTIST)
        dispatch(setList([trackReq]))
      dispatch(setIsPlaying(true))
    }

    if (!trackPlaying && trackReq) {
      handleAddTrack()
    }
  }, [trackPlaying, trackReq])
  const handleSeek = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const audio = document.querySelector(
      '.player__track'
    ) as unknown as HTMLAudioElement | null
    const { value } = event.target
    if (audio) {
      audio.currentTime = parseFloat(value)
      dispatch(setCurrentTime(parseFloat(value)))
    }
  }
  const togglePlayPause = () => {
    dispatch(setIsPlaying(!isPlaying))
  }

  // show option block
  const toggleMoreVisible = () => {
    setIsMoreVisible((prev) => !prev)
  }
  const CloseOptionHandler = () => {
    toggleMoreVisible()
  }
  const OpenMoreHandler = (
    event: MouseEvent<HTMLElement>
  ) => {
    const { top, left } =
      event.currentTarget.getBoundingClientRect()

    setLocation({
      top: scrollY + top,
      left: scrollX + left
    })
    toggleMoreVisible()
  }

  useClickOutside(moreOptionRef, CloseOptionHandler)

  const handleLikeTrack = async () => {
    try {
      await axios.put(
        `api/v1/interactions/wish/track/${track?._id}`
      )
      mutate(`api/v1/interactions/${idRole?._id}`)
      mutate(
        `api/v1/interactions/count/wish/track/${track?._id}`
      )
    } catch (error) {
      console.log(error)
    }
  }

  const likedTrack = track?._id
    ? interaction?.wishTrack?.includes(track?._id)
    : false

  return (
    <div
      className={style.track__details}
      style={{
        backgroundColor: listInfo?.background
          ? listInfo?.background
          : '#0F172A'
      }}
    >
      <div className={style.track__ctn}>
        <div className={style.track__header}>
          <Navigator />
          <div className={style.information}>
            <div className={style.title}>
              <div className={style.title__content}>
                {track?.title &&
                  `Đang phát bài hát ${track?.title}`}
              </div>
            </div>
            <div className={style.artist}>
              <span>{track?.author?.username}</span>
              {track?.artist?.map((artist) => (
                <span>{artist?.username}</span>
              ))}
            </div>
          </div>
          <div className={style.more}>
            <button
              onClick={OpenMoreHandler}
              className={style.more__btn}
            >
              <MdMoreVert />
            </button>
            {isMoreVisible && (
              <MoreList
                refItem={moreOptionRef}
                location={location}
                track={track}
                interaction={interaction}
                handleLikeTrack={handleLikeTrack}
                likedTrack={likedTrack}
                listInfo={listInfo}
              />
            )}
          </div>
        </div>
        <div className={style.playing}>
          <div className={style.track__photo}>
            <img src={track?.photo?.path} alt='' />
            <div className={style.disc}>
              <div className={style.border}>
                <div className={style.white}>
                  <div className={style.center}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {role === ERole.ARTIST ? (
          <AudioForArtist />
        ) : (
          <div className={style.controller}>
            <button
              className={style.play}
              onClick={togglePlayPause}
            >
              {!isPlaying ? (
                <IoPlayCircle />
              ) : (
                <IoPauseCircle />
              )}
            </button>
            <Range handleSeek={handleSeek} />
          </div>
        )}

        <div className={style.track__lyrics}>
          <div
            className={style.track__lyrics__ctn}
            dangerouslySetInnerHTML={{
              __html: track?.lyrics
                ? track?.lyrics.replace(/\n/g, '<br />')
                : ''
            }}
          ></div>
        </div>
      </div>
    </div>
  )
}

export default TrackDetails
