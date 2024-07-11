import React from 'react'
import style from '~/styles/Sidebar.module.css'
import { useAppSelector } from '~/hooks'
import { GrHomeRounded } from 'react-icons/gr'
import { Link } from 'react-router-dom'
import {
  MdMessage,
  MdMusicNote,
  MdOutlineAdd,
  MdOutlineBookmarkBorder,
  MdOutlineLibraryMusic
} from 'react-icons/md'
import { IoPeople } from 'react-icons/io5'

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
        <Link to={'/track'} className={style.link}>
          <MdMusicNote className={style.icon} />
          <span className={style.link__name}>Bài hát</span>
          <div className={style.hover__content}>
            Bài hát
          </div>
        </Link>
        <Link to={'/list'} className={style.link}>
          <MdOutlineLibraryMusic className={style.icon} />
          <span className={style.link__name}>Album</span>
          <div className={style.hover__content}>Album</div>
        </Link>

        <Link to={'/artist'} className={style.link}>
          <IoPeople className={style.icon} />
          <span className={style.link__name}>Nghệ sĩ</span>
          <div className={style.hover__content}>
            Nghệ sĩ
          </div>
        </Link>
        <Link to={'/user'} className={style.link}>
          <IoPeople className={style.icon} />
          <span className={style.link__name}>
            Người dùng
          </span>
          <div className={style.hover__content}>
            Người dùng
          </div>
        </Link>
        <Link to={'/report'} className={style.link}>
          <MdMessage className={style.icon} />
          <span className={style.link__name}>Phản hồi</span>
          <div className={style.hover__content}>
            Phản hồi
          </div>
        </Link>
        <Link to={'/mylist'} className={style.link}>
          <MdOutlineBookmarkBorder />
          <span className={style.link__name}>Thư viện</span>
          <div className={style.hover__content}>
            Thư viện
          </div>
        </Link>
        <Link to={'mylist/create'} className={style.link}>
          <MdOutlineAdd className={style.icon} />
          <span className={style.link__name}>
            Thêm playlist mới
          </span>
          <div className={style.hover__content}>
            Thêm playlist mới
          </div>
        </Link>
      </div>
    </div>
  )
}

export default Sidebar
