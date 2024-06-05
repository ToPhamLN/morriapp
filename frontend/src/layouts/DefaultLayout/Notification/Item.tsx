import {
  MdError,
  MdOutlineClose,
  MdCheckBox,
  MdWarning
} from 'react-icons/md'
import { useAppDispatch } from '~/hooks'
import { removeNotify } from '~/reduxStore/globalSlice'
import style from '~/styles/Notification.module.css'
import { SNotification } from '~/types/slice'

interface Props {
  notification: SNotification
}
const Item = ({ notification }: Props) => {
  const dispatch = useAppDispatch()
  let IconComponent
  let iconColorClass
  let title

  switch (notification.type) {
    case 'error':
      IconComponent = MdError
      iconColorClass = style.error__icon
      title = 'Lỗi'
      break
    case 'success':
      IconComponent = MdCheckBox
      iconColorClass = style.success__icon
      title = 'Thành công'
      break
    case 'warning':
      IconComponent = MdWarning
      iconColorClass = style.warning__icon
      title = 'Cảnh báo'
      break
    default:
      IconComponent = MdCheckBox
      iconColorClass = style.success__icon
      title = 'Thành công'
      break
  }

  const handleClearNotify = () => {
    dispatch(removeNotify(notification))
  }

  return (
    <div className={style.notification__card}>
      <div className={`${style.type} ${iconColorClass}`}>
        <IconComponent />
      </div>
      <div className={style.info}>
        <div className={style.title}>{title}</div>
        <div className={style.description}>
          {notification.message}
        </div>
      </div>
      <button
        className={style.icon}
        onClick={handleClearNotify}
      >
        <MdOutlineClose />
      </button>
    </div>
  )
}

export default Item
