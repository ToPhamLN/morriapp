import React, {
  useState,
  useRef,
  useMemo,
  MouseEvent
} from 'react'
import { IoMdDownload } from 'react-icons/io'
import { IoHeart, IoHeartOutline } from 'react-icons/io5'
import {
  MdAudiotrack,
  MdOutlineAccessTime,
  MdOutlineMoreVert
} from 'react-icons/md'
import style from '~/styles/ArtistAlbumDetails.module.css'
import { MoreListHeader } from '~/components/common'
import {
  useAppSelector,
  useAxiosPrivate,
  useClickOutside,
  useFetcher
} from '~/hooks'
import { Link, useParams } from 'react-router-dom'
import {
  DImage,
  DInteraction,
  DListTrack,
  DMonthlyListens,
  DTrack
} from '~/types/data'
import { Playlist } from '~/components/features'
import useSWR, { mutate } from 'swr'
import { formatNumber, formatTime } from '~/utils/format'
import { ERole } from '~/constants/enum'
import { downloadMusic } from '~/utils/helpers'

const ArtistAlbumDetails: React.FC = () => {
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
  const idAlbum = useParams().albumParam?.slice(-29, -5)
  const { role, idRole } = useAppSelector(
    (state) => state.profile
  )
  const axios = useAxiosPrivate()

  //MoreListHeader
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

  //Handle Get Album
  const apiEndPoint = `api/v1/listtracks/${idAlbum}`
  const apiMonthlyListen = `api/v1/monthlylistens/thismonth`

  const fetcher = useFetcher()
  const { data: listTrack } = useSWR(
    apiEndPoint,
    fetcher
  ) as { data: DListTrack }
  const { data: interaction } = useSWR(
    idRole?._id
      ? `api/v1/interactions/${idRole?._id}`
      : null,
    fetcher
  ) as { data: DInteraction }

  const { data: monthlyListens } = useSWR(
    apiMonthlyListen,
    () =>
      fetcher(apiMonthlyListen, {
        params: {
          item: idAlbum,
          itemCategory: 'ListTrack'
        }
      })
  ) as { data: DMonthlyListens }

  const likedListTrack = listTrack?._id
    ? interaction?.wishList?.includes(listTrack?._id)
    : false
  const handleAddWishList = async () => {
    try {
      await axios.put(
        `api/v1/interactions/wish/listTrack/${listTrack?._id}`
      )
      mutate(`api/v1/interactions/${idRole?._id}`)
      mutate(`api/v1/listtracks/${idAlbum}`)
    } catch (error) {
      console.log(error)
    }
  }

  const durationAll = useMemo(() => {
    if (listTrack) {
      return listTrack?.list?.reduce(
        (accumulator, track: DTrack) =>
          accumulator + (track?.duration ?? 0),
        0
      )
    }
    return 0
  }, [listTrack])

  const { list, ...listInfo } = listTrack || {}
  const categoryAuthor =
    listTrack?.author?.role === 'Artist' ? 'artist' : 'user'

  const handleDownload = () => {
    const fileMp3 = list?.map((track) => ({
      path: track?.source?.path,
      fileName: track?.slug
    })) as unknown as DImage[]
    for (const file of fileMp3) {
      downloadMusic(file)
    }
  }

  return (
    <div className={style.artist__album__details}>
      <div className={style.information}>
        <div
          className={style.background}
          style={{ background: listTrack?.background }}
        ></div>
        <div className={style.container__information}>
          <div className={style.photo__wrapper}>
            <div className={style.photo}>
              <img
                src={
                  listTrack?.photo?.path ||
                  '/src/assets/disc.png'
                }
                alt={listTrack?.photo?.fileName}
              />
            </div>
            <div className={`${style.statistical}  `}>
              <span> {listTrack?.category}</span>
              {monthlyListens?.count && (
                <span>
                  {formatNumber(monthlyListens?.count)} Lượt
                  nghe tháng này
                </span>
              )}
            </div>
          </div>
          <h1 className={style.listtrack__title}>
            {listTrack?.title}
          </h1>
        </div>
      </div>
      <div className={style.desc}>
        {listTrack?.description
          ?.split('\n')
          .map((item, index) => (
            <div key={index}>{item}</div>
          ))}
      </div>
      <div className={style.more__information}>
        <Link
          to={`/${categoryAuthor}/${listTrack?.author?.slug}${listTrack?.author?._id}.html`}
        >
          <div className={style.info__user}>
            <div className={style.img__user}>
              <img
                src={
                  listTrack?.author?.avatar?.path
                    ? listTrack?.author?.avatar?.path
                    : '/src/assets/account-default.png'
                }
                alt={listTrack?.author?.avatar?.fileName}
              />
            </div>
            <span className={style.user__name}>
              {listTrack?.author?.username}
            </span>
          </div>
        </Link>
        <ul className={style.statistics}>
          <li>
            {listTrack?.likes}
            <IoHeartOutline />
          </li>
          <li>
            {listTrack?.list?.length} <MdAudiotrack />
          </li>
          <li>
            {formatTime(durationAll as number).toString()}
            <MdOutlineAccessTime />
          </li>
        </ul>
      </div>
      <div className={style.control}>
        {role == ERole.USER && (
          <>
            {idRole?._id !== listTrack?.author?._id && (
              <button
                className={style.like}
                onClick={handleAddWishList}
              >
                {likedListTrack ? (
                  <IoHeart />
                ) : (
                  <IoHeartOutline />
                )}
              </button>
            )}
            <button
              className={style.download}
              onClick={handleDownload}
            >
              <IoMdDownload />
            </button>
          </>
        )}
        <button
          className={style.more}
          onClick={OpenMoreHandler}
        >
          <MdOutlineMoreVert />
        </button>
      </div>
      <div style={{ margin: '0 1rem' }}>
        <Playlist list={list} listInfo={listInfo} />
      </div>
      {isMoreVisible && (
        <MoreListHeader
          refItem={moreOptionRef}
          location={location}
          listTrack={listTrack}
          likedListTrack={likedListTrack}
          handleAddWishList={handleAddWishList}
        />
      )}
    </div>
  )
}

export default ArtistAlbumDetails
