import React, { ChangeEvent } from 'react'
import style from '~/styles/Navbar.module.css'
import { FaSearch } from 'react-icons/fa'
import { MdOutlineClose } from 'react-icons/md'
import {
  Link,
  useSearchParams,
  useLocation,
  useNavigate
} from 'react-router-dom'

const SearchNav: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const q = searchParams.get('q') ?? ''
  const location = useLocation()
  const navigate = useNavigate()

  const handlerClickSearch = () => {
    if (location.pathname !== '/search') {
      navigate('/search')
    }
  }

  const validHandler = (
    e: ChangeEvent<HTMLInputElement>
  ) => {
    const query = Object.fromEntries(searchParams.entries())
    query.q = e.target.value
    setSearchParams(query)
  }

  const setValidHandler = (value: string) => {
    const query = Object.fromEntries(searchParams.entries())
    query.q = value
    setSearchParams(query)
  }

  return (
    <div
      className={style.input__box}
      onClick={() => handlerClickSearch()}
    >
      <button className={style.icon}>
        <FaSearch />
      </button>
      <input
        type='text'
        name='search'
        placeholder='Tìm kiếm...'
        autoComplete='off'
        value={q}
        onChange={validHandler}
      />
      <button
        className={style.icon}
        onClick={() => setValidHandler('')}
      >
        <MdOutlineClose />
      </button>
    </div>
  )
}

export default SearchNav
