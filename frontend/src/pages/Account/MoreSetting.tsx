import React from 'react'
import { IoMdMoon } from 'react-icons/io'
import { Toggle } from '~/components/common'
import { useAppDispatch, useAppSelector } from '~/hooks'
import { setThemeMode } from '~/reduxStore/settingsSlice'
import style from '~/styles/Account.module.css'

const MoreSetting = () => {
  const dispatch = useAppDispatch()
  const handleTheme = () => {
    dispatch(setThemeMode())
  }
  const { theme } = useAppSelector(
    (state) => state.settings
  )
  return (
    <div className={style.content}>
      <div className={style.toggle__item}>
        <div className={style.toggle__name}>
          <IoMdMoon />
          Chế độ tối
        </div>
        <Toggle handleToggle={handleTheme} value={theme} />
      </div>
    </div>
  )
}

export default MoreSetting
