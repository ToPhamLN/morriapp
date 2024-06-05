import React, { useState } from 'react'
import { MdOutlineClose } from 'react-icons/md'
import style from '~/styles/RenamePlayList.module.css'

interface Props {
  setExit: React.Dispatch<React.SetStateAction<boolean>>
}

const RenamePlaylist = (props: Props) => {
  const { setExit } = props
  const [newName, setNewName] = useState<string>('')
  return (
    <div className={style.fixed__container}>
      <div className={style.rename__playlist__card}>
        <button
          className={style.exit}
          onClick={() => setExit((p) => !p)}
        >
          X
        </button>
        <h2>Đổi tên danh sách</h2>
        <div className={style.input__box}>
          <input
            type='text'
            name='search'
            placeholder='Tên danh sách'
            autoComplete='off'
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
          />
          {newName && (
            <button
              className={style.icon}
              onClick={() => setNewName('')}
            >
              <MdOutlineClose />
            </button>
          )}
        </div>
        <button className={style.submit}>Oke</button>
      </div>
    </div>
  )
}

export default RenamePlaylist
