import React, { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import style from '~/styles/Home.module.css'
import style2 from '~/styles/Card.module.css'
import Section from './Section'
import CardPlaylist from '../CardPlayList'
import { DListTrack } from '~/types/data'

interface Props {
  listListTrack: DListTrack[]
  nameSection: string
}
const SlickPlaylist = ({
  listListTrack,
  nameSection
}: Props) => {
  const [widthInner, setWithInner] = useState<number>(0)
  const casrouselRef: React.MutableRefObject<HTMLDivElement | null> =
    useRef(null)
  const [openSection, setOpenSection] =
    useState<boolean>(false)

  const updateWidthInner = () => {
    const casrousel = casrouselRef.current
    if (casrousel) {
      setWithInner(
        casrousel.scrollWidth - casrousel.offsetWidth
      )
    }
  }
  useEffect(() => {
    updateWidthInner()
    const handleResize = () => {
      updateWidthInner()
    }
    window.addEventListener('resize', handleResize)
    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [listListTrack])
  const render: boolean = listListTrack?.length > 0
  if (!render)
    return (
      <div
        className={`${style.playlist__row} loading`}
      ></div>
    )
  return (
    <div className={style.playlist__row}>
      <div className={`${style.header} `}>
        <h1>{nameSection}</h1>
        <button onClick={() => setOpenSection(true)}>
          Xem tất cả
        </button>
      </div>
      <motion.div
        ref={casrouselRef}
        className={style.carousel}
      >
        <motion.div
          drag='x'
          dragConstraints={{ right: 0, left: -widthInner }}
          className={style2.flex__hidden}
        >
          {listListTrack?.map((list, index) => (
            <CardPlaylist listTrack={list} key={index} />
          ))}
        </motion.div>
      </motion.div>
      {openSection && (
        <Section
          listListTrack={listListTrack}
          setExit={setOpenSection}
          nameSection={nameSection}
        />
      )}
    </div>
  )
}

export default SlickPlaylist
