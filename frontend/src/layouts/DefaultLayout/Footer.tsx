import React from 'react'
import {
  FaFacebook,
  FaInstagram,
  FaTwitter
} from 'react-icons/fa'
import { MdCopyright } from 'react-icons/md'
import style from '~/styles/Footer.module.css'

const Footer: React.FC = () => {
  return (
    <div className={style.footer}>
      <div className={style.top}>
        <div className={style.item}>
          <div className={style.logo}>
            <span className={style.logo__text}>MORRI</span>
            <div className={style.logo__image}>
              <img
                src='/src/assets/favicon.ico'
                alt='Logo'
              />
            </div>
          </div>
          <div className={style.bio}>
            <button>
              <FaInstagram />
            </button>
            <button>
              <FaFacebook />
            </button>
            <button>
              <FaTwitter />
            </button>
          </div>
        </div>
        <div className={style.item}>
          <span>Giới thiệu</span>
          <span>Liên hệ</span>
          <span>Điều khoản và dịch vụ</span>
        </div>
        <div className={style.item}>
          <span>Thành viên cốt lõi</span>
          <span>Nhà phát triển</span>
          <span>Ủng hộ</span>
        </div>
        <div className={style.item}>
          <span>Quảng cáo</span>
          <span>Nhà đầu tư</span>
          <span>Nhà cung cấp</span>
        </div>
      </div>
      <div className={style.stripe}></div>
      <div className={style.bottom}>
        <MdCopyright />
        Morri@2024
      </div>
    </div>
  )
}

export default Footer
