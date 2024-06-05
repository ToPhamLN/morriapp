import React from 'react'
import style from '~/styles/Error.module.css'
import { useNavigate } from 'react-router-dom'

const NotFound: React.FC = () => {
  const navigate = useNavigate()
  return (
    <div className={style.error__page}>
      <div className={style.container}>
        <div className={style.status}>
          <h1 className={style.code}>404</h1>
          <div className={style.image}>
            <img src='/src/assets/404.png' alt='' />
          </div>
        </div>
        <div className={style.title}>
          Tại sao bạn lại ở đây ?
        </div>
        <div className={style.message}>
          Bạn không được phép ở đây :)))
        </div>
        <div
          className={style.control}
          onClick={() => navigate('/')}
        >
          <button>Về trang chủ</button>
        </div>
      </div>
    </div>
  )
}

export default NotFound
