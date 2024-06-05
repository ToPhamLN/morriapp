import { useSearchParams } from 'react-router-dom'
import { useAppDispatch } from '~/hooks'
import {
  addSearchItem,
  addSearchKey
} from '~/reduxStore/globalSlice'
import { DImage } from '~/types/data'
import { SearchItem, SearchKey } from '~/types/slice'

const useSearchHandler = () => {
  const dispatch = useAppDispatch()
  const [searchParams, setSearchParams] = useSearchParams()
  const q = searchParams.get('q') ?? ''

  const handleAddSearch = (
    title?: string,
    image?: DImage,
    path?: string
  ) => {
    if (q) {
      const newKey: SearchKey = {
        type: 'key',
        title: q
      }
      dispatch(addSearchKey(newKey))
      handleAddSearchItem(title, image, path)
    }
  }

  const handleAddSearchItem = (
    title?: string,
    image?: DImage,
    path?: string
  ) => {
    const newItem: SearchItem = {
      type: 'item',
      title: title,
      image: image,
      path: path
    }
    dispatch(addSearchItem(newItem))
  }

  return { handleAddSearch, setSearchParams, searchParams }
}

export default useSearchHandler
