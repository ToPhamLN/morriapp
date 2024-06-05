import { CardPlaylist } from '~/components/features'
import style from '~/styles/ArtistAlbum.module.css'
import style2 from '~/styles/Card.module.css'
import { useAppSelector, useFetcher } from '~/hooks'
import { DListTrack } from '~/types/data'
import useSWR from 'swr'

const ArtistAlbum = () => {
  const { _id } = useAppSelector(
    (state) => state.profile?.idRole
  ) as { _id: string }
  const fetcher = useFetcher()
  const API = 'api/v1/listtracks/all' as string
  const { data } = useSWR(API + 'artist', () =>
    fetcher(API, {
      params: {
        author: _id
      }
    })
  ) as {
    data: DListTrack[]
  }

  return (
    <div className={style.artist__album}>
      <h1>Album của tôi</h1>

      <div className={style2.grid}>
        {data?.map((album) => (
          <CardPlaylist key={album._id} listTrack={album} />
        ))}
      </div>
    </div>
  )
}

export default ArtistAlbum
