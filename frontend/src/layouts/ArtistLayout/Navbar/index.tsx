import React, { useEffect } from 'react'
import style from '~/styles/Navbar.module.css'
import logoImage from '~/assets/favicon.ico'
import { Link, useLocation } from 'react-router-dom'
import { SearchNav } from '~/components/features'
import { MdMenu } from 'react-icons/md'
import {
  useAppDispatch,
  useAppSelector,
  useFetcher
} from '~/hooks'
import { setIsSidebar } from '~/reduxStore/globalSlice'
import Auth from './Auth'
import useSWR, { mutate } from 'swr'
import { DNotifiction } from '~/types/data'

const Navbar: React.FC = () => {
  const dispatch = useAppDispatch()
  const handleMount = () => dispatch(setIsSidebar())
  const { idRole, role } = useAppSelector(
    (state) => state.profile
  )
  const { pathname } = useLocation()
  const fether = useFetcher()
  const apiNotifications = 'api/v1/notifications/mine'
  const { data: notifications } = useSWR(
    idRole ? apiNotifications : null,
    () => {
      if (idRole)
        return fether(apiNotifications, {
          params: {
            receiver: idRole,
            receiverCategory: role
          }
        })
      return []
    }
  ) as { data: DNotifiction[] }

  useEffect(() => {
    mutate('api/v1/notifications/mine')
  }, [idRole, role, pathname])
  return (
    <div className={style.navbar}>
      <div className={style.logo}>
        <button
          className={style.menu__sidebar}
          onClick={handleMount}
        >
          <MdMenu />
        </button>
        <Link to={'/'} className={style.link__logo}>
          <span className={style.logo__text}>MORRI</span>
          <div className={style.logo__image}>
            <img src={logoImage} alt='Logo' />
          </div>
        </Link>
      </div>
      <div className={style.nav__center}>
        <SearchNav />
      </div>
      {idRole ? (
        <Auth notifications={notifications} />
      ) : (
        <div className={style.login__link}>
          <Link to={'/login'}>
            <button>Đăng nhập</button>
          </Link>
          <Link to={'/signup'}>
            <button>Đăng ký</button>
          </Link>
        </div>
      )}
    </div>
  )
}

export default Navbar
