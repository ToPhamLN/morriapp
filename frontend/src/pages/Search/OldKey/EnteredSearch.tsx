import { MdOutlineClose } from 'react-icons/md'
import { useNavigate } from 'react-router-dom'
import { useAppDispatch } from '~/hooks'
import style from '~/styles/Search.module.css'
import { SearchItem } from '~/types/slice'
import { removeSearchItem } from '~/reduxStore/globalSlice'

interface Props {
  item: SearchItem
}
const EnteredSearch = ({ item }: Props) => {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const clickHandler = () => {
    navigate(item?.path || '')
  }

  const deleteHandler = () => {
    dispatch(removeSearchItem(item))
  }

  return (
    <div className={style.child}>
      <div
        onClick={clickHandler}
        className={style.child__wrapper}
      >
        <div className={style.icon}>
          <img
            src={
              item?.image?.path || '/src/assets/disc.png'
            }
            alt=''
          />
        </div>
        <div className={style.name}>{item.title}</div>
      </div>
      <button
        className={style.delete}
        onClick={deleteHandler}
      >
        <MdOutlineClose />
      </button>
    </div>
  )
}

export default EnteredSearch
