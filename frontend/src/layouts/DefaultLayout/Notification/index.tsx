import React, { useEffect } from 'react'
import style from '~/styles/Notification.module.css'
import Item from './Item'
import { useAppDispatch, useAppSelector } from '~/hooks'
import { removeNotify } from '~/reduxStore/globalSlice'

const Notification: React.FC = () => {
  const { notify } = useAppSelector((state) => state.global)

  const dispatch = useAppDispatch()

  useEffect(() => {
    if (notify.length > 0) {
      const timer = setTimeout(() => {
        const itemToRemove = notify[0]

        setTimeout(() => {
          dispatch(removeNotify(itemToRemove))
        }, 500)
      }, 3000)

      return () => clearTimeout(timer)
    }
  }, [notify])

  return (
    <div className={style.notification}>
      {notify.map((item) => (
        <Item key={item.message} notification={item} />
      ))}
    </div>
  )
}

export default Notification
