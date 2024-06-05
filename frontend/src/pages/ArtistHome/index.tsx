import React, { useRef, useState } from 'react'
import { FaPause, FaPlay } from 'react-icons/fa'
import { MdAdd, MdCreate } from 'react-icons/md'
import useSWR, { mutate } from 'swr'
import {
  Playlist,
  SlickPeople,
  SlickPlaylist
} from '~/components/features'
import {
  useAppDispatch,
  useAppSelector,
  useAxiosPrivate,
  useFetcher
} from '~/hooks'
import style from '~/styles/ArtistDetails.module.css'
import {
  DArtist,
  DBios,
  DListTrack,
  DMonthlyListens,
  DPerson,
  DTrack
} from '~/types/data'
import UpdateArtist from './UpdateArtist'
import { ERole } from '~/constants/enum'
import Bios from './Bios'
import { useParams } from 'react-router-dom'
import {
  setIsPlaying,
  setList,
  setListInfo,
  setTrack
} from '~/reduxStore/trackPlaySlice'
import { formatNumber } from '~/utils/format'

interface BiosData extends DBios {
  createdAt: string
}
const ArtistHome = () => {
  const [openEdit, setEdit] = useState<boolean>(false)
  const [openBios, setOpenBios] = useState<boolean>(false)
  const idParam = useParams().artistParam?.slice(-29, -5)
  const { role, idRole } = useAppSelector(
    (state) => state.profile
  ) as {
    role?: ERole
    idRole?: { _id?: string }
  }
  const dispatch = useAppDispatch()
  const { isPlaying } = useAppSelector(
    (state) => state.trackPlay
  )

  const idArtist = idParam || idRole?._id
  const fetcher = useFetcher()
  const axios = useAxiosPrivate()
  const apiArtist = `api/v1/artists/${idArtist}`
  const apiTracks = 'api/v1/tracks/all'
  const apiLists = 'api/v1/listtracks/all'
  const apiBios = `api/v1/bios/${idArtist}`
  const apiFollower = `api/v1/followings/artists/${idArtist}`
  const apiMonthlyListen = `api/v1/monthlylistens/thismonth`

  const { data: artist, isLoading: loadingArtist } = useSWR(
    apiArtist,
    fetcher
  ) as { data: DArtist; isLoading: boolean }

  const { data: tracks, isLoading: loadingTracks } = useSWR(
    apiTracks,
    () =>
      fetcher(apiTracks, {
        params: {
          author: idArtist
        }
      })
  ) as { data: DTrack[]; isLoading: boolean }
  const { data: lists, isLoading: loadingLists } = useSWR(
    apiLists + 'artist',
    () =>
      fetcher(apiLists, {
        params: {
          author: idArtist
        }
      })
  )

  const { data: pinLists, isLoading: loadingPin } = useSWR(
    apiLists + 'artist/pin',
    () =>
      fetcher(apiLists, {
        params: {
          author: idArtist,
          pin: true
        }
      })
  ) as {
    data: DListTrack[]
    isLoading: boolean
  }

  const { data: bios, isLoading: loadingBios } = useSWR(
    apiBios,
    fetcher
  ) as {
    data: DBios
    isLoading: boolean
  }

  const { data: followers, isLoading: loadingFollower } =
    useSWR(apiFollower, fetcher) as {
      data: DPerson[]
      isLoading: boolean
    }
  const { data: monthlyListens } = useSWR(
    apiMonthlyListen,
    () =>
      fetcher(apiMonthlyListen, {
        params: {
          item: idArtist,
          itemCategory: 'Artist'
        }
      })
  ) as { data: DMonthlyListens }

  const isFollowing =
    followers?.some(
      (follower) => follower?._id == idRole?._id
    ) && role == ERole.USER
  //RefMenu
  const menuRef = {
    pin: useRef<HTMLDivElement>(null),
    popular: useRef<HTMLDivElement>(null),
    collection: useRef<HTMLDivElement>(null),
    bio: useRef<HTMLDivElement>(null)
  }
  const scrollToSection = (
    ref: React.RefObject<HTMLDivElement>
  ) => {
    const main = document.querySelector('.main') as Element
    if (ref.current) {
      ref?.current.scrollIntoView({
        // behavior: 'smooth',
        block: 'start',
        inline: 'nearest'
      })

      main.scrollBy(0, -80)
    }
  }

  const handleFollow = async () => {
    try {
      await axios.post('api/v1/followings/follow', {
        artistId: idArtist
      })
      mutate(apiFollower)
    } catch (error) {
      console.log(error)
    }
  }

  const handlePlay = () => {
    dispatch(setListInfo(undefined))
    dispatch(setTrack(tracks[0]))
    dispatch(setList(tracks))
    dispatch(setIsPlaying(true))
    if (isPlaying) dispatch(setIsPlaying(false))
  }

  return (
    <div className={style.artist__details}>
      <div
        className={`${style.background} ${loadingArtist ? 'loading' : ''}`}
        style={{
          background: loadingArtist ? '' : '#0F172A'
        }}
      >
        {artist?.background?.path && (
          <div className={style.image}>
            <img src={artist?.background?.path} alt='' />
          </div>
        )}
        <div className={style.artist__info}>
          <div
            className={`${style.artist__avatar} ${loadingArtist ? 'loading' : ''}`}
          >
            <img
              src={
                artist?.avatar?.path ||
                '/src/assets/account-default.png'
              }
              alt=''
            />
          </div>
          <div className={style.right}>
            <h1 className={style.artist__name}>
              {artist?.username}
            </h1>
            <div
              className={`${style.statistical}  ${loadingArtist ? 'loading' : ''}`}
            >
              <span>
                {formatNumber(monthlyListens?.count)} Lượt
                nghe tháng này
              </span>
              <span>
                {followers &&
                  formatNumber(followers?.length)}{' '}
                Lượt theo dõi
              </span>
            </div>
          </div>
        </div>
      </div>
      <div className={`${style.header} `}>
        <div className={style.menu}>
          <button
            onClick={() => scrollToSection(menuRef.pin)}
          >
            Nổi bật
          </button>
          <button
            onClick={() => scrollToSection(menuRef.popular)}
          >
            Phổ biến
          </button>
          <button
            onClick={() =>
              scrollToSection(menuRef.collection)
            }
          >
            Bộ sưu tập
          </button>
          <button
            onClick={() => scrollToSection(menuRef.bio)}
          >
            Tiểu sử
          </button>
        </div>
        <div className={style.handler}>
          {role === ERole.ARTIST ? (
            <button
              className={style.btn}
              onClick={() => setEdit(true)}
            >
              <MdCreate className={style.icon} />
              Chỉnh sửa
            </button>
          ) : (
            <button
              className={style.btn}
              onClick={handleFollow}
            >
              <MdAdd className={style.icon} />
              {isFollowing ? 'Bỏ theo dõi' : 'Theo dõi'}
            </button>
          )}
        </div>
      </div>

      <div className={style.map} ref={menuRef.pin}>
        {!loadingPin && (
          <SlickPlaylist
            listListTrack={pinLists}
            nameSection='Nổi bật'
          />
        )}
      </div>
      <div
        className={style.popular__songs}
        ref={menuRef.popular}
      >
        <h1>Phổ biến</h1>
        {role !== ERole.ARTIST && (
          <button
            className={style.play__playlist}
            onClick={handlePlay}
          >
            {isPlaying ? <FaPause /> : <FaPlay />}
          </button>
        )}
        <div
          className={`${style.popular__songs__container} ${loadingTracks ? 'loading' : ''}`}
        >
          {tracks?.length > 0 && <Playlist list={tracks} />}
        </div>
      </div>
      <div className={style.map} ref={menuRef.collection}>
        {loadingLists ? (
          <div className={style.popular__songs}>
            <div
              className={`${style.popular__songs__container} ${loadingLists ? 'loading' : ''}`}
            ></div>
          </div>
        ) : (
          <SlickPlaylist
            listListTrack={lists}
            nameSection='Bộ sưu tập'
          />
        )}
      </div>
      {!loadingFollower && (
        <SlickPeople
          listPerson={followers}
          nameSection='Đang theo dõi'
        />
      )}
      <div className={style.artist__bio} ref={menuRef.bio}>
        <h1>Tiểu sử</h1>
        <article
          className={`${style.container} ${loadingBios ? 'loading' : ''}`}
          role='button'
          onClick={() => setOpenBios(true)}
        >
          <img src={bios?.photos[0]?.path} alt='' />
        </article>
      </div>
      {openEdit && (
        <UpdateArtist setExit={setEdit} artist={artist} />
      )}
      {openBios && (
        <Bios
          setExit={setOpenBios}
          bios={bios as BiosData}
        />
      )}
    </div>
  )
}
export default ArtistHome
