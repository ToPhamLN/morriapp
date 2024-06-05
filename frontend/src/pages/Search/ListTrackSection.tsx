import { CardPlaylist } from '~/components/features'
import style from '~/styles/Card.module.css'
import style2 from '~/styles/Search.module.css'
import { DListTrack } from '~/types/data'

interface Props {
  listTracks: DListTrack[]
  nameSection: string
}

const ListTrackSection = ({
  listTracks,
  nameSection
}: Props) => {
  const render: boolean = listTracks?.length > 0
  if (!render)
    return (
      <div
        className={`${style2.map} loading`}
        style={{
          width: 'auto',
          margin: '0 1rem',
          height: '100vh'
        }}
      ></div>
    )
  return (
    <div className={style.map}>
      <h1>{nameSection}</h1>
      <div className={style.grid}>
        {listTracks?.map((listTrack, index) => (
          <CardPlaylist listTrack={listTrack} key={index} />
        ))}
      </div>
    </div>
  )
}

export default ListTrackSection
