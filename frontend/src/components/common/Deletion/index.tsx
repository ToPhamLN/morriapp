import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { mutate } from 'swr'
import { LoadingIcon } from '~/components/pure'
import { useAppDispatch, useAxiosPrivate } from '~/hooks'
import { setNotify } from '~/reduxStore/globalSlice'
import style from '~/styles/Deletion.module.css'

interface Props {
  setExit: React.Dispatch<React.SetStateAction<boolean>>
  api: string
  navigation?: boolean
  reset?: string
}

const Deletion = ({
  setExit,
  api,
  navigation = false,
  reset
}: Props) => {
  const [loading, setLoading] = useState<boolean>(false)
  const navigate = useNavigate()
  const axios = useAxiosPrivate()
  const dispatch = useAppDispatch()
  const handleDelete = async () => {
    try {
      setLoading(true)
      const res = await axios.delete(api)
      dispatch(
        setNotify({
          type: 'warning',
          message: res?.data?.message
        })
      )
      if (navigation) {
        navigate(-1)
      } else {
        mutate('api/v1/tracks/all')
        mutate(reset)
        setExit(false)
      }
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={style.fixed__container}>
      <div className={style.delete__playlist__card}>
        <h2>Bạn chắc chắn muốn xóa?</h2>
        <div className={style.control}>
          <button
            className={style.delete}
            onClick={handleDelete}
          >
            {loading ? <LoadingIcon /> : 'Xóa'}
          </button>
          <button
            className={style.exit}
            onClick={() => setExit((p) => !p)}
          >
            Hoàn tác
          </button>
        </div>
      </div>
    </div>
  )
}

export default Deletion
