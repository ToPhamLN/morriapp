import React from 'react'
import style from '~/styles/Deletion.module.css'

interface Props {
  setExit: React.Dispatch<React.SetStateAction<boolean>>
}

const Deletion = (props: Props) => {
  const { setExit } = props
  return (
    <div className={style.fixed__container}>
      <div className={style.delete__playlist__card}>
        <button
          className={style.exit}
          onClick={() => setExit((p) => !p)}
        >
          X
        </button>
        <h2>Bạn chắc chắn muốn xóa?</h2>
        <div className={style.control}>
          <button className={style.delete}>Xóa</button>
          <button>Hoàn tác</button>
        </div>
      </div>
    </div>
  )
}

export default Deletion
