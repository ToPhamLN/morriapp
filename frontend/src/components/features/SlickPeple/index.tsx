import React, { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import style from '~/styles/Home.module.css'
import style2 from '~/styles/Card.module.css'
import CardPeople from '../CardPeople'
import Section from './Section'
import { DPerson } from '~/types/data'

interface Props {
  listPerson: DPerson[]
  nameSection: string
}
const SlickPeople = ({
  listPerson,
  nameSection
}: Props) => {
  const [widthInner, setWithInner] = useState<number>(0)
  const casrouselRef: React.MutableRefObject<HTMLDivElement | null> =
    useRef(null)
  const [openSection, setOpenSection] =
    useState<boolean>(false)

  useEffect(() => {
    const casrousel = casrouselRef.current
    if (casrousel) {
      setWithInner(
        casrousel.scrollWidth - casrousel.offsetWidth
      )
    }
  }, [])
  const render: boolean = listPerson?.length > 0
  if (!render)
    return (
      <div
        className={`${style.playlist__row} loading`}
      ></div>
    )
  return (
    <div className={style.playlist__row}>
      <div className={style.header}>
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
          {listPerson?.map((person, index) => (
            <CardPeople person={person} key={index} />
          ))}
        </motion.div>
      </motion.div>
      {openSection && (
        <Section
          setExit={setOpenSection}
          listPerson={listPerson}
          nameSection={nameSection}
        />
      )}
    </div>
  )
}

export default SlickPeople
