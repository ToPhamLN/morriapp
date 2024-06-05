import {
  useState,
  useRef,
  useEffect,
  useCallback
} from 'react'
import { IoNotifications } from 'react-icons/io5'
import style from '~/styles/Navbar.module.css'
import { IoMdSunny } from 'react-icons/io'
import { MdDarkMode } from 'react-icons/md'
import { MdManageAccounts } from 'react-icons/md'
import { RiLogoutBoxFill } from 'react-icons/ri'
import { Link, useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '~/hooks'
import Notify from '~/layouts/DefaultLayout/Navbar/Notify'
import { DNotifiction } from '~/types/data'
import { setThemeMode } from '~/reduxStore/settingsSlice'
import { setProfile } from '~/reduxStore/profileSlice'

interface Props {
  notifications: DNotifiction[]
}
const Auth = ({ notifications }: Props) => {
  const [openMore, setOpenMore] = useState<boolean>(false)
  const [openNotify, setOpenNotify] =
    useState<boolean>(false)
  const { idRole } = useAppSelector(
    (state) => state.profile
  )
  const { theme } = useAppSelector(
    (state) => state.settings
  )
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  const notifyRef = useRef<HTMLDivElement | null>(null)
  const moreRef = useRef<HTMLDivElement | null>(null)

  const moreHandler = useCallback(() => {
    setOpenMore((p) => !p)
  }, [])

  const notifyHandler = useCallback(() => {
    setOpenNotify((p) => !p)
  }, [])
  const handleLogOut = () => {
    dispatch(setProfile({}))
    navigate('/login')
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        moreRef.current &&
        !moreRef.current.contains(event.target as Node)
      ) {
        moreHandler()
      }
      if (
        notifyRef.current &&
        !notifyRef.current.contains(event.target as Node)
      ) {
        notifyHandler()
      }
    }

    document.addEventListener(
      'mousedown',
      handleClickOutside
    )

    return () => {
      document.removeEventListener(
        'mousedown',
        handleClickOutside
      )
    }
  }, [moreRef, notifyRef, moreHandler])

  return (
    <div className={style.nav__auth}>
      <div className={style.notify}>
        <button onClick={notifyHandler}>
          <IoNotifications />
        </button>
      </div>
      <div className={style.auth} onClick={moreHandler}>
        <img
          src={
            idRole?.avatar?.path ||
            '/src/assets/account-default.png'
          }
          alt=''
        />
        {openMore && (
          <div className={style.more__card} ref={moreRef}>
            <Link to={'/account'}>
              <button>
                <MdManageAccounts />
                Tải khoản
              </button>
            </Link>
            <button
              onClick={() => dispatch(setThemeMode())}
            >
              {theme ? (
                <>
                  <IoMdSunny />
                  Sáng
                </>
              ) : (
                <>
                  <MdDarkMode />
                  Tối
                </>
              )}
            </button>
            <button onClick={handleLogOut}>
              <RiLogoutBoxFill />
              Đăng xuất
            </button>
          </div>
        )}
        {openNotify && (
          <Notify
            refItem={notifyRef}
            setExit={() => setOpenNotify(false)}
            notifications={notifications}
          />
        )}
      </div>
    </div>
  )
}

export default Auth
