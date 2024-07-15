import React from 'react'
import Passport from '~/pages/Auth/Passport'
import style from '~/styles/PromptAuth.module.css'
import {
  Navigate,
  useLocation,
  useNavigate
} from 'react-router-dom'

interface Props {
  setExit: React.Dispatch<React.SetStateAction<boolean>>
  photo?: string
}

const PromptAuth = ({ setExit, photo }: Props) => {
  const { pathname } = useLocation()
  const navigate = useNavigate()
  return (
    <div className={style.fixed__container}>
      <div className={style.card}>
        <button
          className={style.exit}
          onClick={() => setExit((p) => !p)}
        >
          X
        </button>
        <div className={style.photo}>
          <img src={photo} />
        </div>
        <div className={style.navigation}>
          <h1>
            Vui lòng đăng nhập để có trải nghiệm tốt nhất
          </h1>
          <Passport />
          <button
            className={style.btn}
            onClick={() =>
              navigate('/login', {
                state: { history: pathname }
              })
            }
          >
            Đăng nhập
          </button>
          <button
            className={style.btn}
            onClick={() =>
              navigate('/signup', {
                state: { history: pathname }
              })
            }
          >
            Đăng kí
          </button>
        </div>
      </div>
    </div>
  )
}

export default PromptAuth
