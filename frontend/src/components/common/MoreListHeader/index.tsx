import React, { useEffect, useState } from 'react'
import {
  IoHeadset,
  IoHeart,
  IoHeartOutline
} from 'react-icons/io5'
import {
  MdDelete,
  MdOutlineAccountCircle
} from 'react-icons/md'
import { Link } from 'react-router-dom'
import style from '~/styles/MoreList.module.css'
import { FaPen, FaShare } from 'react-icons/fa'
import { DListTrack } from '~/types/data'
import { useAppSelector, useAxiosPrivate } from '~/hooks'
import { ERole } from '~/constants/enum'
import { mutate } from 'swr'

interface Props {
  refItem: React.RefObject<HTMLDivElement>
  location: { top: number; left: number }
  listTrack: DListTrack
  handleAddWishList: () => Promise<void>
  likedListTrack: boolean
}
const MoreListHeader = ({
  location,
  refItem,
  listTrack,
  likedListTrack,
  handleAddWishList
}: Props) => {
  const { idRole, role } = useAppSelector(
    (state) => state?.profile
  )
  const [popUp, setPopUp] = useState<{
    top: number
    left: number
  }>({
    top: 0,
    left: 0
  })
  const axios = useAxiosPrivate()

  const handlePin = async () => {
    try {
      await axios.put(
        `api/v1/listtracks/pin/${listTrack?._id}`
      )
      mutate(`api/v1/listtracks/${listTrack?._id}`)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    const { width, height } =
      refItem.current?.getBoundingClientRect() as DOMRect
    let newTop = location.top
    if (newTop + height + 100 > innerHeight)
      newTop = innerHeight - height - 100
    let newLeft = location.left
    if (newLeft + width > innerWidth)
      newLeft = innerWidth - width - 10
    setPopUp({
      top: newTop,
      left: newLeft
    })
  }, [])
  return (
    <div
      className={`${style.more__option} ${style.header}`}
      ref={refItem}
      style={{
        top: popUp.top,
        left: popUp.left
      }}
    >
      <>
        <div className={style.header}>
          <div className={style.image__option}>
            <img
              src={
                listTrack?.photo?.path ||
                '/src/assets/disc.png'
              }
              alt={listTrack?.photo?.fileName}
            />
          </div>
          <div className={style.track__info__option}>
            <Link
              to={''}
              className={style.track__name__option}
            >
              {listTrack?.title}
            </Link>
            <div className={style.popularity}>
              <div className={style.item__popularity}>
                <IoHeartOutline />
                <span>
                  {listTrack?.likes?.length?.toString()}
                </span>
              </div>
              <div className={style.item__popularity}>
                <IoHeadset />
                <span>
                  {listTrack?.listens?.toString()}
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className={style.choose__option}>
          {idRole?._id == listTrack?.author?._id && (
            <>
              <Link to={'edit'}>
                <button className={style.btn}>
                  <FaPen className={style.icon} />
                  Sửa đổi danh sách này
                </button>
              </Link>
              <button className={style.btn}>
                <MdDelete className={style.icon} />
                Xóa danh sách này
              </button>
              <button
                className={style.btn}
                onClick={handlePin}
              >
                <MdOutlineAccountCircle
                  className={style.icon}
                />
                {listTrack?.pin
                  ? 'Ẩn khỏi hồ sơ'
                  : 'Hiện trên hồ sơ'}
              </button>
            </>
          )}
          {role == ERole.USER &&
            idRole?._id !== listTrack.author?._id && (
              <>
                <button
                  className={style.btn}
                  onClick={handleAddWishList}
                >
                  {likedListTrack ? (
                    <>
                      <IoHeart className={style.icon} />
                      Xóa khỏi thư viện
                    </>
                  ) : (
                    <>
                      <IoHeartOutline
                        className={style.icon}
                      />
                      Thêm vào thư viện
                    </>
                  )}
                </button>
              </>
            )}
          <button
            className={style.btn}
            onClick={() =>
              navigator.clipboard.writeText(
                window.location.href
              )
            }
          >
            <FaShare className={style.icon} />
            Chia sẻ
          </button>
        </div>
      </>
    </div>
  )
}

export default MoreListHeader
