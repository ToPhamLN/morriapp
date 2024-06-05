import {
  MdOutlineRadioButtonUnchecked,
  MdOutlineRadioButtonChecked
} from 'react-icons/md'
import { useAxiosPrivate } from '~/hooks'
import style from '~/styles/MoreList.module.css'
import { DListTrack, DTrack } from '~/types/data'
import { mutate } from 'swr'

interface DListTrackWithStringList
  extends Omit<DListTrack, 'list'> {
  list: string[]
}

interface Props {
  listTrack: DListTrackWithStringList
  track: DTrack
}

const AddNew = ({ listTrack, track }: Props) => {
  const axios = useAxiosPrivate()

  const handleClick = async () => {
    try {
      await axios.put(
        `api/v1/listtracks/addtrack/${listTrack?._id}`,
        {
          track: track?._id
        }
      )
      mutate('api/v1/listtracks/all' + 'user')
    } catch (error) {
      console.log(error)
    }
  }
  const existedTrack = track?._id
    ? listTrack?.list?.includes(track?._id)
    : false
  return (
    <button
      className={style.add__new}
      onClick={handleClick}
    >
      {existedTrack ? (
        <MdOutlineRadioButtonChecked
          className={style.icon}
        />
      ) : (
        <MdOutlineRadioButtonUnchecked
          className={style.icon}
        />
      )}
      <span>{listTrack?.title}</span>
    </button>
  )
}

export default AddNew
