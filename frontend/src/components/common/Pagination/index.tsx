import React, { ChangeEvent } from 'react'
import {
  MdKeyboardArrowLeft,
  MdKeyboardArrowRight,
  MdKeyboardDoubleArrowLeft,
  MdKeyboardDoubleArrowRight
} from 'react-icons/md'
import { useSearchParams } from 'react-router-dom'
import style from '~/styles/Table.module.css'

interface Props {
  total: number
}
const Pagination = ({ total }: Props) => {
  const [searchParams, setSearchParams] = useSearchParams()
  const page = parseInt(searchParams.get('page') ?? '1', 10)

  const validHandler = (
    e: ChangeEvent<HTMLInputElement>
  ) => {
    let value = parseInt(e.target.value, 10)
    if (isNaN(value) || value < 1) value = 1
    if (value > total) value = total
    setSearchParams({
      ...Object.fromEntries(searchParams.entries()),
      page: value.toString()
    })
  }

  const changePage = (newPage: number) => {
    if (newPage < 1) newPage = 1
    if (newPage > total) newPage = total
    setSearchParams({
      ...Object.fromEntries(searchParams.entries()),
      page: newPage.toString()
    })
  }

  return (
    <div className={style.pagination}>
      <MdKeyboardDoubleArrowLeft
        className={style.icon}
        onClick={() => changePage(1)}
      />
      <MdKeyboardArrowLeft
        className={style.icon}
        onClick={() => changePage(page - 1)}
      />
      <div className={style.page}>
        <input
          type='number'
          value={page}
          onChange={validHandler}
          min='1'
          max={total}
        />
      </div>
      <MdKeyboardArrowRight
        className={style.icon}
        onClick={() => changePage(page + 1)}
      />
      <MdKeyboardDoubleArrowRight
        className={style.icon}
        onClick={() => changePage(total)}
      />
    </div>
  )
}

export default Pagination
