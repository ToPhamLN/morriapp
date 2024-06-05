import React, { useRef } from 'react'
import { GrNext, GrPrevious } from 'react-icons/gr'
import { Link } from 'react-router-dom'
import Slider, { Settings } from 'react-slick'
import style from '~/styles/Home.module.css'

const HomeSlick: React.FC = () => {
  const slideRef = useRef<Slider | null>(null)

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: false
  } as Settings

  const prev = () => {
    const slick = slideRef.current
    if (slick) {
      slick.slickPrev()
    }
  }

  const next = () => {
    const slick = slideRef.current
    if (slick) {
      slick.slickNext()
    }
  }
  const lists = [
    {
      title: 'Ưu thích',
      photo: {
        path: '/src/assets/rank.jpg'
      },
      link: '/rank/likes'
    },
    {
      title: 'Nghe nhiều',
      photo: {
        path: '/src/assets/rank2.png'
      },
      link: '/rank/listens'
    },
    {
      title: 'Nhạc mới',
      photo: {
        path: '/src/assets/rank2.jpg'
      },
      link: '/rank/lasted'
    }
  ]
  return (
    <div className={style.slider}>
      <Slider ref={slideRef} {...settings}>
        {lists.map((slider, index) => (
          <Child key={index} slider={slider} />
        ))}
      </Slider>
      <button
        className={style.btn__prev}
        onClick={() => prev()}
      >
        <GrPrevious />
      </button>
      <button
        className={style.btn__next}
        onClick={() => next()}
      >
        <GrNext />
      </button>
    </div>
  )
}

export default HomeSlick

const Child = ({
  slider
}: {
  slider: {
    title: string
    photo: {
      path: string
    }
    link: string
  }
}) => {
  return (
    <Link to={slider.link}>
      <div className={style.item__slider}>
        <img
          src={slider.photo.path}
          alt='Poster Playlist'
        />
        <h1>{slider.title}</h1>
      </div>
    </Link>
  )
}
