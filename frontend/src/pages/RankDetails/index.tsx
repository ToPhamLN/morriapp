import { useState, useMemo, useEffect } from 'react'
import { IoMdDownload } from 'react-icons/io'
import {
  MdAudiotrack,
  MdOutlineAccessTime
} from 'react-icons/md'
import style from '~/styles/ArtistAlbumDetails.module.css'
import { useAppSelector, useFetcher } from '~/hooks'
import { DListTrack, DTrack } from '~/types/data'
import { Playlist } from '~/components/features'
import useSWR from 'swr'
import { formatTime } from '~/utils/format'
import { ERole } from '~/constants/enum'
import { Link, useParams } from 'react-router-dom'

const RankDetails = () => {
  const { role } = useAppSelector((state) => state.profile)
  const fetcher = useFetcher()
  const { rankParam } = useParams()
  let title: string
  let path: string
  switch (rankParam) {
    case 'likes':
      title = 'Top 100 bài ưu thích nhất'
      path = '/src/assets/rank.jpg'
      break
    case 'listens':
      title = 'Top 100 bài nghe nhiều nhất'
      path = '/src/assets/rank2.png'
      break
    case 'lasted':
    default:
      title = 'Top 100 bài mới nhất'
      path = '/src/assets/rank2.jpg'
      break
  }

  const [listTrack, setListTrack] = useState<DListTrack>({
    title: title,
    description: '',
    photo: {
      path: path,
      fileName: 'rank'
    },
    background: '#0F172A',
    author: {
      avatar: {
        path: 'https://res.cloudinary.com/dohywtebw/image/upload/v1715144293/morri-app/zahkv9uxa2h7akadbrua.png',
        fileName: 'morri-app/zahkv9uxa2h7akadbrua'
      },
      _id: '663b066739930e9c5a603af3',
      username: 'Morri',
      role: 'User',
      slug: 'morri'
    },
    list: [],
    genre: []
  })
  const api = 'api/v1/tracks/rank'
  const { data: list } = useSWR(api, () =>
    fetcher(api, {
      params: {
        type: rankParam
      }
    })
  )
  useEffect(() => {
    setListTrack((prevListTrack) => ({
      ...prevListTrack,
      list: list
    }))
  }, [list])
  const durationAll = useMemo(() => {
    if (listTrack) {
      return listTrack?.list?.reduce(
        (accumulator, track: DTrack) =>
          accumulator + (track?.duration ?? 0),
        0
      )
    }
    return 0
  }, [listTrack])
  const categoryAuthor =
    listTrack?.author?.role === 'Artist' ? 'artist' : 'user'
  return (
    <div className={style.artist__album__details}>
      <div className={style.information}>
        <div
          className={style.background}
          style={{ background: listTrack?.background }}
        ></div>
        <div className={style.container__information}>
          <div className={style.photo}>
            <img
              src={
                listTrack?.photo?.path ||
                '/src/assets/disc.png'
              }
              alt={listTrack?.photo?.fileName}
            />
          </div>
          <h1 className={style.listtrack__title}>
            {listTrack?.title}
          </h1>
        </div>
      </div>
      <div className={style.desc}>
        {listTrack?.description
          ?.split('\n')
          .map((item, index) => (
            <div key={index}>{item}</div>
          ))}
      </div>
      <div className={style.more__information}>
        <Link
          to={`/${categoryAuthor}/${listTrack?.author?.slug}${listTrack?.author?._id}.html`}
        >
          <div className={style.info__user}>
            <div className={style.img__user}>
              <img
                src={
                  listTrack?.author?.avatar?.path
                    ? listTrack?.author?.avatar?.path
                    : '/src/assets/account-default.png'
                }
                alt={listTrack?.author?.avatar?.fileName}
              />
            </div>
            <span className={style.user__name}>
              {listTrack?.author?.username}
            </span>
          </div>
        </Link>
        <ul className={style.statistics}>
          <li>
            {listTrack?.list?.length} <MdAudiotrack />
          </li>
          <li>
            {formatTime(durationAll).toString()}
            <MdOutlineAccessTime />
          </li>
        </ul>
      </div>
      <div className={style.control}>
        {role == ERole.USER && (
          <button className={style.download}>
            <IoMdDownload />
          </button>
        )}
      </div>
      <div style={{ margin: '0 1rem' }}>
        <Playlist list={listTrack?.list as []} />
      </div>
    </div>
  )
}

export default RankDetails
