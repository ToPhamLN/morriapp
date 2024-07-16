import {
  useState,
  useRef,
  useEffect,
  useCallback
} from 'react'
import { IoNotifications } from 'react-icons/io5'
import style from '~/styles/Navbar.module.css'
import { IoMdSunny } from 'react-icons/io'
import {
  MdAccountBox,
  MdDarkMode,
  MdManageAccounts
} from 'react-icons/md'
import { RiLogoutBoxFill } from 'react-icons/ri'
import { Link, useNavigate } from 'react-router-dom'
import Notify from './Notify'
import {
  useAppSelector,
  useAppDispatch,
  useAxiosPrivate
} from '~/hooks'
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
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const axios = useAxiosPrivate()

  const notifyRef = useRef<HTMLDivElement | null>(null)
  const moreRef = useRef<HTMLDivElement | null>(null)
  const { role, idRole, accessToken } = useAppSelector(
    (state) => state.profile
  )
  const { theme } = useAppSelector(
    (state) => state.settings
  )

  const moreHandler = useCallback(() => {
    setOpenMore((p) => !p)
  }, [])

  const notifyHandler = useCallback(() => {
    setOpenNotify((p) => !p)
  }, [])

  const handleLogOut = async () => {
    try {
      const res = await axios.post('api/v1/auths/logout', {
        token: accessToken
      })
      console.log(res.data)
    } catch (error) {
      console.log(error)
    }
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
                Tài khoản
              </button>
            </Link>
            {role == 'User' && (
              <Link
                to={`/user/${idRole?.slug}${idRole?._id}.html`}
              >
                <button>
                  <MdAccountBox />
                  Hồ sơ
                </button>
              </Link>
            )}
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
