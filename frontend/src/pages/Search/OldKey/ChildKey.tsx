import { FaSearch } from 'react-icons/fa'
import { MdOutlineClose } from 'react-icons/md'
import { useAppDispatch, useSearchHandler } from '~/hooks'
import style from '~/styles/Search.module.css'
import { SearchKey } from '~/types/slice'
import { removeSearchKey } from '~/reduxStore/globalSlice'
interface Props {
  item: SearchKey
}

const ChildKey = ({ item }: Props) => {
  const { searchParams, setSearchParams } =
    useSearchHandler()
  const dispatch = useAppDispatch()
  const clickHandler = () => {
    const query = Object.fromEntries(searchParams.entries())
    query.q = item.title || ''
    setSearchParams(query)
  }

  const deleteHandler = () => {
    dispatch(removeSearchKey(item))
  }
  return (
    <div className={style.child}>
      <div
        className={style.child__wrapper}
        onClick={clickHandler}
      >
        <div className={style.icon}>
          <FaSearch />
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

export default ChildKey
