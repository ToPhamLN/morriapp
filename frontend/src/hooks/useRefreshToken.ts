import axios from '../api/axios'
import { useAppDispatch } from './redux'
import { updateProfile } from '~/reduxStore/profileSlice'

const useRefreshToken = (): (() => Promise<string>) => {
  const dispatch = useAppDispatch()

  const refresh = async (): Promise<string> => {
    try {
      const res = await axios.get('/refresh', {
        withCredentials: true
      })
      dispatch(updateProfile(res.data))
      return res.data.accessToken
    } catch (error) {
      console.error('Error useRefreshToken', error)
      throw error
    }
  }

  return refresh
}

export default useRefreshToken
