import { ItemViewBar } from '~/components/features'
import style from '~/styles/Viewbar.module.css'
import { useAppSelector } from '~/hooks'
import { DInteraction } from '~/types/data'

interface Props {
  interaction: DInteraction
}

const ListPlaying = ({ interaction }: Props) => {
  const { waitingList } = useAppSelector(
    (state) => state.trackPlay
  )

  return (
    <div className={style.list}>
      {waitingList.map((track, index) => (
        <ItemViewBar
          track={track}
          key={index}
          interaction={interaction}
        />
      ))}
    </div>
  )
}

export default ListPlaying
