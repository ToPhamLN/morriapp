import { useState, useRef, MouseEvent } from 'react'
import { IoHeartOutline, IoHeart } from 'react-icons/io5'
import { LuMoreHorizontal } from 'react-icons/lu'
import { FaPlay, FaPause } from 'react-icons/fa'
import style from '~/styles/PlayListDetails.module.css'
import {
  Link,
  useLocation,
  useNavigate
} from 'react-router-dom'
import {
  useHover,
  useClickOutside,
  useAppSelector,
  useAppDispatch,
  useAxiosPrivate,
  useSearchHandler
} from '~/hooks'
import TrackAnimation from '../../../common/TrackAnimation'
import { MoreList } from '~/components/common'
import { ERole } from '~/constants/enum'
import {
  DInteraction,
  DListTrack,
  DTrack
} from '~/types/data'
import { formatDay, formatTime } from '~/utils/format'
import {
  setIsPlaying,
  setList,
  setListInfo,
  setTrack
} from '~/reduxStore/trackPlaySlice'
import { mutate } from 'swr'

type DListTrackWithoutList = Omit<DListTrack, 'list'>

interface Props {
  track: DTrack
  list: DTrack[]
  listInfo?: DListTrackWithoutList
  index: number
  interaction: DInteraction
}

const ItemPlayList = ({
  track,
  list,
  listInfo,
  index,
  interaction
}: Props) => {
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
  const navigate = useNavigate()
  const { pathname } = useLocation()

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

  // hover name, album,artist while fixed
  const {
    isHovered: isNameHovered,
    hoverPosition: nameHoverPosition,
    handleMouseEnter: handleNameMouseEnter,
    handleMouseLeave: handleNameMouseLeave
  } = useHover()

  const {
    isHovered: isArtistHovered,
    hoverPosition: artistHoverPosition,
    handleMouseEnter: handleArtistMouseEnter,
    handleMouseLeave: handleArtistMouseLeave
  } = useHover()

  const {
    isHovered: isAlbumHovered,
    hoverPosition: albumHoverPosition,
    handleMouseEnter: handleAlbumMouseEnter,
    handleMouseLeave: handleAlbumMouseLeave
  } = useHover()

  //add search item
  const { handleAddSearch } = useSearchHandler()

  const handlePlay = () => {
    dispatch(setListInfo(listInfo as DListTrack))
    dispatch(setTrack(track))
    if (role != ERole.ARTIST) dispatch(setList(list))
    dispatch(setIsPlaying(true))
    if (isPlaying && trackPlaying == track)
      dispatch(setIsPlaying(false))
  }

  const handleLikeTrack = async () => {
    try {
      if (role === ERole.USER && idRole?._id) {
        await axios.put(
          `api/v1/interactions/wish/track/${track?._id}`
        )
        mutate(`api/v1/interactions/${idRole?._id}`)
        mutate(
          `api/v1/interactions/count/wish/track/${track?._id}`
        )
      } else
        navigate('/login', {
          state: {
            history: pathname
          }
        })
    } catch (error) {
      console.log(error)
    }
  }

  const likedTrack = track?._id
    ? interaction?.wishTrack?.includes(track?._id)
    : false
  return (
    <div className={style.song__item}>
      <div className={style.song__index}>{index}</div>
      <div className={style.song__title}>
        <div className={style.song__image}>
          <img
            src={track?.photo?.path}
            alt={track?.photo?.fileName}
          />
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
        <div className={style.song__name__album}>
          <div
            className={style.song__name}
            onMouseEnter={handleNameMouseEnter}
            onMouseLeave={handleNameMouseLeave}
          >
            <Link
              to={`/track/${track?.slug}${track?._id}.html`}
              onClick={() => {
                handlePlay()
                handleAddSearch(
                  track?.title,
                  track?.photo,
                  `/track/${track?.slug}${track?._id}.html`
                )
              }}
            >
              {track?.title}
            </Link>
            {isNameHovered && (
              <div
                className={style.hover__content}
                style={{
                  position: 'fixed',
                  top: nameHoverPosition.top,
                  left: nameHoverPosition.left
                }}
              >
                {track?.title}
              </div>
            )}
          </div>
          <div
            className={style.song__artist}
            onMouseEnter={handleArtistMouseEnter}
            onMouseLeave={handleArtistMouseLeave}
          >
            {track.author && (
              <Link
                to={`/artist/${track.author?.slug}${track?.author?._id}.html`}
                onClick={() =>
                  handleAddSearch(
                    track?.author?.username,
                    track?.author?.avatar,
                    `/artist/${track.author?.slug}${track?.author?._id}.html`
                  )
                }
              >
                {track?.author?.username}
              </Link>
            )}
            {track.artist?.map((artist) => (
              <Link
                key={artist._id}
                to={`/artist/${artist?.slug}${artist?._id}.html`}
                onClick={() =>
                  handleAddSearch(
                    artist?.username,
                    artist?.avatar,
                    `/artist/${artist?.slug}${artist?._id}.html`
                  )
                }
              >
                {artist.username}
              </Link>
            ))}

            {isArtistHovered && (
              <div
                className={style.hover__content}
                style={{
                  position: 'fixed',
                  top: artistHoverPosition.top,
                  left: artistHoverPosition.left
                }}
              >
                {track?.author?.username}
                {track.artist?.map((artist) => (
                  <span key={artist._id}>
                    {artist.username}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      <div
        className={style.song__album}
        onMouseEnter={handleAlbumMouseEnter}
        onMouseLeave={handleAlbumMouseLeave}
      >
        <Link
          to={`/album/${track?.album?.slug}${track?.album?._id}.html`}
          onClick={() =>
            handleAddSearch(
              track?.album?.title,
              track?.album?.photo,
              `/album/${track?.album?.slug}${track?.album?._id}.html`
            )
          }
        >
          {track?.album?.title}
        </Link>
        {isAlbumHovered && (
          <div
            className={style.hover__content}
            style={{
              position: 'fixed',
              top: albumHoverPosition.top,
              left: albumHoverPosition.left
            }}
          >
            {track?.album?.title}
          </div>
        )}
      </div>
      <div className={style.song__day}>
        {formatDay(track?.updatedAt as string)}
      </div>

      {role !== ERole.ARTIST && (
        <div className={style.song__like}>
          <button
            className={style.btn}
            onClick={handleLikeTrack}
          >
            {likedTrack ? <IoHeart /> : <IoHeartOutline />}
          </button>
        </div>
      )}
      <div className={style.song__control}>
        <span className={style.duration}>
          {formatTime(track?.duration as number)}
        </span>
        <button
          className={style.btn}
          onClick={OpenMoreHandler}
        >
          <LuMoreHorizontal />
        </button>
      </div>
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
  )
}

export default ItemPlayList
