import React, { useEffect, useState } from 'react'
import style from '~/styles/Mylist.module.css'
import style2 from '~/styles/Card.module.css'
import { CardPlaylist } from '~/components/features'
import { DInteraction, DListTrack } from '~/types/data'
import {
  useAppSelector,
  useAxiosPrivate,
  useFetcher
} from '~/hooks'
import useSWR from 'swr'

const Mylist: React.FC = () => {
  const [wishList, setWishList] = useState<DListTrack[]>([])
  const { idRole } = useAppSelector(
    (state) => state.profile
  )
  const axios = useAxiosPrivate()
  const fetcher = useFetcher()
  const API = 'api/v1/listtracks/all' as string
  const { data: playistCreated } = useSWR(API, () =>
    fetcher(API, {
      params: {
        author: idRole?._id
      }
    })
  ) as {
    data: DListTrack[]
  }

  const { data: interaction } = useSWR(
    idRole?._id
      ? `api/v1/interactions/${idRole?._id}`
      : null,
    fetcher
  ) as { data: DInteraction }

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
    <div className={style.mylist}>
      <div className={style.map}>
        <h1>Danh sách của tôi</h1>
        <div className={style2.grid}>
          <CardPlaylist
            listTrack={wishTrack}
            type={'wishTrack'}
          />
          {playistCreated?.map((listTrack) => (
            <CardPlaylist
              key={listTrack._id}
              listTrack={listTrack}
            />
          ))}
          {wishList?.map((listTrack) => (
            <CardPlaylist
              key={listTrack._id}
              listTrack={listTrack}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export default Mylist
