import { axiosPrivate } from '~/api/axios'
import { useEffect } from 'react'
import useRefreshToken from './useRefreshToken'
import { useAppSelector, useAppDispatch } from './redux'
import { setNotify } from '~/reduxStore/globalSlice'
import { IProfile } from '~/types/slice'

const useAxiosPrivate = () => {
  const refresh = useRefreshToken()
  const dispatch = useAppDispatch()
  const profile = useAppSelector(
    (state) => state.profile
  ) as IProfile

  useEffect(() => {
    const requestIntercept =
      axiosPrivate.interceptors.request.use(
        (config) => {
          if (!config.headers['token']) {
            config.headers['token'] =
              `Bearer ${profile?.accessToken}`
          }
          return config
        },
        (error) => Promise.reject(error)
      )

    const responseIntercept =
      axiosPrivate.interceptors.response.use(
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
          const prevRequest = error?.config
          if (
            error?.response?.status === 403 &&
            !prevRequest?.sent
          ) {
            prevRequest.sent = true
            const newAccessToken = await refresh()
            prevRequest.headers['token'] =
              `Bearer ${newAccessToken}`
            return axiosPrivate(prevRequest)
          }
          return Promise.reject(error)
        }
      )

    return () => {
      axiosPrivate.interceptors.request.eject(
        requestIntercept
      )
      axiosPrivate.interceptors.response.eject(
        responseIntercept
      )
    }
  }, [profile, refresh])

  return axiosPrivate
}

export default useAxiosPrivate
