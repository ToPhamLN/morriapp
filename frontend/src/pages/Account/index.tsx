import React, { useState } from 'react'
import {
  IoIosArrowDown,
  IoIosArrowUp
} from 'react-icons/io'
import style from '~/styles/Account.module.css'
import MoreAccount from './MoreAccount'
import MoreSetting from './MoreSetting'

const Account = () => {
  const [moreAccount, setMoreAccount] =
    useState<boolean>(false)

  const [moreSetting, setMoreSetting] =
    useState<boolean>(false)
  return (
    <div className={style.account}>
      <div className={style.map}>
        <div className={style.head}>
          <h3>Tài khoản</h3>
          <button
            className={style.more}
            onClick={() => setMoreAccount((p) => !p)}
          >
            {moreAccount ? (
              <IoIosArrowUp />
            ) : (
              <IoIosArrowDown />
            )}
          </button>
        </div>
        {moreAccount && <MoreAccount />}
      </div>
      <div className={style.map}>
        <div className={style.head}>
          <h3>Cài đặt</h3>
          <button
            className={style.more}
            onClick={() => setMoreSetting((p) => !p)}
          >
            {moreSetting ? (
              <IoIosArrowUp />
            ) : (
              <IoIosArrowDown />
            )}
          </button>
        </div>
        {moreSetting && <MoreSetting />}
      </div>
    </div>
  )
}

export default Account
