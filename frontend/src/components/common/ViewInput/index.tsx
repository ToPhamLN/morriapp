import React from 'react'
import style from '~/styles/InputBox.module.css'

const ViewInput = () => {
  return (
    <div className={style.container}>
      <h1 className={style.name}> Email</h1>
      <p className={style.value}> Pham Lê Nguyễn Tố</p>
    </div>
  )
}

export default ViewInput
