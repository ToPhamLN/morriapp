import { useNavigate } from 'react-router-dom'
import style from '~/styles/Pure.module.css'
import { IoIosArrowBack } from 'react-icons/io'

const Navigator = () => {
  const navigate = useNavigate()
  return (
    <div className={style.navigator}>
      <button onClick={() => navigate(-1)}>
        <IoIosArrowBack />
      </button>
    </div>
  )
}

export default Navigator
