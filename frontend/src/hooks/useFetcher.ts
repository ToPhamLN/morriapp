import axios from '~/api/axios'
import { AxiosRequestConfig } from 'axios'

const useFetcher = () => {
  const fetcher = async (
    url: string,
    config: AxiosRequestConfig = {}
  ) => {
    try {
      const res = await axios.get(url, config)
      return res.data
    } catch (error) {
      console.log(error)
    }
  }
  return fetcher
}

export default useFetcher
