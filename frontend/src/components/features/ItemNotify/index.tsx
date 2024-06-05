import { MdOutlineClose } from 'react-icons/md'
import { Link } from 'react-router-dom'
import { mutate } from 'swr'
import { useAxiosPrivate } from '~/hooks'
import style from '~/styles/Navbar.module.css'
import { DNotifiction } from '~/types/data'

interface Props {
  notification: DNotifiction
}

const ItemNotify = ({ notification }: Props) => {
  const axios = useAxiosPrivate()
  const handleDelete = async () => {
    try {
      await axios.delete(
        `api/v1/notifications/${notification?._id}/delete`
      )
      mutate('api/v1/notifications/mine')
    } catch (error) {
      console.log(error)
    }
  }
  return (
    <div className={`${style.notify__item} `}>
      <Link to={notification?.path || ''}>
        <div className={style.type}>
          {notification?.photo?.path && (
            <img
              src={notification?.photo?.path}
              alt=''
              className={style.type__image}
            />
          )}
        </div>
      </Link>
      <Link
        to={notification?.path || ''}
        className={style.info}
      >
        <div className={style.info}>
          {notification?.title && (
            <div className={style.title}>
              {notification?.title}
            </div>
          )}
          {notification?.message && (
            <div className={style.description}>
              {notification?.message}
            </div>
          )}
        </div>
      </Link>
      <button className={style.icon} onClick={handleDelete}>
        <MdOutlineClose />
      </button>
    </div>
  )
}

export default ItemNotify
