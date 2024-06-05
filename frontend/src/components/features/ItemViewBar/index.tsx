import { useState, useRef, MouseEvent } from 'react'
import style from '~/styles/Viewbar.module.css'
import { Link } from 'react-router-dom'
import { IoHeartOutline, IoHeart } from 'react-icons/io5'
import { LuMoreHorizontal } from 'react-icons/lu'

import {
  useAppDispatch,
  useAppSelector,
  useAxiosPrivate,
  useClickOutside
} from '~/hooks'
import {
  MoreList,
  TrackAnimation
} from '~/components/common'
import { DInteraction, DTrack } from '~/types/data'
import { mutate } from 'swr'
import { ERole } from '~/constants/enum'
import { FaPause, FaPlay } from 'react-icons/fa'
import {
  setIsPlaying,
  setTrack
} from '~/reduxStore/trackPlaySlice'

interface Props {
  track: DTrack
  interaction: DInteraction
}

const ItemViewBar = ({ track, interaction }: Props) => {
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
  const dispatch = useAppDispatch()
  const { isPlaying, track: trackPlaying } = useAppSelector(
    (state) => state.trackPlay
  )
  const { role, idRole } = useAppSelector(
    (state) => state.profile
  )
  const axios = useAxiosPrivate()

  const toggleMoreVisible = () => {
    setIsMoreVisible((prev) => !prev)
  }
  const CloseOptionHandler = () => {
    toggleMoreVisible()
  }
  const OpenMoreHandler = (
    event: MouseEvent<HTMLElement>
  ) => {
    const { innerHeight } = window
    const { top, left } =
      event.currentTarget.getBoundingClientRect()
    let newTop = innerHeight - 450
    if (window.scrollY + top < innerHeight - 450) {
      newTop = window.scrollY + top
    }
    setLocation({
      top: newTop,
      left: window.scrollX + left
    })
    toggleMoreVisible()
  }

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
  const handlePlay = () => {
    dispatch(setTrack(track))
    dispatch(setIsPlaying(true))
    if (isPlaying && trackPlaying?._id == track?._id)
      dispatch(setIsPlaying(false))
  }

  const likedTrack = track?._id
    ? interaction?.wishTrack?.includes(track?._id)
    : false

  useClickOutside(moreOptionRef, CloseOptionHandler)

  return (
    <div className={`${style.item__view} `}>
      <div className={style.image}>
        <img src={track?.photo?.path} alt='Poster List' />
        {role !== ERole.ARTIST && (
          <>
            {isPlaying &&
              trackPlaying?._id == track?._id && (
                <div className={style.song__animation}>
                  <TrackAnimation />
                </div>
              )}
            <div className={style.song__play}>
              <button onClick={handlePlay}>
                {isPlaying &&
                trackPlaying?._id == track._id ? (
                  <FaPause />
                ) : (
                  <FaPlay />
                )}
              </button>
            </div>
          </>
        )}
      </div>
      <div className={`${style.track__info}`}>
        <Link
          to={`/track/${track?.slug}${track?._id}.html`}
          className={style.track__name}
        >
          {track?.title}
        </Link>
        <div className={style.artist}>
          {track?.author && (
            <Link
              to={`/artist/${track?.author?.slug}${track?.author?._id}.html`}
            >
              {track?.author?.username}
            </Link>
          )}
          {track?.artist?.map((artist) => (
            <Link
              key={artist._id}
              to={`/artist/${artist?.slug}${artist?._id}.html`}
            >
              {artist.username}
            </Link>
          ))}
        </div>
      </div>
      <div className={style.control}>
        <div className={style.wrapper__control}>
          {role !== ERole.ARTIST && (
            <button
              className={style.btn}
              onClick={handleLikeTrack}
            >
              {likedTrack ? (
                <IoHeart />
              ) : (
                <IoHeartOutline />
              )}
            </button>
          )}
          <button
            onClick={OpenMoreHandler}
            className={style.btn}
          >
            <LuMoreHorizontal />
          </button>
        </div>
      </div>
      {isMoreVisible && (
        <MoreList
          refItem={moreOptionRef}
          location={location}
          track={track}
          handleLikeTrack={handleLikeTrack}
          likedTrack={likedTrack}
          interaction={interaction}
        />
      )}
    </div>
  )
}

export default ItemViewBar
