import React, { useState, useMemo, useEffect } from 'react'
import { IoMdDownload } from 'react-icons/io'
import {
  MdAudiotrack,
  MdOutlineAccessTime
} from 'react-icons/md'
import style from '~/styles/ArtistAlbumDetails.module.css'
import {
  useAppSelector,
  useAxiosPrivate,
  useFetcher
} from '~/hooks'
import {
  DInteraction,
  DListTrack,
  DTrack
} from '~/types/data'
import { Playlist } from '~/components/features'
import useSWR from 'swr'
import { formatTime } from '~/utils/format'
import { ERole } from '~/constants/enum'
import { Link } from 'react-router-dom'

const WishTrack: React.FC = () => {
  const { role, idRole } = useAppSelector(
    (state) => state.profile
  )
  const axios = useAxiosPrivate()
  const fetcher = useFetcher()
  const userID = role == ERole.USER ? idRole?._id : null
  const { data: interaction } = useSWR(
    userID ? `api/v1/interactions/${userID}` : null,
    fetcher
  ) as { data: DInteraction }

  const [listTrack, setListTrack] = useState<DListTrack>({
    title: 'Danh sách ưu thích',
    description: 'Danh sách bài hát ưa thích của tôi',
    photo: {
      path: '/src/assets/wish.png',
      fileName: 'wishList'
    },
    background: '#0F172A',
    author: idRole,
    list: [],
    genre: []
  })

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
    if (interaction && interaction.wishTrack) {
      const fetchTrackDetails = async () => {
        const trackDetailsPromises =
          interaction.wishTrack.map(async (trackId) => {
            const trackData = await getTrack(trackId)
            return trackData
          })

        const trackDetails = await Promise.all(
          trackDetailsPromises
        )

        setListTrack((prevListTrack) => ({
          ...prevListTrack,
          list: trackDetails.filter(Boolean)
        }))
      }

      fetchTrackDetails()
    }
  }, [interaction])

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
  const categoryAuthor =
    listTrack?.author?.role === 'Artist' ? 'artist' : 'user'

  return (
    <div className={style.artist__album__details}>
      <div className={style.information}>
        <div
          className={style.background}
          style={{ background: listTrack?.background }}
        ></div>
        <div className={style.container__information}>
          <div className={style.photo}>
            <img
              src={
                listTrack?.photo?.path ||
                '/src/assets/disc.png'
              }
              alt={listTrack?.photo?.fileName}
            />
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
            <button className={style.download}>
              <IoMdDownload />
            </button>
          </>
        )}
      </div>
      <div style={{ margin: '0 1rem' }}>
        <Playlist list={listTrack?.list as []} />
      </div>
    </div>
  )
}

export default WishTrack
