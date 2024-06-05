import React from 'react'
import style from '~/styles/Sidebar.module.css'
import { useAppSelector } from '~/hooks'
import { GrHomeRounded } from 'react-icons/gr'
import { Link } from 'react-router-dom'
import {
  MdDiscount,
  MdMusicNote,
  MdOutlineLibraryAdd,
  MdOutlineLibraryMusic
} from 'react-icons/md'
import { IoMdAdd } from 'react-icons/io'
const Sidebar: React.FC = () => {
  const { isSidebar } = useAppSelector(
    (state) => state.global
  )
  return (
    <div
      className={`${style.sidebar} ${isSidebar && style.show}`}
    >
      <div className={style.menu}>
        <Link to={'/'} className={style.link}>
          <GrHomeRounded className={style.icon} />
          <span className={style.link__name}>
            Trang chủ
          </span>
          <div className={style.hover__content}>
            Trang chủ
          </div>
        </Link>
        <Link to={'/mytrack'} className={style.link}>
          <MdMusicNote className={style.icon} />
          <span className={style.link__name}>Bài hát</span>
          <div className={style.hover__content}>
            Bài hát
          </div>
        </Link>
        <Link to={'/track/create'} className={style.link}>
          <IoMdAdd className={style.icon} />
          <span className={style.link__name}>
            Thêm bài hát
          </span>
          <div className={style.hover__content}>
            Thêm bài hát
          </div>
        </Link>
        <Link to={'/myproject'} className={style.link}>
          <MdOutlineLibraryMusic className={style.icon} />
          <span className={style.link__name}>
            Dự án của tôi
          </span>
          <div className={style.hover__content}>
            Dự án của tôi
          </div>
        </Link>
        <Link to={'/project/create'} className={style.link}>
          <MdOutlineLibraryAdd className={style.icon} />
          <span className={style.link__name}>
            Tạo dự án mới
          </span>
          <div className={style.hover__content}>
            Tạo dự án mới
          </div>
        </Link>
        <Link to={'/mybio'} className={style.link}>
          <MdDiscount className={style.icon} />
          <span className={style.link__name}>Tiểu sử</span>
          <div className={style.hover__content}>
            Tiểu sử
          </div>
        </Link>
      </div>
    </div>
  )
}

export default Sidebar
