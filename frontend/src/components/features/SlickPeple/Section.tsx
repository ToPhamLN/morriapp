import React from 'react'
import style from '~/styles/Home.module.css'
import style2 from '~/styles/Card.module.css'
import CardPeople from '../CardPeople'
import { DPerson } from '~/types/data'
interface Props {
  setExit: React.Dispatch<React.SetStateAction<boolean>>
  nameSection: string
  listPerson: DPerson[]
}
const Section = ({
  setExit,
  nameSection,
  listPerson
}: Props) => {
  return (
    <div className={style.section__playlistrow}>
      <div className={style.container}>
        <button
          className={style.exit}
          onClick={() => setExit(false)}
        >
          X
        </button>
        <h1>{nameSection}</h1>
        <div className={`${style.wrapper} ${style2.grid}`}>
          {listPerson?.map((person, index) => (
            <CardPeople person={person} key={index} />
          ))}
        </div>
      </div>
    </div>
  )
}

export default Section
