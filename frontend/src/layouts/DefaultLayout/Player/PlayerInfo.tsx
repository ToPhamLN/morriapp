import {
  IoHeartOutline,
  IoHeartSharp
} from 'react-icons/io5'
import { useAppSelector } from '~/hooks'
import style from '~/styles/Player.module.css'
import { Link } from 'react-router-dom'

type Props = {
  likedTrack: boolean
  handleLikeTrack: () => Promise<void>
}

const PlayerInfo = ({
  likedTrack,
  handleLikeTrack
}: Props) => {
  const { track } = useAppSelector(
    (state) => state.trackPlay
  )
  return (
    <div className={style.track__info}>
      <div className={style.track__img}>
        <img src={track?.photo?.path} alt='Poster Track' />
      </div>
      <div>
        <h1 className={style.track__name}>
          {track?.title}
        </h1>
        <div className={style.track__artist}>
          {track.author && (
            <Link
              to={`/artist/${track.author?.slug}${track?.author?._id}.html`}
            >
              {track?.author?.username}
            </Link>
          )}
          {track.artist?.map((artist) => (
            <Link
              key={artist._id}
              to={`/artist/${artist?.slug}${artist?._id}.html`}
            >
              {artist.username}
            </Link>
          ))}
        </div>
      </div>
      <button
        className={style.track__like}
        hover-content={'Lưa vào Thư viện'}
        onClick={handleLikeTrack}
      >
        {likedTrack ? <IoHeartSharp /> : <IoHeartOutline />}
      </button>
    </div>
  )
}

export default PlayerInfo
