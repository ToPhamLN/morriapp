import React from 'react'
import { MdOutlineClose } from 'react-icons/md'
import { ItemNotify } from '~/components/features'
import style from '~/styles/Navbar.module.css'
import { DNotifiction } from '~/types/data'

interface Props {
  refItem: React.MutableRefObject<HTMLDivElement | null>
  setExit: () => void
  notifications: DNotifiction[]
}

const Notify = ({
  refItem,
  setExit,
  notifications
}: Props) => {
  return (
    <div className={style.more__notify} ref={refItem}>
      <div className={style.header}>
        <h2>Thông báo</h2>
        <button className={style.icon} onClick={setExit}>
          <MdOutlineClose />
        </button>
      </div>
      <div className={style.content}>
        {notifications?.length > 0 &&
          notifications?.map((notification, index) => (
            <ItemNotify
              key={index}
              notification={notification}
            />
          ))}
      </div>
    </div>
  )
}

export default Notify
