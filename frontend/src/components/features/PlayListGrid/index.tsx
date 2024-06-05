import React, { useEffect, useState } from 'react'
// import { FaPlay } from 'react-icons/fa'
import { Link } from 'react-router-dom'
import useSWR from 'swr'
// import { TrackAnimation } from '~/components/common'
import {
  useAppSelector,
  useAxiosPrivate,
  useFetcher
} from '~/hooks'
import style from '~/styles/Home.module.css'
import { DInteraction, DListTrack } from '~/types/data'

const PlaylistGrid: React.FC = () => {
  const [wishList, setWishList] = useState<DListTrack[]>([])
  const { idRole } = useAppSelector(
    (state) => state.profile
  )
  const axios = useAxiosPrivate()
  const fetcher = useFetcher()

  const API = 'api/v1/listtracks/all' as string
  const { data: playistCreated } = useSWR(
    idRole ? API : '',
    () => {
      if (idRole)
        return fetcher(API, {
          params: {
            author: idRole?._id
          }
        })
      return []
    }
  ) as {
    data: DListTrack[]
  }

  const wishTrack: DListTrack = {
    title: 'Danh sách ưu thích',
    description: 'Danh sách bài hát ưa thích của tôi',
    photo: {
      path: '/src/assets/wish.png',
      fileName: 'wishList'
    },
    list: [],
    genre: []
  }

  const { data: interaction } = useSWR(
    idRole?._id
      ? `api/v1/interactions/${idRole?._id}`
      : null,
    fetcher
  ) as { data: DInteraction }

  const getTrack = async (id: string) => {
    try {
      const res = await axios.get(`api/v1/listtracks/${id}`)
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
          interaction.wishList.map(async (trackId) => {
            const trackData = await getTrack(trackId)
            return trackData
          })

        const trackDetails = await Promise.all(
          trackDetailsPromises
        )

        setWishList(trackDetails.filter(Boolean))
      }

      fetchTrackDetails()
    }
  }, [interaction])
  return (
    <div className={style.parent}>
      <Child listTrack={wishTrack} type={'wishTrack'} />
      {playistCreated?.map((listTrack) => (
        <Child key={listTrack._id} listTrack={listTrack} />
      ))}
      {wishList?.map((listTrack) => (
        <Child key={listTrack._id} listTrack={listTrack} />
      ))}
    </div>
  )
}
export default PlaylistGrid

const Child = ({
  listTrack,
  type
}: {
  listTrack: DListTrack
  type?: string
}) => {
  const { photo, title, category, slug, _id } = listTrack
  const path = !type
    ? `/${category?.toLowerCase()}/${slug}${_id}.html`
    : '/wishtrack'

  return (
    <div className={style.child}>
      <div className={style.title}>
        <div className={style.image}>
          <img
            src={
              photo?.path
                ? photo?.path
                : '/src/assets/disc.png'
            }
            alt='Image Playlist'
          />
        </div>
        {/* <div className={style.song__animation}>
          <TrackAnimation />
        </div>
        <div className={style.song__play}>
          <button>
            <FaPlay />
          </button>
        </div> */}
      </div>
      <div className={style.info}>
        <div className={style.playlist__name}>
          <Link to={path}>{title}</Link>
        </div>
      </div>
    </div>
  )
}
