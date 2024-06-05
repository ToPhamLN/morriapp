import { useEffect, useRef, useState } from 'react'
import style from '~/styles/ArtistDetails.module.css'

import {
  Playlist,
  SlickPlaylist,
  SlickPeople
} from '~/components/features'
import { useParams } from 'react-router-dom'
import {
  useAppSelector,
  useAxiosPrivate,
  useFetcher
} from '~/hooks'
import useSWR from 'swr'
import {
  DInteraction,
  DListTrack,
  DPerson,
  DTrack,
  DUser
} from '~/types/data'
import { MdCreate } from 'react-icons/md'
import UpdateUser from './UpdateUser'

const UserDetails = () => {
  const [recentlyTrack, setRecentlyTrack] = useState<
    DTrack[]
  >([])
  const [edit, setEdit] = useState<boolean>(false)
  const idParam = useParams().userParam?.slice(-29, -5)
  const { idRole } = useAppSelector(
    (state) => state.profile
  )
  const fetcher = useFetcher()
  const axios = useAxiosPrivate()
  const idUser = idParam || idRole?._id || null

  const apiUser = `api/v1/users/${idUser}`
  const apiPin = 'api/v1/listtracks/all'
  const apiInteraction = `api/v1/interactions/${idUser}`
  const apiFollowing = `api/v1/followings/users/${idUser}`

  const { data: user, isLoading: loadingUser } = useSWR(
    apiUser,
    fetcher
  ) as { data: DUser; isLoading: boolean }

  const { data: pinLists, isLoading: loadingPin } = useSWR(
    apiPin + 'user/pin',
    () =>
      fetcher(apiPin, {
        params: {
          author: idUser,
          pin: true
        }
      })
  ) as {
    data: DListTrack[]
    isLoading: boolean
  }
  const {
    data: interaction,
    isLoading: loadingInteraction
  } = useSWR(idUser ? apiInteraction : null, fetcher) as {
    data: DInteraction
    isLoading: boolean
  }
  const { data: following, isLoading: loadingFollowing } =
    useSWR(apiFollowing, fetcher) as {
      data: DPerson[]
      isLoading: boolean
    }

  const getTrack = async (id: string) => {
    try {
      const res = await axios.get(`api/v1/tracks/${id}`)
      return res.data
    } catch (error) {
      console.log(error)
      return null
    }
  }
  useEffect(() => {
    if (interaction && interaction.recentlyTrack) {
      const fetchTrackDetails = async () => {
        const trackDetailsPromises =
          interaction.recentlyTrack.map(async (trackId) => {
            const trackData = await getTrack(trackId)
            return trackData
          })

        const trackDetails = (await Promise.all(
          trackDetailsPromises
        )) as DTrack[]

        setRecentlyTrack(trackDetails.filter(Boolean))
      }

      fetchTrackDetails()
    }
  }, [interaction])

  //RefMenu
  const menuRef = {
    pin: useRef<HTMLDivElement>(null),
    recentlyTrack: useRef<HTMLDivElement>(null),
    following: useRef<HTMLDivElement>(null)
  }
  const scrollToSection = (
    ref: React.RefObject<HTMLDivElement>
  ) => {
    const main = document.querySelector('.main') as Element
    if (ref.current) {
      ref?.current.scrollIntoView({
        block: 'start',
        inline: 'nearest'
      })

      main.scrollBy(0, -80)
    }
  }
  return (
    <div className={style.artist__details}>
      <div
        className={`${style.background} ${loadingUser ? 'loading' : ''}`}
        style={{ background: loadingUser ? '' : '#0F172A' }}
      >
        {user?.background?.path && (
          <div className={style.image}>
            <img src={user?.background?.path} alt='' />
          </div>
        )}
        <div className={style.artist__info}>
          <div
            className={`${style.artist__avatar} ${loadingUser ? 'loading' : ''}`}
          >
            <img
              src={
                user?.avatar?.path ||
                '/src/assets/account-default.png'
              }
            />
          </div>
          <div className={style.right}>
            <h1 className={style.artist__name}>
              {user?.username}
            </h1>
            <div
              className={`${style.statistical}  ${loadingUser ? 'loading' : ''}`}
            >
              {pinLists?.length} Danh sách công khai
            </div>
          </div>
        </div>
      </div>
      <div className={`${style.header} `}>
        <div className={style.menu}>
          {loadingPin && (
            <button
              onClick={() => scrollToSection(menuRef.pin)}
            >
              Công khai
            </button>
          )}
          <button
            onClick={() =>
              scrollToSection(menuRef.recentlyTrack)
            }
          >
            Nghe gần đây
          </button>
          {loadingFollowing && (
            <button
              onClick={() =>
                scrollToSection(menuRef.following)
              }
            >
              Theo dõi
            </button>
          )}
        </div>
        <div className={style.handler}>
          {idRole?._id === idUser && (
            <button
              className={style.btn}
              onClick={() => setEdit(true)}
            >
              <MdCreate className={style.icon} />
              Chỉnh sửa
            </button>
          )}
        </div>
      </div>
      <div className={style.map} ref={menuRef.pin}>
        {!loadingPin && (
          <SlickPlaylist
            listListTrack={pinLists}
            nameSection='Danh sách công khai'
          />
        )}
      </div>

      <div
        className={style.popular__songs}
        ref={menuRef.recentlyTrack}
      >
        <h1>Nghe gần đây</h1>
        <div
          className={`${style.popular__songs__container} ${loadingInteraction ? 'loading' : ''}`}
        >
          <Playlist list={recentlyTrack} />
        </div>
      </div>
      <div className={style.map} ref={menuRef.following}>
        {!loadingFollowing && (
          <SlickPeople
            listPerson={following}
            nameSection='Đang theo dõi'
          />
        )}
      </div>
      {edit && <UpdateUser setExit={setEdit} user={user} />}
    </div>
  )
}

export default UserDetails
