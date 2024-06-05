import {
  IoHeartOutline,
  IoHeartSharp
} from 'react-icons/io5'
import { useAppSelector } from '~/hooks'
import style from '~/styles/Player.module.css'

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
        <p className={style.track__artist}>
          <span>{track?.author?.username}</span>
          {!!track?.artist?.length &&
            track?.artist?.map((artist) => (
              <span key={artist._id}>
                {artist.username}
              </span>
            ))}
        </p>
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
