import { useAppSelector } from '~/hooks'
import style from '~/styles/Search.module.css'
import EnteredSearch from './EnteredSearch'
import ChildKey from './ChildKey'
const OldKey = () => {
  const { search } = useAppSelector((state) => state.global)
  return (
    <div className={style.old__key}>
      <h1>Tìm kiếm gần đây</h1>
      <div className={style.container}>
        {search.map((item, index) => {
          if (item.type === 'key') {
            return <ChildKey key={index} item={item} />
          } else if (item.type === 'item') {
            return <EnteredSearch key={index} item={item} />
          }
          return null
        })}
      </div>
    </div>
  )
}

export default OldKey
