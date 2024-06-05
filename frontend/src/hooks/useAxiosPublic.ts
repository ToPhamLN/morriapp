import axios from '~/api/axios'
import { useEffect } from 'react'
import { useAppDispatch } from './redux'
import { setNotify } from '~/reduxStore/globalSlice'

const useAxiosPublic = () => {
  const dispatch = useAppDispatch()

  useEffect(() => {
    const responseIntercept =
      axios.interceptors.response.use(
        (response) => response,
        async (error) => {
          dispatch(
            setNotify({
              type: 'error',
              message:
                error?.response?.data?.message ??
                'Đã xảy ra lỗi!'
            })
          )
          return Promise.reject(error)
        }
      )

    return () => {
      axios.interceptors.response.eject(responseIntercept)
    }
  }, [dispatch])

  return axios
}

export default useAxiosPublic
