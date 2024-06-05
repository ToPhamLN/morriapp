import { Link } from 'react-router-dom'
import { useHover } from '~/hooks'
import style from '~/styles/Sidebar.module.css'
import { DListTrack } from '~/types/data'

interface Props {
  listTrack: DListTrack
  type?: string
}

const ItemListBar = ({ listTrack, type }: Props) => {
  const { photo, title, category, slug, _id } = listTrack
  const {
    isHovered,
    handleMouseEnter,
    handleMouseLeave,
    hoverPosition
  } = useHover()
  return (
    <Link
      to={
        !type
          ? `/${category?.toLowerCase()}/${slug}${_id}.html`
          : '/wishtrack'
      }
    >
      <div
        className={style.item__list}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div className={style.icon}>
          <img
            src={
              photo?.path
                ? photo?.path
                : '/src/assets/disc.png'
            }
            alt='Image Playlist'
          />
        </div>
        <span className={`${style.name__item}`}>
          {title}
        </span>
        <div className={style.hover__content}>{title}</div>
        {isHovered && (
          <div
            className={style.item__hover__content}
            style={{
              top: hoverPosition.top,
              left: hoverPosition.left
            }}
          >
            {title}
          </div>
        )}
      </div>
    </Link>
  )
}

export default ItemListBar
