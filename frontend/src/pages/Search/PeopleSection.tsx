import React from 'react'
import { CardPeople } from '~/components/features'
import style from '~/styles/Card.module.css'
import style2 from '~/styles/Search.module.css'
import { DPerson } from '~/types/data'

interface Props {
  people: DPerson[]
  nameSection: string
}

const PeopleSection = ({ people, nameSection }: Props) => {
  const render: boolean = people?.length > 0
  if (!render)
    return (
      <div
        className={`${style2.map} loading`}
        style={{
          width: 'auto',
          margin: '0 1rem',
          height: '100vh'
        }}
      ></div>
    )
  return (
    <div className={style.map}>
      <h1>{nameSection}</h1>
      <div className={style.grid}>
        {people?.map((person, index) => (
          <CardPeople person={person} key={index} />
        ))}
      </div>
    </div>
  )
}

export default PeopleSection
