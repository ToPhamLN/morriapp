import React, { useEffect, useState } from 'react'
import { ItemViewBar } from '~/components/features'
import { useAxiosPrivate } from '~/hooks'
import style from '~/styles/Viewbar.module.css'
import { DInteraction, DTrack } from '~/types/data'
interface Props {
  interaction: DInteraction
}

const RecentlyTrack = ({ interaction }: Props) => {
  const [recentlyTrack, setRecentlyTrack] = useState<
    DTrack[]
  >([])
  const axios = useAxiosPrivate()
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

        const trackDetails = await Promise.all(
          trackDetailsPromises
        )
        setRecentlyTrack(trackDetails.filter(Boolean))
      }

      fetchTrackDetails()
    }
  }, [interaction])

  return (
    <div className={style.list}>
      {recentlyTrack.map((track, index) => (
        <ItemViewBar
          key={index}
          track={track}
          interaction={interaction}
        />
      ))}
    </div>
  )
}

export default RecentlyTrack
