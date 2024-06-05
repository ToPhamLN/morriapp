import React from 'react'
import style from '~/styles/InputBox.module.css'
interface Props {
  handleToggle: () => void
  value: boolean
}

const Toggle = ({ handleToggle, value }: Props) => {
  return (
    <div className={style.toggle}>
      <input
        type='checkbox'
        id='switch'
        checked={value}
        onChange={handleToggle}
      />
      <label htmlFor='switch'>Toggle</label>
    </div>
  )
}

export default Toggle
